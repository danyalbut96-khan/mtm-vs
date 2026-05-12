-- SmartDoc AI - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Doctors table
create table if not exists public.doctors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text unique not null,
  phone text,
  specialization text not null,
  city text not null,
  location text,
  consultation_type text not null default 'Online', -- 'Online', 'Physical', 'Both'
  experience integer,
  bio text,
  rating numeric(3,2) default 0,
  profile_pic text,
  is_available boolean default true,
  created_at timestamptz default now()
);

-- Patients table
create table if not exists public.patients (
  id uuid default uuid_generate_v4() primary key,
  name text,
  email text unique not null,
  phone text,
  created_at timestamptz default now()
);

-- Appointments table
create table if not exists public.appointments (
  id uuid default uuid_generate_v4() primary key,
  doctor_id uuid references public.doctors(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete set null,
  date date not null,
  time_slot text not null,
  type text not null default 'Online', -- 'Online', 'Physical'
  status text not null default 'confirmed', -- 'confirmed', 'pending', 'cancelled', 'completed'
  problem_description text,
  patient_name text,
  patient_email text,
  patient_phone text,
  created_at timestamptz default now()
);

-- Messages table
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  doctor_id uuid references public.doctors(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete set null,
  sender_type text not null, -- 'doctor', 'patient', 'ai'
  content text not null,
  patient_name text,
  patient_phone text,
  created_at timestamptz default now()
);

-- Availability slots table
create table if not exists public.availability_slots (
  id uuid default uuid_generate_v4() primary key,
  doctor_id uuid references public.doctors(id) on delete cascade,
  day_of_week text not null, -- 'Monday', 'Tuesday', etc.
  start_time text not null, -- '09:00'
  end_time text not null,   -- '17:00'
  created_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table public.doctors enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.messages enable row level security;
alter table public.availability_slots enable row level security;

-- Policies: allow read access to all
create policy "Anyone can read doctors" on public.doctors for select using (true);
create policy "Anyone can read availability" on public.availability_slots for select using (true);

-- Allow inserts from authenticated and anonymous (for booking)
create policy "Anyone can insert patients" on public.patients for insert with check (true);
create policy "Anyone can insert appointments" on public.appointments for insert with check (true);
create policy "Anyone can read appointments" on public.appointments for select using (true);
create policy "Anyone can insert messages" on public.messages for insert with check (true);
create policy "Anyone can read messages" on public.messages for select using (true);

-- Doctors can update their own records
create policy "Doctors can insert their profile" on public.doctors for insert with check (true);
create policy "Doctors can update their profile" on public.doctors for update using (true);

-- Availability
create policy "Doctors can insert availability" on public.availability_slots for insert with check (true);
create policy "Doctors can update availability" on public.availability_slots for update using (true);

-- Indexes for performance
create index if not exists idx_doctors_specialization on public.doctors(specialization);
create index if not exists idx_doctors_city on public.doctors(city);
create index if not exists idx_doctors_is_available on public.doctors(is_available);
create index if not exists idx_appointments_doctor_id on public.appointments(doctor_id);
create index if not exists idx_appointments_date on public.appointments(date);
create index if not exists idx_messages_doctor_id on public.messages(doctor_id);

-- Sample seed data (optional - remove if not needed)
insert into public.doctors (name, email, specialization, city, consultation_type, experience, bio, rating, is_available)
values
  ('Ahmed Khan', 'dr.ahmed@example.com', 'Cardiology', 'Lahore', 'Both', 12, 'Experienced cardiologist with expertise in heart disease prevention and treatment.', 4.8, true),
  ('Sara Malik', 'dr.sara@example.com', 'Dermatology', 'Karachi', 'Online', 8, 'Specialist in skin conditions, acne treatment, and cosmetic dermatology.', 4.7, true),
  ('Usman Ali', 'dr.usman@example.com', 'Orthopedics', 'Islamabad', 'Physical', 15, 'Expert in bone and joint disorders, sports injuries, and rehabilitation.', 4.9, false),
  ('Fatima Zahra', 'dr.fatima@example.com', 'Neurology', 'Lahore', 'Online', 10, 'Neurologist specializing in headaches, epilepsy, and stroke management.', 4.6, true),
  ('Hassan Raza', 'dr.hassan@example.com', 'Pediatrics', 'Karachi', 'Both', 9, 'Dedicated pediatrician providing comprehensive child healthcare.', 4.8, true),
  ('Ayesha Siddiqui', 'dr.ayesha@example.com', 'Gynecology', 'Rawalpindi', 'Both', 11, 'Specialist in women health, pregnancy care, and reproductive medicine.', 4.7, true),
  ('Bilal Ahmed', 'dr.bilal@example.com', 'Psychiatry', 'Islamabad', 'Online', 7, 'Mental health professional focusing on anxiety, depression, and trauma.', 4.5, true),
  ('Zainab Hussain', 'dr.zainab@example.com', 'ENT', 'Faisalabad', 'Physical', 6, 'ENT specialist treating ear, nose, and throat disorders.', 4.6, false)
on conflict (email) do nothing;
