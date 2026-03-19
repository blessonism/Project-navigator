alter table public.projects
add column if not exists visibility text not null default 'public';

update public.projects
set visibility = 'public'
where visibility is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'projects_visibility_check'
  ) then
    alter table public.projects
    add constraint projects_visibility_check
    check (visibility in ('public', 'admin-only'));
  end if;
end $$;
