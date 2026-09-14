-- =====================================================
-- BSTUDIO.COM DATABASE
-- =====================================================


-- =====================================================
-- 게시물 테이블
-- =====================================================

create table if not exists public.posts (

    id uuid
        primary key
        default gen_random_uuid(),

    title text
        not null,

    description text
        default '',

    file_name text
        not null,

    file_url text
        not null,

    file_path text
        not null,

    file_size bigint
        not null,

    mime_type text
        default '',

    author_id uuid
        not null,

    created_at timestamptz
        not null
        default now()

);



-- =====================================================
-- 댓글 테이블
-- =====================================================

create table if not exists public.comments (

    id uuid
        primary key
        default gen_random_uuid(),

    post_id uuid
        not null
        references public.posts(id)
        on delete cascade,

    user_id uuid
        not null,

    user_name text
        not null,

    content text
        not null,

    created_at timestamptz
        not null
        default now()

);



-- =====================================================
-- RLS
-- =====================================================

alter table public.posts
enable row level security;


alter table public.comments
enable row level security;



-- =====================================================
-- 게시물 보기
-- 누구나 가능
-- =====================================================

create policy "posts_select"

on public.posts

for select

to anon, authenticated

using (
    true
);



-- =====================================================
-- 게시물 작성
-- 관리자만 가능
-- =====================================================

create policy "posts_insert_admin"

on public.posts

for insert

to authenticated

with check (

    auth.uid() =
    'ef0d2be6-5dfe-40d6-80f6-eee2502bf8fc'

);



-- =====================================================
-- 게시물 삭제
-- 관리자만 가능
-- =====================================================

create policy "posts_delete_admin"

on public.posts

for delete

to authenticated

using (

    auth.uid() =
    '여기에_관리자_UUID'

);



-- =====================================================
-- 댓글 보기
-- 누구나 가능
-- =====================================================

create policy "comments_select"

on public.comments

for select

to anon, authenticated

using (
    true
);



-- =====================================================
-- 댓글 작성
-- 로그인한 사용자
-- =====================================================

create policy "comments_insert"

on public.comments

for insert

to authenticated

with check (

    auth.uid() =
    user_id

);
