-- ============================================================
-- TwinShield: Performance Indexes
-- Run AFTER schema.sql in the Supabase SQL editor.
-- ============================================================

create index if not exists idx_lab_sessions_user_id        on public.lab_sessions(user_id);
create index if not exists idx_lab_sessions_ended_at       on public.lab_sessions(ended_at);
create index if not exists idx_task_completions_session_id on public.task_completions(session_id);
create index if not exists idx_quiz_results_session_id     on public.quiz_results(session_id);
create index if not exists idx_user_badges_user_id         on public.user_badges(user_id);
