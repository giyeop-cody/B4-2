-- 공개 조회 + 로그인 사용자 쓰기 정책
-- Supabase Dashboard > SQL Editor에서 프로젝트 소유자가 실행한다.
-- 사용자별 소유권은 구분하지 않으므로 로그인 사용자는 모든 items를 수정/삭제할 수 있다.
--
-- 실행 전 아래 조회만 먼저 선택해 Run하고 결과를 복사하거나 화면으로 보관한다.
-- select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public' and tablename = 'items'
-- order by policyname;

-- 중간에 하나라도 실패하면 앞선 변경도 적용되지 않도록 한 묶음으로 실행한다.
begin;

alter table public.items enable row level security;

-- 테이블 권한과 RLS 정책을 모두 맞춘다.
revoke insert, update, delete on table public.items from anon;
grant select on table public.items to anon, authenticated;
grant insert, update, delete on table public.items to authenticated;

-- 기존의 공개 허용 정책이 남으면 새 정책과 OR로 결합되어 익명 쓰기가 계속될 수 있다.
-- 이 과제의 items 테이블 정책을 전부 지운 뒤 아래의 명확한 정책만 다시 만든다.
do $$
declare
  policy_row record;
begin
  for policy_row in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'items'
  loop
    execute format('drop policy if exists %I on public.items', policy_row.policyname);
  end loop;
end
$$;

create policy "items_public_read"
on public.items
for select
to anon, authenticated
using (true);

create policy "items_authenticated_insert"
on public.items
for insert
to authenticated
with check (auth.uid() is not null);

create policy "items_authenticated_update"
on public.items
for update
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "items_authenticated_delete"
on public.items
for delete
to authenticated
using (auth.uid() is not null);

commit;

-- 실행 뒤 아래 결과가 정확히 4행인지 확인한다.
select policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'items'
order by policyname;
