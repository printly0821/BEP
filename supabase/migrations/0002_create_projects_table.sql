-- Migration: create projects table for storing BEP calculation data
-- Ensures pgcrypto available for gen_random_uuid
create extension if not exists "pgcrypto";

-- Create projects table with RLS enabled
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  version text not null default 'v1',
  locale text not null default 'ko',
  input_json jsonb not null,
  result_json jsonb not null,
  sensitivity_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.projects is 'BEP 계산기 프로젝트 저장 테이블. 사용자별 계산 데이터 및 결과를 저장합니다.';
comment on column public.projects.user_id is '프로젝트 소유자 ID (auth.users 참조)';
comment on column public.projects.name is '프로젝트명';
comment on column public.projects.version is '데이터 스키마 버전 (기본값: v1)';
comment on column public.projects.locale is '프로젝트 로케일 (ko, en 등)';
comment on column public.projects.input_json is '계산 입력값 (price, unitCost, fixedCost, targetProfit)';
comment on column public.projects.result_json is '계산 결과값 (bepQuantity, bepRevenue, marginRate, targetQuantity)';
comment on column public.projects.sensitivity_json is '민감도 분석 데이터 (선택적)';

-- Enable Row Level Security
alter table public.projects enable row level security;

-- RLS Policies: 사용자는 본인의 프로젝트만 조회/생성/수정/삭제 가능
create policy "owner_read" on public.projects
  for select
  using (auth.uid() = user_id);

create policy "owner_insert" on public.projects
  for insert
  with check (auth.uid() = user_id);

create policy "owner_update" on public.projects
  for update
  using (auth.uid() = user_id);

create policy "owner_delete" on public.projects
  for delete
  using (auth.uid() = user_id);

-- Create index for efficient user queries
create index if not exists idx_projects_user_created on public.projects(user_id, created_at desc);

-- Create function to automatically update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at on UPDATE
create trigger update_projects_updated_at
  before update on public.projects
  for each row
  execute function public.update_updated_at_column();
