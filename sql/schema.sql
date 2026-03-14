-- ============================================================
-- TwinShield Full Schema
-- Run this in the Supabase SQL editor to set up all tables.
-- ============================================================

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
create table if not exists public.users (
    id            uuid        primary key default gen_random_uuid(),
    email         text        unique not null,
    name          text,
    password_hash text,                                   -- null for Google OAuth users
    role          text        not null default 'student',
    avatar_url    text,
    xp            integer     not null default 0,
    level         integer     not null default 1,
    score         integer     not null default 0,
    created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- LAB SESSIONS
-- ─────────────────────────────────────────────
create table if not exists public.lab_sessions (
    id               uuid        primary key default gen_random_uuid(),
    user_id          uuid        not null references public.users(id) on delete cascade,
    scenario_id      text        not null,
    started_at       timestamptz not null default now(),
    ended_at         timestamptz,
    duration_seconds integer,
    attacker_score   integer,
    defender_score   integer,
    quiz_score       integer,
    tasks_completed  integer,
    grade            text
);

-- ─────────────────────────────────────────────
-- TASK COMPLETIONS
-- ─────────────────────────────────────────────
create table if not exists public.task_completions (
    id               uuid        primary key default gen_random_uuid(),
    session_id       uuid        not null references public.lab_sessions(id) on delete cascade,
    task_id          integer     not null,
    scenario_id      text        not null,
    answer_submitted text,
    completed_at     timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- QUIZ RESULTS
-- ─────────────────────────────────────────────
create table if not exists public.quiz_results (
    id             uuid    primary key default gen_random_uuid(),
    session_id     uuid    not null references public.lab_sessions(id) on delete cascade,
    question_id    integer not null,
    selected_index integer not null,
    is_correct     boolean not null
);

-- ─────────────────────────────────────────────
-- USER BADGES
-- ─────────────────────────────────────────────
create table if not exists public.user_badges (
    id         uuid        primary key default gen_random_uuid(),
    user_id    uuid        not null references public.users(id) on delete cascade,
    badge_id   text        not null,
    earned_at  timestamptz not null default now(),
    unique (user_id, badge_id)
);

-- ─────────────────────────────────────────────
-- AGENT SETTINGS
-- (also in sql/agent_settings.sql — kept here for completeness)
-- ─────────────────────────────────────────────
create table if not exists public.agent_settings (
    user_id    uuid        primary key references public.users(id) on delete cascade,
    config     jsonb       not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create or replace function public.set_agent_settings_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_agent_settings_updated_at on public.agent_settings;
create trigger trg_agent_settings_updated_at
before update on public.agent_settings
for each row execute function public.set_agent_settings_updated_at();

-- ─────────────────────────────────────────────
-- LEADERBOARD VIEW
-- ─────────────────────────────────────────────
create or replace view public.leaderboard as
select
    u.id        as user_id,
    u.name,
    u.avatar_url,
    u.score,
    u.level,
    u.xp,
    count(ls.id) filter (where ls.ended_at is not null) as sessions_completed
from public.users u
left join public.lab_sessions ls on ls.user_id = u.id
group by u.id, u.name, u.avatar_url, u.score, u.level, u.xp
order by u.score desc;
