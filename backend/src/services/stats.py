"""Statistics and session management service."""
from datetime import datetime
from sqlalchemy import func, desc
from sqlalchemy.future import select
from ..models import Session, Visitor
from ..database import LocalSession


async def end_session(session_id: int):
    """End an active session and broadcast update if needed."""
    async with LocalSession() as db:
        result = await db.execute(select(Session).filter_by(id=session_id))
        sess = result.scalar_one_or_none()
        if sess and sess.is_active:
            sess.end_time = datetime.utcnow()
            sess.is_active = False
            sess.duration = (sess.end_time - sess.start_time).total_seconds()
            await db.commit()
            
            # Return True to indicate stats should be broadcast
            return True
    return False


async def compute_stats():
    """Compute visitor and session statistics."""
    async with LocalSession() as db:
        # Total visitors
        total_visitors_result = await db.execute(select(func.count(Visitor.id)))
        total_visitors = total_visitors_result.scalar()
        
        # Total sessions
        total_sessions_result = await db.execute(select(func.count(Session.id)))
        total_sessions = total_sessions_result.scalar()
        
        # Active sessions
        active_sessions_result = await db.execute(
            select(func.count(Session.id)).filter_by(is_active=True)
        )
        active_sessions = active_sessions_result.scalar()
        
        # Recent sessions (last 10)
        recent_sessions_result = await db.execute(
            select(Session).order_by(desc(Session.start_time)).limit(10)
        )
        recent_sessions = recent_sessions_result.scalars().all()
        
        # Average session duration (completed sessions only)
        avg_duration_result = await db.execute(
            select(func.avg(Session.duration)).filter(Session.duration.isnot(None))
        )
        avg_duration = avg_duration_result.scalar() or 0
        
        # Average actions per session
        avg_actions_result = await db.execute(
            select(func.avg(Session.action_count))
        )
        avg_actions = avg_actions_result.scalar() or 0
        
        return {
            'totalVisitors': total_visitors or 0,
            'totalSessions': total_sessions or 0,
            'activeSessions': active_sessions or 0,
            'avgSessionDuration': round(avg_duration, 2),
            'avgActionsPerSession': round(avg_actions, 2),
            'recentSessions': [
                {
                    'id': sess.id,
                    'startTime': sess.start_time.isoformat(),
                    'endTime': sess.end_time.isoformat() if sess.end_time else None,
                    'duration': sess.duration,
                    'actionCount': sess.action_count,
                    'isActive': sess.is_active
                }
                for sess in recent_sessions
            ],
            'lastUpdate': datetime.utcnow().isoformat()
        } 