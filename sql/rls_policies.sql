-- ============================================================
-- TwinShield: Row Level Security (RLS) Policies
-- Run AFTER schema.sql in the Supabase SQL editor.
--
-- NOTE: All server-side code uses supabaseAdmin (service role)
-- which bypasses RLS. These policies protect against accidental
-- use of the anon/public client.
-- ============================================================

-- Enable RLS on all tables
alter table public.users          enable row level security;
alter table public.lab_sessions   enable row level security;
alter table public.task_completions enable row level security;
alter table public.quiz_results   enable row level security;
alter table public.user_badges    enable row level security;
alter table public.agent_settings enable row level security;

-- ─────────────────────────────────────────────
-- USERS: users can only read/update their own row
-- ─────────────────────────────────────────────
create policy "users_select_own" on public.users
    for select using (auth.uid() = id);

create policy "users_update_own" on public.users
    for update using (auth.uid() = id);

-- ─────────────────────────────────────────────
-- LAB SESSIONS: users can only access their own sessions
-- ─────────────────────────────────────────────
create policy "lab_sessions_select_own" on public.lab_sessions
    for select using (auth.uid() = user_id);

create policy "lab_sessions_insert_own" on public.lab_sessions
    for insert with check (auth.uid() = user_id);

create policy "lab_sessions_update_own" on public.lab_sessions
    for update using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- TASK COMPLETIONS: access via owning session
-- ─────────────────────────────────────────────
create policy "task_completions_select_own" on public.task_completions
    for select using (
        exists (
            select 1 from public.lab_sessions ls
            where ls.id = session_id and ls.user_id = auth.uid()
        )
    );

create policy "task_completions_insert_own" on public.task_completions
    for insert with check (
        exists (
            select 1 from public.lab_sessions ls
            where ls.id = session_id and ls.user_id = auth.uid()
        )
    );

-- ─────────────────────────────────────────────
-- QUIZ RESULTS: access via owning session
-- ─────────────────────────────────────────────
create policy "quiz_results_select_own" on public.quiz_results
    for select using (
        exists (
            select 1 from public.lab_sessions ls
            where ls.id = session_id and ls.user_id = auth.uid()
        )
    );

create policy "quiz_results_insert_own" on public.quiz_results
    for insert with check (
        exists (
            select 1 from public.lab_sessions ls
            where ls.id = session_id and ls.user_id = auth.uid()
        )
    );

-- ─────────────────────────────────────────────
-- USER BADGES: users can only read their own badges
-- ─────────────────────────────────────────────
create policy "user_badges_select_own" on public.user_badges
    for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- AGENT SETTINGS: users can only access their own settings
-- ─────────────────────────────────────────────
create policy "agent_settings_select_own" on public.agent_settings
    for select using (auth.uid() = user_id);

create policy "agent_settings_upsert_own" on public.agent_settings
    for all using (auth.uid() = user_id);
