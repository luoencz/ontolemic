# Stat Tracking Backend Architecture

## Overview

The stat tracking backend collects and stores website usage statistics, with a focus on tracking active user sessions. It uses HTTP POST requests to a static API route for event ingestion from the frontend. A separate WebSocket (WS) connection is used for real-time stats updates when the stats page is open. Key features include visitor identification via unique cookie IDs and IP hashes, session management based on heartbeat events, and automatic session termination after inactivity.

The system prioritizes robustness, using database tables for persistence and async jobs for timeout handling to ensure scalability and minimal resource overhead.

## Database Schema

### Visitor Table
- `id`: Primary key (auto-increment).
- `cookie_id`: Unique identifier from browser cookie (string, unique).
- `ip_hash`: Hashed IP address for anonymity (string).
- `created_at`: Timestamp of first visit.
- `last_seen_at`: Timestamp of last activity.

### Session Table
- `id`: Primary key (auto-increment).
- `visitor_id`: Foreign key referencing Visitor.id.
- `start_time`: Timestamp when session started.
- `end_time`: Timestamp when session ended (null if active).
- `last_heartbeat`: Timestamp of last heartbeat.
- `is_active`: Boolean flag (true for active sessions).
- `action_count`: Integer counter for number of actions (heartbeats) in the session.
- Additional fields: e.g., duration (computed on end), other stats as needed.

Sessions link to visitors via `visitor_id`. Heartbeats and actions are associated with sessions via foreign keys (expand schema as needed for stats).

## Components

### Heartbeat API Endpoint

- Receives heartbeat events from frontend via HTTP POST (e.g., page navigation, scrolls, clicks).
- Each request includes the cookie_id, IP (for hashing), and event details.
- Verifies via cookie_id and IP hash for security.

### Session Manager
- On heartbeat receipt:
  - Query active session for the cookie_id.
  - If exists and active:
    - Update `last_heartbeat` timestamp.
    - Increment `action_count`.
    - Attribute the action to this session (e.g., log event if detailed tracking enabled).
    - Reset the async timeout job for this session.
  - If no active session:
    - Create new session entry with `start_time` now, `is_active=true`, `action_count=1`.
    - Link to existing or new visitor (create if cookie_id unknown).
    - Schedule async job to terminate session after 60 seconds.
- Heartbeats trigger stats updates (e.g., increment action counts and other metrics).

### Timeout Mechanism
- For each active session, schedule an async job (e.g., via Celery, BullMQ, or similar queue) to run after 60 seconds from last_heartbeat.
- On new heartbeat, cancel and reschedule the job for +60 seconds.
- If job executes (no reset occurred):
  - Set `end_time` to now.
  - Set `is_active` to false.
  - Compute final stats (e.g., duration = end_time - start_time; total_actions = action_count).
- Use a job queue to handle scheduling reliably, preventing overload from many sessions.

## Flow Diagram

1. Frontend sends heartbeat via HTTP POST with cookie_id, IP, event data.
2. Backend verifies visitor (create if new).
3. Check for active session:
   - Yes: Update timestamps, attribute event, reset timeout job.
   - No: Create session, schedule timeout job, attribute event.
4. If timeout job fires: Mark session inactive, update stats.

## Extensibility
- Add tables for detailed events (e.g., Event table with session_id, type, timestamp, details) to enable advanced analytics.
- Integrate with analytics tools for aggregation (e.g., daily visitor counts, action breakdowns).
- Ensure GDPR compliance: Anonymize data, allow opt-out.
- Design schema to easily add more session stats fields (e.g., pages_visited, scroll_depth) as requirements evolve.

Refer to project README.md for setup and dependencies (e.g., database ORM like SQLAlchemy, API framework like FastAPI, WS library like Socket.IO for live stats).
