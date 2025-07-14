"""APScheduler setup for managing session timeouts."""
from datetime import datetime, timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.date import DateTrigger
from sqlalchemy.future import select
from .models import Session
from .database import LocalSession
from .services import end_session, compute_stats

# Create scheduler instance
scheduler = AsyncIOScheduler()


async def end_session_with_broadcast(session_id: int):
    """End session and broadcast stats update if WebSocket manager is available."""
    should_broadcast = await end_session(session_id)
    
    if should_broadcast:
        # Import here to avoid circular import
        from .api.websockets import manager
        
        if manager.active_connections:
            stats = await compute_stats()
            await manager.broadcast({
                'type': 'stats-update', 
                'data': stats, 
                'timestamp': datetime.utcnow().isoformat()
            })


def schedule_session_end(session_id: int, delay_seconds: int = 60):
    """Schedule a session to end after the specified delay."""
    # Remove existing job if any
    if scheduler.get_job(str(session_id)):
        scheduler.remove_job(str(session_id))
    
    # Schedule new job
    scheduler.add_job(
        end_session_with_broadcast,
        trigger=DateTrigger(
            run_date=datetime.utcnow() + timedelta(seconds=delay_seconds)
        ),
        id=str(session_id),
        args=[session_id]
    )


async def init_scheduler():
    """Initialize scheduler and reschedule active sessions."""
    # Start the scheduler
    scheduler.start()
    
    # Schedule existing active sessions
    async with LocalSession() as db:
        result = await db.execute(select(Session).filter_by(is_active=True))
        active_sessions = result.scalars().all()
        
        for sess in active_sessions:
            time_left = (
                sess.last_heartbeat + timedelta(seconds=60) - datetime.utcnow()
            ).total_seconds()
            
            if time_left <= 0:
                await end_session_with_broadcast(sess.id)  # type: ignore
            else:
                schedule_session_end(sess.id, int(time_left))  # type: ignore


def shutdown_scheduler():
    """Shutdown the scheduler gracefully."""
    scheduler.shutdown() 