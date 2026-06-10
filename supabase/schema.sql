-- Run this in your Supabase SQL editor to set up the database

-- User profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  phone text,
  role text not null default 'student' check (role in ('student', 'trainer', 'owner')),
  avatar_url text,
  emergency_contact_name text,
  emergency_contact_phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Helper function (security definer) to check role without re-triggering RLS on profiles,
-- which would otherwise cause "infinite recursion detected in policy for relation profiles"
create or replace function public.is_trainer_or_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role in ('trainer', 'owner')
  );
$$;

create policy "Trainers and owners can view all profiles" on public.profiles for select using (
  public.is_trainer_or_owner()
);

-- Trainer profiles (linked to profiles)
create table public.trainers (
  id uuid references public.profiles(id) on delete cascade primary key,
  bio text,
  specialties text[],
  accepts_trial_lessons boolean default true,
  lesson_rate_30min numeric(10,2),
  lesson_rate_60min numeric(10,2),
  created_at timestamptz default now()
);
alter table public.trainers enable row level security;
create policy "Trainers are publicly viewable" on public.trainers for select to anon, authenticated using (true);
create policy "Trainers can update own record" on public.trainers for update using (auth.uid() = id);

-- Trainer availability slots (recurring weekly schedule)
create table public.availability (
  id uuid default gen_random_uuid() primary key,
  trainer_id uuid references public.trainers(id) on delete cascade not null,
  day_of_week int not null check (day_of_week between 0 and 6), -- 0=Sunday
  start_time time not null,
  end_time time not null,
  created_at timestamptz default now()
);
alter table public.availability enable row level security;
create policy "Availability is publicly viewable" on public.availability for select to anon, authenticated using (true);
create policy "Trainers manage own availability" on public.availability for all using (auth.uid() = trainer_id);

-- Blocked dates (trainer time off, no lessons)
create table public.blocked_dates (
  id uuid default gen_random_uuid() primary key,
  trainer_id uuid references public.trainers(id) on delete cascade not null,
  blocked_date date not null,
  start_time time,
  end_time time,
  reason text,
  created_at timestamptz default now()
);
alter table public.blocked_dates enable row level security;
create policy "Blocked dates are publicly viewable" on public.blocked_dates for select to anon, authenticated using (true);
create policy "Trainers manage own blocked dates" on public.blocked_dates for all using (auth.uid() = trainer_id);

-- Lessons
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  trainer_id uuid references public.trainers(id) not null,
  student_id uuid references public.profiles(id),
  lesson_date date not null,
  start_time time not null,
  duration_minutes int not null check (duration_minutes in (30, 60)),
  status text not null default 'pending' check (status in ('pending', 'approved', 'cancelled', 'completed')),
  lesson_type text not null default 'regular' check (lesson_type in ('regular', 'trial')),
  notes text,
  -- For trial lessons (no account required)
  guest_name text,
  guest_email text,
  guest_phone text,
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'paid', 'waived')),
  payment_amount numeric(10,2),
  payment_method text,
  trainer_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.lessons enable row level security;
create policy "Students view own lessons" on public.lessons for select using (auth.uid() = student_id);
create policy "Trainers view their lessons" on public.lessons for select using (auth.uid() = trainer_id);
create policy "Students can create lessons" on public.lessons for insert with check (auth.uid() = student_id);
create policy "Trainers can update their lessons" on public.lessons for update using (auth.uid() = trainer_id);
create policy "Owners view all lessons" on public.lessons for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'owner')
);
-- Allow anon inserts for trial lessons
create policy "Anyone can book trial lessons" on public.lessons for insert to anon with check (lesson_type = 'trial');

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger lessons_updated_at before update on public.lessons
  for each row execute procedure public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
