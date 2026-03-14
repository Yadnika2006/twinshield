create table if not exists public.agent_settings (
    user_id uuid primary key references public.users(id) on delete cascade,
    config jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create or replace function public.set_agent_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_agent_settings_updated_at on public.agent_settings;

create trigger trg_agent_settings_updated_at
before update on public.agent_settings
for each row
execute function public.set_agent_settings_updated_at();
