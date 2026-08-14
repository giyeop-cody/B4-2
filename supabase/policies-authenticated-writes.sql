-- 공개 조회 + 로그인 사용자 쓰기 정책
-- Supabase Dashboard > SQL Editor에서 프로젝트 소유자가 실행한다.
-- 사용자별 소유권은 구분하지 않으므로 로그인 사용자는 모든 items를 수정/삭제할 수 있다.

alter table public.items enable row level security;

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
