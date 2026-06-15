drop extension if exists "pg_net";

create type "public"."achievement_category" as enum ('algemeen', 'kracht', 'hardlopen');

create type "public"."appointment_status" as enum ('scheduled', 'completed', 'cancelled', 'no_show');

create type "public"."appointment_type" as enum ('blood_test', 'consultation', 'follow_up', 'initial_assessment', 'other');

create type "public"."community_category" as enum ('running', 'strength', 'endurance', 'hyrox', 'recovery', 'nutrition', 'other');

create type "public"."dutch_region" as enum ('noord_holland', 'zuid_holland', 'utrecht', 'gelderland', 'noord_brabant', 'limburg', 'zeeland', 'friesland', 'groningen', 'drenthe', 'overijssel', 'flevoland');

create type "public"."gender_type" as enum ('male', 'female', 'other');

create type "public"."goal_type" as enum ('5k_time', '10k_time', 'half_marathon_time', 'marathon_time', 'triathlon', 'cycling_power', 'body_fat_percentage', 'bench_press_1rm', 'hyrox', 'other');

create type "public"."partner_type" as enum ('coach', 'supplements', 'physiotherapist', 'gym', 'wearable', 'other');

create type "public"."performance_metric_type" as enum ('time', 'distance', 'weight', 'pace', 'body_weight', 'body_fat', 'score');

create type "public"."sport_type" as enum ('strength', 'endurance', 'hybrid', 'team_sport', 'recreational');

create type "public"."trainer_specialization" as enum ('personal_training', 'hyrox_training', 'running_training', 'strength_training', 'crossfit', 'cycling', 'swimming', 'triathlon', 'longevity_health', 'rehabilitation');

create sequence "public"."biomarker_categories_id_seq";

create sequence "public"."biomarker_content_id_seq";

create sequence "public"."biomarker_dependencies_id_seq";

create sequence "public"."biomarkers_id_seq";

create sequence "public"."lab_biomarker_references_id_seq";

create sequence "public"."labs_id_seq";

create sequence "public"."panels_id_seq";


  create table "public"."achievements" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "category" public.achievement_category not null,
    "title" text not null,
    "value" text not null,
    "reps" integer,
    "achieved_at" timestamp with time zone not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."achievements" enable row level security;


  create table "public"."admin_notifications" (
    "id" uuid not null default gen_random_uuid(),
    "type" text not null,
    "title" text not null,
    "message" text,
    "user_id" uuid,
    "reference_id" uuid,
    "is_read" boolean default false,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."admin_notifications" enable row level security;


  create table "public"."appointments" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "description" text,
    "appointment_type" public.appointment_type default 'consultation'::public.appointment_type,
    "scheduled_at" timestamp with time zone not null,
    "duration_minutes" integer default 60,
    "status" public.appointment_status default 'scheduled'::public.appointment_status,
    "location" text,
    "admin_notes" text,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."appointments" enable row level security;


  create table "public"."biomarker_categories" (
    "id" integer not null default nextval('public.biomarker_categories_id_seq'::regclass),
    "name" text not null,
    "description" text
      );


alter table "public"."biomarker_categories" enable row level security;


  create table "public"."biomarker_content" (
    "id" integer not null default nextval('public.biomarker_content_id_seq'::regclass),
    "biomarker_id" integer not null,
    "what_it_measures" text,
    "why_relevant" text,
    "interpretation" text,
    "optimization_tips" jsonb default '[]'::jsonb,
    "scientific_sources" jsonb default '[]'::jsonb,
    "updated_at" timestamp with time zone default now(),
    "how_to_optimize" text
      );


alter table "public"."biomarker_content" enable row level security;


  create table "public"."biomarker_dependencies" (
    "id" integer not null default nextval('public.biomarker_dependencies_id_seq'::regclass),
    "derived_id" integer not null,
    "source_id" integer not null,
    "role" text not null,
    "sort_order" integer not null default 0
      );


alter table "public"."biomarker_dependencies" enable row level security;


  create table "public"."biomarkers" (
    "id" integer not null default nextval('public.biomarkers_id_seq'::regclass),
    "name" text not null,
    "display_name" text,
    "unit" text,
    "category_id" integer,
    "description" text,
    "is_active" boolean default true,
    "ref_male_min" numeric,
    "ref_male_max" numeric,
    "ref_female_min" numeric,
    "ref_female_max" numeric,
    "performance_male_min" numeric,
    "performance_male_max" numeric,
    "performance_female_min" numeric,
    "performance_female_max" numeric,
    "measurement_context" text,
    "kind" text not null default 'direct'::text,
    "formula" text
      );


alter table "public"."biomarkers" enable row level security;


  create table "public"."blood_result_uploads" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "file_url" text not null,
    "file_name" text not null,
    "status" text default 'pending'::text,
    "admin_notes" text,
    "reviewed_by" uuid,
    "reviewed_at" timestamp with time zone,
    "blood_test_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."blood_result_uploads" enable row level security;


  create table "public"."blood_test_results" (
    "id" uuid not null default gen_random_uuid(),
    "blood_test_id" uuid not null,
    "biomarker_id" integer not null,
    "value" numeric(12,4) not null,
    "unit" text,
    "ref_low" numeric(12,4),
    "ref_high" numeric(12,4),
    "flag" text,
    "lab_metadata" jsonb
      );


alter table "public"."blood_test_results" enable row level security;


  create table "public"."blood_tests" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "panel_id" integer,
    "sample_taken_at" date not null,
    "lab_name" text,
    "status" text default 'pending'::text,
    "raw_report_url" text,
    "created_at" timestamp with time zone default now(),
    "lab_id" integer
      );


alter table "public"."blood_tests" enable row level security;


  create table "public"."chat_conversations" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null default 'Nieuw gesprek'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."chat_conversations" enable row level security;


  create table "public"."chat_messages" (
    "id" uuid not null default gen_random_uuid(),
    "conversation_id" uuid not null,
    "role" text not null,
    "content" text not null,
    "created_at" timestamp with time zone default now(),
    "ai_provider" text
      );


alter table "public"."chat_messages" enable row level security;


  create table "public"."community_comments" (
    "id" uuid not null default gen_random_uuid(),
    "post_id" uuid not null,
    "user_id" uuid not null,
    "content" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."community_comments" enable row level security;


  create table "public"."community_likes" (
    "post_id" uuid not null,
    "user_id" uuid not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."community_likes" enable row level security;


  create table "public"."community_posts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "category" public.community_category default 'other'::public.community_category,
    "content" text not null,
    "media_urls" text[] default '{}'::text[],
    "created_at" timestamp with time zone default now()
      );


alter table "public"."community_posts" enable row level security;


  create table "public"."deep_research_reports" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "blood_test_id" uuid not null,
    "status" text default 'generating'::text,
    "summary" text,
    "report_data" jsonb,
    "created_at" timestamp with time zone default now(),
    "completed_at" timestamp with time zone,
    "error_message" text,
    "ai_provider" text
      );


alter table "public"."deep_research_reports" enable row level security;


  create table "public"."goals" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "type" public.goal_type not null,
    "title" text not null,
    "target_value" numeric(12,3),
    "target_unit" text,
    "target_date" date,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."goals" enable row level security;


  create table "public"."lab_biomarker_references" (
    "id" integer not null default nextval('public.lab_biomarker_references_id_seq'::regclass),
    "lab_id" integer not null,
    "biomarker_id" integer not null,
    "unit" text not null,
    "lab_ref_min" numeric,
    "lab_ref_max" numeric,
    "ref_male_min" numeric,
    "ref_male_max" numeric,
    "ref_female_min" numeric,
    "ref_female_max" numeric,
    "performance_male_min" numeric,
    "performance_male_max" numeric,
    "performance_female_min" numeric,
    "performance_female_max" numeric
      );


alter table "public"."lab_biomarker_references" enable row level security;


  create table "public"."labs" (
    "id" integer not null default nextval('public.labs_id_seq'::regclass),
    "name" text not null,
    "description" text,
    "website_url" text,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."labs" enable row level security;


  create table "public"."panel_biomarkers" (
    "panel_id" integer not null,
    "biomarker_id" integer not null,
    "sort_order" integer default 0,
    "is_primary" boolean default true
      );


alter table "public"."panel_biomarkers" enable row level security;


  create table "public"."panels" (
    "id" integer not null default nextval('public.panels_id_seq'::regclass),
    "code" text not null,
    "name" text not null,
    "description" text,
    "target_sport" text,
    "target_sex" text default 'any'::text,
    "is_active" boolean default true
      );


alter table "public"."panels" enable row level security;


  create table "public"."partner_applications" (
    "id" uuid not null default gen_random_uuid(),
    "contact_name" text not null,
    "contact_email" text not null,
    "phone" text,
    "company_name" text not null,
    "type" text not null,
    "description" text,
    "website_url" text,
    "region" text,
    "specializations" text[] default '{}'::text[],
    "motivation" text,
    "status" text not null default 'pending'::text,
    "admin_notes" text,
    "reviewed_by" uuid,
    "reviewed_at" timestamp with time zone,
    "partner_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "regions" text[],
    "contact_preference" text,
    "image_url" text,
    "price_from" numeric,
    "price_unit" text,
    "links" jsonb default '[]'::jsonb,
    "subtitle" text,
    "tags" text[] default '{}'::text[],
    "phone_company" text
      );


alter table "public"."partner_applications" enable row level security;


  create table "public"."partners" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "type" text not null,
    "description" text,
    "website_url" text,
    "logo_url" text,
    "affiliate_code" text,
    "is_featured" boolean default false,
    "created_at" timestamp with time zone default now(),
    "subtitle" text,
    "image_url" text,
    "rating" numeric(2,1),
    "review_count" integer default 0,
    "price_from" numeric(10,2),
    "price_unit" text default 'sessie'::text,
    "region" public.dutch_region,
    "specializations" public.trainer_specialization[] default '{}'::public.trainer_specialization[],
    "gender" text,
    "tags" text[] default '{}'::text[],
    "affiliate_url" text,
    "is_active" boolean default true,
    "sort_order" integer default 0,
    "links" jsonb default '[]'::jsonb,
    "regions" text[]
      );


alter table "public"."partners" enable row level security;


  create table "public"."peak_scores" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "score" numeric(5,2) not null,
    "calculated_at" timestamp with time zone default now()
      );


alter table "public"."peak_scores" enable row level security;


  create table "public"."performance_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "is_complete" boolean default false,
    "current_step" integer default 1,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "form_data" jsonb default '{}'::jsonb,
    "ai_plan" jsonb,
    "plan_form_data" jsonb,
    "ai_plan_provider" text
      );


alter table "public"."performance_profiles" enable row level security;


  create table "public"."performance_scores" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "score" numeric(5,2) not null,
    "calculated_at" timestamp with time zone default now()
      );


alter table "public"."performance_scores" enable row level security;


  create table "public"."performances" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "goal_id" uuid,
    "sport_type" text,
    "metric_type" public.performance_metric_type not null,
    "value" numeric(12,3) not null,
    "unit" text not null,
    "performed_at" timestamp with time zone not null,
    "notes" text,
    "source" text default 'manual'::text,
    "is_pr" boolean default false
      );


alter table "public"."performances" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone,
    "username" text,
    "full_name" text,
    "avatar_url" text,
    "website" text,
    "birth_date" date,
    "gender" text,
    "weight_kg" numeric(5,2),
    "sport_type" text,
    "sport_frequency_per_week" integer,
    "created_at" timestamp with time zone default now(),
    "panel_id" integer,
    "show_all_biomarkers" boolean default false
      );


alter table "public"."profiles" enable row level security;


  create table "public"."subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "status" text not null,
    "plan" text not null,
    "started_at" timestamp with time zone not null default now(),
    "ends_at" timestamp with time zone,
    "external_ref" text,
    "stripe_customer_id" text,
    "stripe_subscription_id" text,
    "current_period_end" timestamp with time zone
      );


alter table "public"."subscriptions" enable row level security;


  create table "public"."system_config" (
    "key" text not null,
    "value" jsonb not null,
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid
      );


alter table "public"."system_config" enable row level security;


  create table "public"."user_metrics" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "blood_test_id" uuid,
    "metric_type" text not null,
    "value" numeric(10,2) not null,
    "unit" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."user_metrics" enable row level security;


  create table "public"."user_notifications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "type" text not null,
    "title" text not null,
    "message" text,
    "reference_id" uuid,
    "is_read" boolean default false,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."user_notifications" enable row level security;


  create table "public"."user_settings" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "language" text not null default 'nl'::text,
    "region" text not null default 'NL'::text,
    "units" text not null default 'metric'::text,
    "date_format" text not null default 'dd/mm/yyyy'::text,
    "theme" text not null default 'light'::text,
    "analytics_enabled" boolean not null default true,
    "personalised_recommendations" boolean not null default true,
    "share_data_with_partners" boolean not null default false,
    "activity_visibility" text not null default 'private'::text,
    "email_weekly_report" boolean not null default true,
    "email_new_results" boolean not null default true,
    "email_appointment_reminders" boolean not null default true,
    "push_new_results" boolean not null default true,
    "push_community_updates" boolean not null default false,
    "push_marketing_updates" boolean not null default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "ai_context_profile" boolean not null default true,
    "ai_context_biomarkers" boolean not null default true,
    "ai_context_performance_plan" boolean not null default true
      );


alter table "public"."user_settings" enable row level security;

alter sequence "public"."biomarker_categories_id_seq" owned by "public"."biomarker_categories"."id";

alter sequence "public"."biomarker_content_id_seq" owned by "public"."biomarker_content"."id";

alter sequence "public"."biomarker_dependencies_id_seq" owned by "public"."biomarker_dependencies"."id";

alter sequence "public"."biomarkers_id_seq" owned by "public"."biomarkers"."id";

alter sequence "public"."lab_biomarker_references_id_seq" owned by "public"."lab_biomarker_references"."id";

alter sequence "public"."labs_id_seq" owned by "public"."labs"."id";

alter sequence "public"."panels_id_seq" owned by "public"."panels"."id";

CREATE UNIQUE INDEX achievements_pkey ON public.achievements USING btree (id);

CREATE UNIQUE INDEX admin_notifications_pkey ON public.admin_notifications USING btree (id);

CREATE UNIQUE INDEX appointments_pkey ON public.appointments USING btree (id);

CREATE UNIQUE INDEX biomarker_categories_name_key ON public.biomarker_categories USING btree (name);

CREATE UNIQUE INDEX biomarker_categories_pkey ON public.biomarker_categories USING btree (id);

CREATE UNIQUE INDEX biomarker_content_biomarker_id_key ON public.biomarker_content USING btree (biomarker_id);

CREATE UNIQUE INDEX biomarker_content_pkey ON public.biomarker_content USING btree (id);

CREATE INDEX biomarker_dependencies_derived_idx ON public.biomarker_dependencies USING btree (derived_id);

CREATE UNIQUE INDEX biomarker_dependencies_pkey ON public.biomarker_dependencies USING btree (id);

CREATE UNIQUE INDEX biomarker_dependencies_role_unique ON public.biomarker_dependencies USING btree (derived_id, role);

CREATE INDEX biomarker_dependencies_source_idx ON public.biomarker_dependencies USING btree (source_id);

CREATE UNIQUE INDEX biomarker_dependencies_unique ON public.biomarker_dependencies USING btree (derived_id, source_id);

CREATE UNIQUE INDEX biomarkers_name_key ON public.biomarkers USING btree (name);

CREATE UNIQUE INDEX biomarkers_pkey ON public.biomarkers USING btree (id);

CREATE UNIQUE INDEX blood_result_uploads_pkey ON public.blood_result_uploads USING btree (id);

CREATE UNIQUE INDEX blood_test_results_blood_test_id_biomarker_id_key ON public.blood_test_results USING btree (blood_test_id, biomarker_id);

CREATE UNIQUE INDEX blood_test_results_pkey ON public.blood_test_results USING btree (id);

CREATE UNIQUE INDEX blood_tests_pkey ON public.blood_tests USING btree (id);

CREATE UNIQUE INDEX chat_conversations_pkey ON public.chat_conversations USING btree (id);

CREATE UNIQUE INDEX chat_messages_pkey ON public.chat_messages USING btree (id);

CREATE UNIQUE INDEX community_comments_pkey ON public.community_comments USING btree (id);

CREATE UNIQUE INDEX community_likes_pkey ON public.community_likes USING btree (post_id, user_id);

CREATE UNIQUE INDEX community_posts_pkey ON public.community_posts USING btree (id);

CREATE UNIQUE INDEX deep_research_reports_pkey ON public.deep_research_reports USING btree (id);

CREATE UNIQUE INDEX goals_pkey ON public.goals USING btree (id);

CREATE INDEX idx_achievements_achieved_at ON public.achievements USING btree (user_id, achieved_at DESC);

CREATE INDEX idx_achievements_user_id ON public.achievements USING btree (user_id);

CREATE INDEX idx_appointments_scheduled_at ON public.appointments USING btree (scheduled_at);

CREATE INDEX idx_appointments_status ON public.appointments USING btree (status);

CREATE INDEX idx_appointments_user_id ON public.appointments USING btree (user_id);

CREATE INDEX idx_biomarkers_is_active ON public.biomarkers USING btree (is_active);

CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations USING btree (user_id);

CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages USING btree (conversation_id);

CREATE INDEX idx_chat_messages_created_at ON public.chat_messages USING btree (created_at);

CREATE INDEX idx_deep_research_user_created ON public.deep_research_reports USING btree (user_id, created_at DESC);

CREATE INDEX idx_partners_is_active ON public.partners USING btree (is_active);

CREATE INDEX idx_partners_is_featured ON public.partners USING btree (is_featured);

CREATE INDEX idx_partners_region ON public.partners USING btree (region);

CREATE INDEX idx_partners_type ON public.partners USING btree (type);

CREATE INDEX idx_performance_profiles_ai_plan_gin ON public.performance_profiles USING gin (ai_plan);

CREATE INDEX idx_performance_profiles_form_data_gin ON public.performance_profiles USING gin (form_data);

CREATE INDEX idx_performance_profiles_user_id ON public.performance_profiles USING btree (user_id);

CREATE INDEX idx_profiles_panel_id ON public.profiles USING btree (panel_id);

CREATE INDEX idx_user_notifications_user_id ON public.user_notifications USING btree (user_id);

CREATE UNIQUE INDEX lab_biomarker_references_lab_id_biomarker_id_key ON public.lab_biomarker_references USING btree (lab_id, biomarker_id);

CREATE UNIQUE INDEX lab_biomarker_references_pkey ON public.lab_biomarker_references USING btree (id);

CREATE UNIQUE INDEX labs_name_key ON public.labs USING btree (name);

CREATE UNIQUE INDEX labs_pkey ON public.labs USING btree (id);

CREATE UNIQUE INDEX panel_biomarkers_pkey ON public.panel_biomarkers USING btree (panel_id, biomarker_id);

CREATE UNIQUE INDEX panels_code_key ON public.panels USING btree (code);

CREATE UNIQUE INDEX panels_pkey ON public.panels USING btree (id);

CREATE UNIQUE INDEX partner_applications_pkey ON public.partner_applications USING btree (id);

CREATE UNIQUE INDEX partners_pkey ON public.partners USING btree (id);

CREATE UNIQUE INDEX peak_scores_pkey ON public.peak_scores USING btree (id);

CREATE UNIQUE INDEX performance_profiles_pkey ON public.performance_profiles USING btree (id);

CREATE UNIQUE INDEX performance_profiles_user_id_key ON public.performance_profiles USING btree (user_id);

CREATE UNIQUE INDEX performance_scores_pkey ON public.performance_scores USING btree (id);

CREATE UNIQUE INDEX performances_pkey ON public.performances USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX subscriptions_stripe_customer_id_key ON public.subscriptions USING btree (stripe_customer_id);

CREATE UNIQUE INDEX subscriptions_stripe_subscription_id_key ON public.subscriptions USING btree (stripe_subscription_id);

CREATE UNIQUE INDEX subscriptions_user_id_key ON public.subscriptions USING btree (user_id);

CREATE UNIQUE INDEX system_config_pkey ON public.system_config USING btree (key);

CREATE UNIQUE INDEX uq_lab_biomarker ON public.lab_biomarker_references USING btree (lab_id, biomarker_id);

CREATE UNIQUE INDEX user_metrics_pkey ON public.user_metrics USING btree (id);

CREATE UNIQUE INDEX user_notifications_pkey ON public.user_notifications USING btree (id);

CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree (id);

CREATE UNIQUE INDEX user_settings_user_id_key ON public.user_settings USING btree (user_id);

alter table "public"."achievements" add constraint "achievements_pkey" PRIMARY KEY using index "achievements_pkey";

alter table "public"."admin_notifications" add constraint "admin_notifications_pkey" PRIMARY KEY using index "admin_notifications_pkey";

alter table "public"."appointments" add constraint "appointments_pkey" PRIMARY KEY using index "appointments_pkey";

alter table "public"."biomarker_categories" add constraint "biomarker_categories_pkey" PRIMARY KEY using index "biomarker_categories_pkey";

alter table "public"."biomarker_content" add constraint "biomarker_content_pkey" PRIMARY KEY using index "biomarker_content_pkey";

alter table "public"."biomarker_dependencies" add constraint "biomarker_dependencies_pkey" PRIMARY KEY using index "biomarker_dependencies_pkey";

alter table "public"."biomarkers" add constraint "biomarkers_pkey" PRIMARY KEY using index "biomarkers_pkey";

alter table "public"."blood_result_uploads" add constraint "blood_result_uploads_pkey" PRIMARY KEY using index "blood_result_uploads_pkey";

alter table "public"."blood_test_results" add constraint "blood_test_results_pkey" PRIMARY KEY using index "blood_test_results_pkey";

alter table "public"."blood_tests" add constraint "blood_tests_pkey" PRIMARY KEY using index "blood_tests_pkey";

alter table "public"."chat_conversations" add constraint "chat_conversations_pkey" PRIMARY KEY using index "chat_conversations_pkey";

alter table "public"."chat_messages" add constraint "chat_messages_pkey" PRIMARY KEY using index "chat_messages_pkey";

alter table "public"."community_comments" add constraint "community_comments_pkey" PRIMARY KEY using index "community_comments_pkey";

alter table "public"."community_likes" add constraint "community_likes_pkey" PRIMARY KEY using index "community_likes_pkey";

alter table "public"."community_posts" add constraint "community_posts_pkey" PRIMARY KEY using index "community_posts_pkey";

alter table "public"."deep_research_reports" add constraint "deep_research_reports_pkey" PRIMARY KEY using index "deep_research_reports_pkey";

alter table "public"."goals" add constraint "goals_pkey" PRIMARY KEY using index "goals_pkey";

alter table "public"."lab_biomarker_references" add constraint "lab_biomarker_references_pkey" PRIMARY KEY using index "lab_biomarker_references_pkey";

alter table "public"."labs" add constraint "labs_pkey" PRIMARY KEY using index "labs_pkey";

alter table "public"."panel_biomarkers" add constraint "panel_biomarkers_pkey" PRIMARY KEY using index "panel_biomarkers_pkey";

alter table "public"."panels" add constraint "panels_pkey" PRIMARY KEY using index "panels_pkey";

alter table "public"."partner_applications" add constraint "partner_applications_pkey" PRIMARY KEY using index "partner_applications_pkey";

alter table "public"."partners" add constraint "partners_pkey" PRIMARY KEY using index "partners_pkey";

alter table "public"."peak_scores" add constraint "peak_scores_pkey" PRIMARY KEY using index "peak_scores_pkey";

alter table "public"."performance_profiles" add constraint "performance_profiles_pkey" PRIMARY KEY using index "performance_profiles_pkey";

alter table "public"."performance_scores" add constraint "performance_scores_pkey" PRIMARY KEY using index "performance_scores_pkey";

alter table "public"."performances" add constraint "performances_pkey" PRIMARY KEY using index "performances_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."system_config" add constraint "system_config_pkey" PRIMARY KEY using index "system_config_pkey";

alter table "public"."user_metrics" add constraint "user_metrics_pkey" PRIMARY KEY using index "user_metrics_pkey";

alter table "public"."user_notifications" add constraint "user_notifications_pkey" PRIMARY KEY using index "user_notifications_pkey";

alter table "public"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "public"."achievements" add constraint "achievements_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."achievements" validate constraint "achievements_user_id_fkey";

alter table "public"."admin_notifications" add constraint "admin_notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."admin_notifications" validate constraint "admin_notifications_user_id_fkey";

alter table "public"."appointments" add constraint "appointments_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."appointments" validate constraint "appointments_created_by_fkey";

alter table "public"."appointments" add constraint "appointments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."appointments" validate constraint "appointments_user_id_fkey";

alter table "public"."biomarker_categories" add constraint "biomarker_categories_name_key" UNIQUE using index "biomarker_categories_name_key";

alter table "public"."biomarker_content" add constraint "biomarker_content_biomarker_id_fkey" FOREIGN KEY (biomarker_id) REFERENCES public.biomarkers(id) ON DELETE CASCADE not valid;

alter table "public"."biomarker_content" validate constraint "biomarker_content_biomarker_id_fkey";

alter table "public"."biomarker_content" add constraint "biomarker_content_biomarker_id_key" UNIQUE using index "biomarker_content_biomarker_id_key";

alter table "public"."biomarker_dependencies" add constraint "biomarker_dependencies_derived_id_fkey" FOREIGN KEY (derived_id) REFERENCES public.biomarkers(id) ON DELETE CASCADE not valid;

alter table "public"."biomarker_dependencies" validate constraint "biomarker_dependencies_derived_id_fkey";

alter table "public"."biomarker_dependencies" add constraint "biomarker_dependencies_no_self" CHECK ((derived_id <> source_id)) not valid;

alter table "public"."biomarker_dependencies" validate constraint "biomarker_dependencies_no_self";

alter table "public"."biomarker_dependencies" add constraint "biomarker_dependencies_role_unique" UNIQUE using index "biomarker_dependencies_role_unique";

alter table "public"."biomarker_dependencies" add constraint "biomarker_dependencies_source_id_fkey" FOREIGN KEY (source_id) REFERENCES public.biomarkers(id) ON DELETE RESTRICT not valid;

alter table "public"."biomarker_dependencies" validate constraint "biomarker_dependencies_source_id_fkey";

alter table "public"."biomarker_dependencies" add constraint "biomarker_dependencies_unique" UNIQUE using index "biomarker_dependencies_unique";

alter table "public"."biomarkers" add constraint "biomarkers_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.biomarker_categories(id) not valid;

alter table "public"."biomarkers" validate constraint "biomarkers_category_id_fkey";

alter table "public"."biomarkers" add constraint "biomarkers_kind_check" CHECK ((kind = ANY (ARRAY['direct'::text, 'ratio'::text, 'calculated'::text]))) not valid;

alter table "public"."biomarkers" validate constraint "biomarkers_kind_check";

alter table "public"."biomarkers" add constraint "biomarkers_name_key" UNIQUE using index "biomarkers_name_key";

alter table "public"."blood_result_uploads" add constraint "blood_result_uploads_blood_test_id_fkey" FOREIGN KEY (blood_test_id) REFERENCES public.blood_tests(id) not valid;

alter table "public"."blood_result_uploads" validate constraint "blood_result_uploads_blood_test_id_fkey";

alter table "public"."blood_result_uploads" add constraint "blood_result_uploads_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) not valid;

alter table "public"."blood_result_uploads" validate constraint "blood_result_uploads_reviewed_by_fkey";

alter table "public"."blood_result_uploads" add constraint "blood_result_uploads_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'in_review'::text, 'processed'::text, 'rejected'::text]))) not valid;

alter table "public"."blood_result_uploads" validate constraint "blood_result_uploads_status_check";

alter table "public"."blood_result_uploads" add constraint "blood_result_uploads_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."blood_result_uploads" validate constraint "blood_result_uploads_user_id_fkey";

alter table "public"."blood_test_results" add constraint "blood_test_results_biomarker_id_fkey" FOREIGN KEY (biomarker_id) REFERENCES public.biomarkers(id) not valid;

alter table "public"."blood_test_results" validate constraint "blood_test_results_biomarker_id_fkey";

alter table "public"."blood_test_results" add constraint "blood_test_results_blood_test_id_biomarker_id_key" UNIQUE using index "blood_test_results_blood_test_id_biomarker_id_key";

alter table "public"."blood_test_results" add constraint "blood_test_results_blood_test_id_fkey" FOREIGN KEY (blood_test_id) REFERENCES public.blood_tests(id) ON DELETE CASCADE not valid;

alter table "public"."blood_test_results" validate constraint "blood_test_results_blood_test_id_fkey";

alter table "public"."blood_test_results" add constraint "blood_test_results_flag_check" CHECK ((flag = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'critical'::text]))) not valid;

alter table "public"."blood_test_results" validate constraint "blood_test_results_flag_check";

alter table "public"."blood_tests" add constraint "blood_tests_lab_id_fkey" FOREIGN KEY (lab_id) REFERENCES public.labs(id) not valid;

alter table "public"."blood_tests" validate constraint "blood_tests_lab_id_fkey";

alter table "public"."blood_tests" add constraint "blood_tests_panel_id_fkey" FOREIGN KEY (panel_id) REFERENCES public.panels(id) not valid;

alter table "public"."blood_tests" validate constraint "blood_tests_panel_id_fkey";

alter table "public"."blood_tests" add constraint "blood_tests_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'canceled'::text]))) not valid;

alter table "public"."blood_tests" validate constraint "blood_tests_status_check";

alter table "public"."blood_tests" add constraint "blood_tests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."blood_tests" validate constraint "blood_tests_user_id_fkey";

alter table "public"."chat_conversations" add constraint "chat_conversations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."chat_conversations" validate constraint "chat_conversations_user_id_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES public.chat_conversations(id) ON DELETE CASCADE not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_conversation_id_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_role_check" CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text]))) not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_role_check";

alter table "public"."community_comments" add constraint "community_comments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE not valid;

alter table "public"."community_comments" validate constraint "community_comments_post_id_fkey";

alter table "public"."community_comments" add constraint "community_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."community_comments" validate constraint "community_comments_user_id_fkey";

alter table "public"."community_likes" add constraint "community_likes_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE not valid;

alter table "public"."community_likes" validate constraint "community_likes_post_id_fkey";

alter table "public"."community_likes" add constraint "community_likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."community_likes" validate constraint "community_likes_user_id_fkey";

alter table "public"."community_posts" add constraint "community_posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."community_posts" validate constraint "community_posts_user_id_fkey";

alter table "public"."deep_research_reports" add constraint "deep_research_reports_blood_test_id_fkey" FOREIGN KEY (blood_test_id) REFERENCES public.blood_tests(id) not valid;

alter table "public"."deep_research_reports" validate constraint "deep_research_reports_blood_test_id_fkey";

alter table "public"."deep_research_reports" add constraint "deep_research_reports_status_check" CHECK ((status = ANY (ARRAY['generating'::text, 'completed'::text, 'failed'::text]))) not valid;

alter table "public"."deep_research_reports" validate constraint "deep_research_reports_status_check";

alter table "public"."deep_research_reports" add constraint "deep_research_reports_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."deep_research_reports" validate constraint "deep_research_reports_user_id_fkey";

alter table "public"."goals" add constraint "goals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."goals" validate constraint "goals_user_id_fkey";

alter table "public"."lab_biomarker_references" add constraint "lab_biomarker_references_biomarker_id_fkey" FOREIGN KEY (biomarker_id) REFERENCES public.biomarkers(id) ON DELETE CASCADE not valid;

alter table "public"."lab_biomarker_references" validate constraint "lab_biomarker_references_biomarker_id_fkey";

alter table "public"."lab_biomarker_references" add constraint "lab_biomarker_references_lab_id_biomarker_id_key" UNIQUE using index "lab_biomarker_references_lab_id_biomarker_id_key";

alter table "public"."lab_biomarker_references" add constraint "lab_biomarker_references_lab_id_fkey" FOREIGN KEY (lab_id) REFERENCES public.labs(id) ON DELETE CASCADE not valid;

alter table "public"."lab_biomarker_references" validate constraint "lab_biomarker_references_lab_id_fkey";

alter table "public"."lab_biomarker_references" add constraint "uq_lab_biomarker" UNIQUE using index "uq_lab_biomarker";

alter table "public"."labs" add constraint "labs_name_key" UNIQUE using index "labs_name_key";

alter table "public"."panel_biomarkers" add constraint "panel_biomarkers_biomarker_id_fkey" FOREIGN KEY (biomarker_id) REFERENCES public.biomarkers(id) not valid;

alter table "public"."panel_biomarkers" validate constraint "panel_biomarkers_biomarker_id_fkey";

alter table "public"."panel_biomarkers" add constraint "panel_biomarkers_panel_id_fkey" FOREIGN KEY (panel_id) REFERENCES public.panels(id) ON DELETE CASCADE not valid;

alter table "public"."panel_biomarkers" validate constraint "panel_biomarkers_panel_id_fkey";

alter table "public"."panels" add constraint "panels_code_key" UNIQUE using index "panels_code_key";

alter table "public"."panels" add constraint "panels_target_sex_check" CHECK ((target_sex = ANY (ARRAY['any'::text, 'male'::text, 'female'::text]))) not valid;

alter table "public"."panels" validate constraint "panels_target_sex_check";

alter table "public"."partner_applications" add constraint "partner_applications_partner_id_fkey" FOREIGN KEY (partner_id) REFERENCES public.partners(id) not valid;

alter table "public"."partner_applications" validate constraint "partner_applications_partner_id_fkey";

alter table "public"."partner_applications" add constraint "partner_applications_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) not valid;

alter table "public"."partner_applications" validate constraint "partner_applications_reviewed_by_fkey";

alter table "public"."partner_applications" add constraint "partner_applications_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'denied'::text]))) not valid;

alter table "public"."partner_applications" validate constraint "partner_applications_status_check";

alter table "public"."partners" add constraint "partners_gender_check" CHECK ((gender = ANY (ARRAY['male'::text, 'female'::text, 'other'::text]))) not valid;

alter table "public"."partners" validate constraint "partners_gender_check";

alter table "public"."partners" add constraint "partners_rating_check" CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric))) not valid;

alter table "public"."partners" validate constraint "partners_rating_check";

alter table "public"."peak_scores" add constraint "peak_scores_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."peak_scores" validate constraint "peak_scores_user_id_fkey";

alter table "public"."performance_profiles" add constraint "performance_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."performance_profiles" validate constraint "performance_profiles_user_id_fkey";

alter table "public"."performance_profiles" add constraint "performance_profiles_user_id_key" UNIQUE using index "performance_profiles_user_id_key";

alter table "public"."performance_scores" add constraint "performance_scores_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."performance_scores" validate constraint "performance_scores_user_id_fkey";

alter table "public"."performances" add constraint "performances_goal_id_fkey" FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE SET NULL not valid;

alter table "public"."performances" validate constraint "performances_goal_id_fkey";

alter table "public"."performances" add constraint "performances_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."performances" validate constraint "performances_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_gender_check" CHECK ((gender = ANY (ARRAY['male'::text, 'female'::text, 'other'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_gender_check";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_panel_id_fkey" FOREIGN KEY (panel_id) REFERENCES public.panels(id) not valid;

alter table "public"."profiles" validate constraint "profiles_panel_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."profiles" validate constraint "username_length";

alter table "public"."subscriptions" add constraint "subscriptions_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'canceled'::text, 'trial'::text, 'trialing'::text, 'past_due'::text, 'incomplete'::text, 'incomplete_expired'::text, 'unpaid'::text, 'paused'::text]))) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_status_check";

alter table "public"."subscriptions" add constraint "subscriptions_stripe_customer_id_key" UNIQUE using index "subscriptions_stripe_customer_id_key";

alter table "public"."subscriptions" add constraint "subscriptions_stripe_subscription_id_key" UNIQUE using index "subscriptions_stripe_subscription_id_key";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_key" UNIQUE using index "subscriptions_user_id_key";

alter table "public"."system_config" add constraint "system_config_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."system_config" validate constraint "system_config_updated_by_fkey";

alter table "public"."user_metrics" add constraint "user_metrics_blood_test_id_fkey" FOREIGN KEY (blood_test_id) REFERENCES public.blood_tests(id) ON DELETE CASCADE not valid;

alter table "public"."user_metrics" validate constraint "user_metrics_blood_test_id_fkey";

alter table "public"."user_metrics" add constraint "user_metrics_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_metrics" validate constraint "user_metrics_user_id_fkey";

alter table "public"."user_notifications" add constraint "user_notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."user_notifications" validate constraint "user_notifications_user_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_settings" validate constraint "user_settings_user_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_user_id_key" UNIQUE using index "user_settings_user_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_appointment_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_performance_profile_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

create or replace view "public"."v_resolved_biomarker_references" as  SELECT bt.id AS blood_test_id,
    bt.user_id,
    bt.lab_id,
    b.id AS biomarker_id,
    b.name AS biomarker_name,
    b.unit,
    p.gender,
        CASE
            WHEN (p.gender = 'male'::text) THEN COALESCE(lr.ref_male_min, b.ref_male_min)
            ELSE COALESCE(lr.ref_female_min, b.ref_female_min)
        END AS resolved_ref_min,
        CASE
            WHEN (p.gender = 'male'::text) THEN COALESCE(lr.ref_male_max, b.ref_male_max)
            ELSE COALESCE(lr.ref_female_max, b.ref_female_max)
        END AS resolved_ref_max,
        CASE
            WHEN (p.gender = 'male'::text) THEN COALESCE(lr.performance_male_min, b.performance_male_min)
            ELSE COALESCE(lr.performance_female_min, b.performance_female_min)
        END AS resolved_performance_min,
        CASE
            WHEN (p.gender = 'male'::text) THEN COALESCE(lr.performance_male_max, b.performance_male_max)
            ELSE COALESCE(lr.performance_female_max, b.performance_female_max)
        END AS resolved_performance_max,
    lr.lab_ref_min,
    lr.lab_ref_max
   FROM (((public.blood_tests bt
     JOIN public.profiles p ON ((p.id = bt.user_id)))
     JOIN public.biomarkers b ON (true))
     LEFT JOIN public.lab_biomarker_references lr ON (((lr.lab_id = bt.lab_id) AND (lr.biomarker_id = b.id))));


grant delete on table "public"."achievements" to "anon";

grant insert on table "public"."achievements" to "anon";

grant references on table "public"."achievements" to "anon";

grant select on table "public"."achievements" to "anon";

grant trigger on table "public"."achievements" to "anon";

grant truncate on table "public"."achievements" to "anon";

grant update on table "public"."achievements" to "anon";

grant delete on table "public"."achievements" to "authenticated";

grant insert on table "public"."achievements" to "authenticated";

grant references on table "public"."achievements" to "authenticated";

grant select on table "public"."achievements" to "authenticated";

grant trigger on table "public"."achievements" to "authenticated";

grant truncate on table "public"."achievements" to "authenticated";

grant update on table "public"."achievements" to "authenticated";

grant delete on table "public"."achievements" to "service_role";

grant insert on table "public"."achievements" to "service_role";

grant references on table "public"."achievements" to "service_role";

grant select on table "public"."achievements" to "service_role";

grant trigger on table "public"."achievements" to "service_role";

grant truncate on table "public"."achievements" to "service_role";

grant update on table "public"."achievements" to "service_role";

grant delete on table "public"."admin_notifications" to "anon";

grant insert on table "public"."admin_notifications" to "anon";

grant references on table "public"."admin_notifications" to "anon";

grant select on table "public"."admin_notifications" to "anon";

grant trigger on table "public"."admin_notifications" to "anon";

grant truncate on table "public"."admin_notifications" to "anon";

grant update on table "public"."admin_notifications" to "anon";

grant delete on table "public"."admin_notifications" to "authenticated";

grant insert on table "public"."admin_notifications" to "authenticated";

grant references on table "public"."admin_notifications" to "authenticated";

grant select on table "public"."admin_notifications" to "authenticated";

grant trigger on table "public"."admin_notifications" to "authenticated";

grant truncate on table "public"."admin_notifications" to "authenticated";

grant update on table "public"."admin_notifications" to "authenticated";

grant delete on table "public"."admin_notifications" to "service_role";

grant insert on table "public"."admin_notifications" to "service_role";

grant references on table "public"."admin_notifications" to "service_role";

grant select on table "public"."admin_notifications" to "service_role";

grant trigger on table "public"."admin_notifications" to "service_role";

grant truncate on table "public"."admin_notifications" to "service_role";

grant update on table "public"."admin_notifications" to "service_role";

grant delete on table "public"."appointments" to "anon";

grant insert on table "public"."appointments" to "anon";

grant references on table "public"."appointments" to "anon";

grant select on table "public"."appointments" to "anon";

grant trigger on table "public"."appointments" to "anon";

grant truncate on table "public"."appointments" to "anon";

grant update on table "public"."appointments" to "anon";

grant delete on table "public"."appointments" to "authenticated";

grant insert on table "public"."appointments" to "authenticated";

grant references on table "public"."appointments" to "authenticated";

grant select on table "public"."appointments" to "authenticated";

grant trigger on table "public"."appointments" to "authenticated";

grant truncate on table "public"."appointments" to "authenticated";

grant update on table "public"."appointments" to "authenticated";

grant delete on table "public"."appointments" to "service_role";

grant insert on table "public"."appointments" to "service_role";

grant references on table "public"."appointments" to "service_role";

grant select on table "public"."appointments" to "service_role";

grant trigger on table "public"."appointments" to "service_role";

grant truncate on table "public"."appointments" to "service_role";

grant update on table "public"."appointments" to "service_role";

grant delete on table "public"."biomarker_categories" to "anon";

grant insert on table "public"."biomarker_categories" to "anon";

grant references on table "public"."biomarker_categories" to "anon";

grant select on table "public"."biomarker_categories" to "anon";

grant trigger on table "public"."biomarker_categories" to "anon";

grant truncate on table "public"."biomarker_categories" to "anon";

grant update on table "public"."biomarker_categories" to "anon";

grant delete on table "public"."biomarker_categories" to "authenticated";

grant insert on table "public"."biomarker_categories" to "authenticated";

grant references on table "public"."biomarker_categories" to "authenticated";

grant select on table "public"."biomarker_categories" to "authenticated";

grant trigger on table "public"."biomarker_categories" to "authenticated";

grant truncate on table "public"."biomarker_categories" to "authenticated";

grant update on table "public"."biomarker_categories" to "authenticated";

grant delete on table "public"."biomarker_categories" to "service_role";

grant insert on table "public"."biomarker_categories" to "service_role";

grant references on table "public"."biomarker_categories" to "service_role";

grant select on table "public"."biomarker_categories" to "service_role";

grant trigger on table "public"."biomarker_categories" to "service_role";

grant truncate on table "public"."biomarker_categories" to "service_role";

grant update on table "public"."biomarker_categories" to "service_role";

grant delete on table "public"."biomarker_content" to "anon";

grant insert on table "public"."biomarker_content" to "anon";

grant references on table "public"."biomarker_content" to "anon";

grant select on table "public"."biomarker_content" to "anon";

grant trigger on table "public"."biomarker_content" to "anon";

grant truncate on table "public"."biomarker_content" to "anon";

grant update on table "public"."biomarker_content" to "anon";

grant delete on table "public"."biomarker_content" to "authenticated";

grant insert on table "public"."biomarker_content" to "authenticated";

grant references on table "public"."biomarker_content" to "authenticated";

grant select on table "public"."biomarker_content" to "authenticated";

grant trigger on table "public"."biomarker_content" to "authenticated";

grant truncate on table "public"."biomarker_content" to "authenticated";

grant update on table "public"."biomarker_content" to "authenticated";

grant delete on table "public"."biomarker_content" to "service_role";

grant insert on table "public"."biomarker_content" to "service_role";

grant references on table "public"."biomarker_content" to "service_role";

grant select on table "public"."biomarker_content" to "service_role";

grant trigger on table "public"."biomarker_content" to "service_role";

grant truncate on table "public"."biomarker_content" to "service_role";

grant update on table "public"."biomarker_content" to "service_role";

grant delete on table "public"."biomarker_dependencies" to "anon";

grant insert on table "public"."biomarker_dependencies" to "anon";

grant references on table "public"."biomarker_dependencies" to "anon";

grant select on table "public"."biomarker_dependencies" to "anon";

grant trigger on table "public"."biomarker_dependencies" to "anon";

grant truncate on table "public"."biomarker_dependencies" to "anon";

grant update on table "public"."biomarker_dependencies" to "anon";

grant delete on table "public"."biomarker_dependencies" to "authenticated";

grant insert on table "public"."biomarker_dependencies" to "authenticated";

grant references on table "public"."biomarker_dependencies" to "authenticated";

grant select on table "public"."biomarker_dependencies" to "authenticated";

grant trigger on table "public"."biomarker_dependencies" to "authenticated";

grant truncate on table "public"."biomarker_dependencies" to "authenticated";

grant update on table "public"."biomarker_dependencies" to "authenticated";

grant delete on table "public"."biomarker_dependencies" to "service_role";

grant insert on table "public"."biomarker_dependencies" to "service_role";

grant references on table "public"."biomarker_dependencies" to "service_role";

grant select on table "public"."biomarker_dependencies" to "service_role";

grant trigger on table "public"."biomarker_dependencies" to "service_role";

grant truncate on table "public"."biomarker_dependencies" to "service_role";

grant update on table "public"."biomarker_dependencies" to "service_role";

grant delete on table "public"."biomarkers" to "anon";

grant insert on table "public"."biomarkers" to "anon";

grant references on table "public"."biomarkers" to "anon";

grant select on table "public"."biomarkers" to "anon";

grant trigger on table "public"."biomarkers" to "anon";

grant truncate on table "public"."biomarkers" to "anon";

grant update on table "public"."biomarkers" to "anon";

grant delete on table "public"."biomarkers" to "authenticated";

grant insert on table "public"."biomarkers" to "authenticated";

grant references on table "public"."biomarkers" to "authenticated";

grant select on table "public"."biomarkers" to "authenticated";

grant trigger on table "public"."biomarkers" to "authenticated";

grant truncate on table "public"."biomarkers" to "authenticated";

grant update on table "public"."biomarkers" to "authenticated";

grant delete on table "public"."biomarkers" to "service_role";

grant insert on table "public"."biomarkers" to "service_role";

grant references on table "public"."biomarkers" to "service_role";

grant select on table "public"."biomarkers" to "service_role";

grant trigger on table "public"."biomarkers" to "service_role";

grant truncate on table "public"."biomarkers" to "service_role";

grant update on table "public"."biomarkers" to "service_role";

grant delete on table "public"."blood_result_uploads" to "anon";

grant insert on table "public"."blood_result_uploads" to "anon";

grant references on table "public"."blood_result_uploads" to "anon";

grant select on table "public"."blood_result_uploads" to "anon";

grant trigger on table "public"."blood_result_uploads" to "anon";

grant truncate on table "public"."blood_result_uploads" to "anon";

grant update on table "public"."blood_result_uploads" to "anon";

grant delete on table "public"."blood_result_uploads" to "authenticated";

grant insert on table "public"."blood_result_uploads" to "authenticated";

grant references on table "public"."blood_result_uploads" to "authenticated";

grant select on table "public"."blood_result_uploads" to "authenticated";

grant trigger on table "public"."blood_result_uploads" to "authenticated";

grant truncate on table "public"."blood_result_uploads" to "authenticated";

grant update on table "public"."blood_result_uploads" to "authenticated";

grant delete on table "public"."blood_result_uploads" to "service_role";

grant insert on table "public"."blood_result_uploads" to "service_role";

grant references on table "public"."blood_result_uploads" to "service_role";

grant select on table "public"."blood_result_uploads" to "service_role";

grant trigger on table "public"."blood_result_uploads" to "service_role";

grant truncate on table "public"."blood_result_uploads" to "service_role";

grant update on table "public"."blood_result_uploads" to "service_role";

grant delete on table "public"."blood_test_results" to "anon";

grant insert on table "public"."blood_test_results" to "anon";

grant references on table "public"."blood_test_results" to "anon";

grant select on table "public"."blood_test_results" to "anon";

grant trigger on table "public"."blood_test_results" to "anon";

grant truncate on table "public"."blood_test_results" to "anon";

grant update on table "public"."blood_test_results" to "anon";

grant delete on table "public"."blood_test_results" to "authenticated";

grant insert on table "public"."blood_test_results" to "authenticated";

grant references on table "public"."blood_test_results" to "authenticated";

grant select on table "public"."blood_test_results" to "authenticated";

grant trigger on table "public"."blood_test_results" to "authenticated";

grant truncate on table "public"."blood_test_results" to "authenticated";

grant update on table "public"."blood_test_results" to "authenticated";

grant delete on table "public"."blood_test_results" to "service_role";

grant insert on table "public"."blood_test_results" to "service_role";

grant references on table "public"."blood_test_results" to "service_role";

grant select on table "public"."blood_test_results" to "service_role";

grant trigger on table "public"."blood_test_results" to "service_role";

grant truncate on table "public"."blood_test_results" to "service_role";

grant update on table "public"."blood_test_results" to "service_role";

grant delete on table "public"."blood_tests" to "anon";

grant insert on table "public"."blood_tests" to "anon";

grant references on table "public"."blood_tests" to "anon";

grant select on table "public"."blood_tests" to "anon";

grant trigger on table "public"."blood_tests" to "anon";

grant truncate on table "public"."blood_tests" to "anon";

grant update on table "public"."blood_tests" to "anon";

grant delete on table "public"."blood_tests" to "authenticated";

grant insert on table "public"."blood_tests" to "authenticated";

grant references on table "public"."blood_tests" to "authenticated";

grant select on table "public"."blood_tests" to "authenticated";

grant trigger on table "public"."blood_tests" to "authenticated";

grant truncate on table "public"."blood_tests" to "authenticated";

grant update on table "public"."blood_tests" to "authenticated";

grant delete on table "public"."blood_tests" to "service_role";

grant insert on table "public"."blood_tests" to "service_role";

grant references on table "public"."blood_tests" to "service_role";

grant select on table "public"."blood_tests" to "service_role";

grant trigger on table "public"."blood_tests" to "service_role";

grant truncate on table "public"."blood_tests" to "service_role";

grant update on table "public"."blood_tests" to "service_role";

grant delete on table "public"."chat_conversations" to "anon";

grant insert on table "public"."chat_conversations" to "anon";

grant references on table "public"."chat_conversations" to "anon";

grant select on table "public"."chat_conversations" to "anon";

grant trigger on table "public"."chat_conversations" to "anon";

grant truncate on table "public"."chat_conversations" to "anon";

grant update on table "public"."chat_conversations" to "anon";

grant delete on table "public"."chat_conversations" to "authenticated";

grant insert on table "public"."chat_conversations" to "authenticated";

grant references on table "public"."chat_conversations" to "authenticated";

grant select on table "public"."chat_conversations" to "authenticated";

grant trigger on table "public"."chat_conversations" to "authenticated";

grant truncate on table "public"."chat_conversations" to "authenticated";

grant update on table "public"."chat_conversations" to "authenticated";

grant delete on table "public"."chat_conversations" to "service_role";

grant insert on table "public"."chat_conversations" to "service_role";

grant references on table "public"."chat_conversations" to "service_role";

grant select on table "public"."chat_conversations" to "service_role";

grant trigger on table "public"."chat_conversations" to "service_role";

grant truncate on table "public"."chat_conversations" to "service_role";

grant update on table "public"."chat_conversations" to "service_role";

grant delete on table "public"."chat_messages" to "anon";

grant insert on table "public"."chat_messages" to "anon";

grant references on table "public"."chat_messages" to "anon";

grant select on table "public"."chat_messages" to "anon";

grant trigger on table "public"."chat_messages" to "anon";

grant truncate on table "public"."chat_messages" to "anon";

grant update on table "public"."chat_messages" to "anon";

grant delete on table "public"."chat_messages" to "authenticated";

grant insert on table "public"."chat_messages" to "authenticated";

grant references on table "public"."chat_messages" to "authenticated";

grant select on table "public"."chat_messages" to "authenticated";

grant trigger on table "public"."chat_messages" to "authenticated";

grant truncate on table "public"."chat_messages" to "authenticated";

grant update on table "public"."chat_messages" to "authenticated";

grant delete on table "public"."chat_messages" to "service_role";

grant insert on table "public"."chat_messages" to "service_role";

grant references on table "public"."chat_messages" to "service_role";

grant select on table "public"."chat_messages" to "service_role";

grant trigger on table "public"."chat_messages" to "service_role";

grant truncate on table "public"."chat_messages" to "service_role";

grant update on table "public"."chat_messages" to "service_role";

grant delete on table "public"."community_comments" to "anon";

grant insert on table "public"."community_comments" to "anon";

grant references on table "public"."community_comments" to "anon";

grant select on table "public"."community_comments" to "anon";

grant trigger on table "public"."community_comments" to "anon";

grant truncate on table "public"."community_comments" to "anon";

grant update on table "public"."community_comments" to "anon";

grant delete on table "public"."community_comments" to "authenticated";

grant insert on table "public"."community_comments" to "authenticated";

grant references on table "public"."community_comments" to "authenticated";

grant select on table "public"."community_comments" to "authenticated";

grant trigger on table "public"."community_comments" to "authenticated";

grant truncate on table "public"."community_comments" to "authenticated";

grant update on table "public"."community_comments" to "authenticated";

grant delete on table "public"."community_comments" to "service_role";

grant insert on table "public"."community_comments" to "service_role";

grant references on table "public"."community_comments" to "service_role";

grant select on table "public"."community_comments" to "service_role";

grant trigger on table "public"."community_comments" to "service_role";

grant truncate on table "public"."community_comments" to "service_role";

grant update on table "public"."community_comments" to "service_role";

grant delete on table "public"."community_likes" to "anon";

grant insert on table "public"."community_likes" to "anon";

grant references on table "public"."community_likes" to "anon";

grant select on table "public"."community_likes" to "anon";

grant trigger on table "public"."community_likes" to "anon";

grant truncate on table "public"."community_likes" to "anon";

grant update on table "public"."community_likes" to "anon";

grant delete on table "public"."community_likes" to "authenticated";

grant insert on table "public"."community_likes" to "authenticated";

grant references on table "public"."community_likes" to "authenticated";

grant select on table "public"."community_likes" to "authenticated";

grant trigger on table "public"."community_likes" to "authenticated";

grant truncate on table "public"."community_likes" to "authenticated";

grant update on table "public"."community_likes" to "authenticated";

grant delete on table "public"."community_likes" to "service_role";

grant insert on table "public"."community_likes" to "service_role";

grant references on table "public"."community_likes" to "service_role";

grant select on table "public"."community_likes" to "service_role";

grant trigger on table "public"."community_likes" to "service_role";

grant truncate on table "public"."community_likes" to "service_role";

grant update on table "public"."community_likes" to "service_role";

grant delete on table "public"."community_posts" to "anon";

grant insert on table "public"."community_posts" to "anon";

grant references on table "public"."community_posts" to "anon";

grant select on table "public"."community_posts" to "anon";

grant trigger on table "public"."community_posts" to "anon";

grant truncate on table "public"."community_posts" to "anon";

grant update on table "public"."community_posts" to "anon";

grant delete on table "public"."community_posts" to "authenticated";

grant insert on table "public"."community_posts" to "authenticated";

grant references on table "public"."community_posts" to "authenticated";

grant select on table "public"."community_posts" to "authenticated";

grant trigger on table "public"."community_posts" to "authenticated";

grant truncate on table "public"."community_posts" to "authenticated";

grant update on table "public"."community_posts" to "authenticated";

grant delete on table "public"."community_posts" to "service_role";

grant insert on table "public"."community_posts" to "service_role";

grant references on table "public"."community_posts" to "service_role";

grant select on table "public"."community_posts" to "service_role";

grant trigger on table "public"."community_posts" to "service_role";

grant truncate on table "public"."community_posts" to "service_role";

grant update on table "public"."community_posts" to "service_role";

grant delete on table "public"."deep_research_reports" to "anon";

grant insert on table "public"."deep_research_reports" to "anon";

grant references on table "public"."deep_research_reports" to "anon";

grant select on table "public"."deep_research_reports" to "anon";

grant trigger on table "public"."deep_research_reports" to "anon";

grant truncate on table "public"."deep_research_reports" to "anon";

grant update on table "public"."deep_research_reports" to "anon";

grant delete on table "public"."deep_research_reports" to "authenticated";

grant insert on table "public"."deep_research_reports" to "authenticated";

grant references on table "public"."deep_research_reports" to "authenticated";

grant select on table "public"."deep_research_reports" to "authenticated";

grant trigger on table "public"."deep_research_reports" to "authenticated";

grant truncate on table "public"."deep_research_reports" to "authenticated";

grant update on table "public"."deep_research_reports" to "authenticated";

grant delete on table "public"."deep_research_reports" to "service_role";

grant insert on table "public"."deep_research_reports" to "service_role";

grant references on table "public"."deep_research_reports" to "service_role";

grant select on table "public"."deep_research_reports" to "service_role";

grant trigger on table "public"."deep_research_reports" to "service_role";

grant truncate on table "public"."deep_research_reports" to "service_role";

grant update on table "public"."deep_research_reports" to "service_role";

grant delete on table "public"."goals" to "anon";

grant insert on table "public"."goals" to "anon";

grant references on table "public"."goals" to "anon";

grant select on table "public"."goals" to "anon";

grant trigger on table "public"."goals" to "anon";

grant truncate on table "public"."goals" to "anon";

grant update on table "public"."goals" to "anon";

grant delete on table "public"."goals" to "authenticated";

grant insert on table "public"."goals" to "authenticated";

grant references on table "public"."goals" to "authenticated";

grant select on table "public"."goals" to "authenticated";

grant trigger on table "public"."goals" to "authenticated";

grant truncate on table "public"."goals" to "authenticated";

grant update on table "public"."goals" to "authenticated";

grant delete on table "public"."goals" to "service_role";

grant insert on table "public"."goals" to "service_role";

grant references on table "public"."goals" to "service_role";

grant select on table "public"."goals" to "service_role";

grant trigger on table "public"."goals" to "service_role";

grant truncate on table "public"."goals" to "service_role";

grant update on table "public"."goals" to "service_role";

grant delete on table "public"."lab_biomarker_references" to "anon";

grant insert on table "public"."lab_biomarker_references" to "anon";

grant references on table "public"."lab_biomarker_references" to "anon";

grant select on table "public"."lab_biomarker_references" to "anon";

grant trigger on table "public"."lab_biomarker_references" to "anon";

grant truncate on table "public"."lab_biomarker_references" to "anon";

grant update on table "public"."lab_biomarker_references" to "anon";

grant delete on table "public"."lab_biomarker_references" to "authenticated";

grant insert on table "public"."lab_biomarker_references" to "authenticated";

grant references on table "public"."lab_biomarker_references" to "authenticated";

grant select on table "public"."lab_biomarker_references" to "authenticated";

grant trigger on table "public"."lab_biomarker_references" to "authenticated";

grant truncate on table "public"."lab_biomarker_references" to "authenticated";

grant update on table "public"."lab_biomarker_references" to "authenticated";

grant delete on table "public"."lab_biomarker_references" to "service_role";

grant insert on table "public"."lab_biomarker_references" to "service_role";

grant references on table "public"."lab_biomarker_references" to "service_role";

grant select on table "public"."lab_biomarker_references" to "service_role";

grant trigger on table "public"."lab_biomarker_references" to "service_role";

grant truncate on table "public"."lab_biomarker_references" to "service_role";

grant update on table "public"."lab_biomarker_references" to "service_role";

grant delete on table "public"."labs" to "anon";

grant insert on table "public"."labs" to "anon";

grant references on table "public"."labs" to "anon";

grant select on table "public"."labs" to "anon";

grant trigger on table "public"."labs" to "anon";

grant truncate on table "public"."labs" to "anon";

grant update on table "public"."labs" to "anon";

grant delete on table "public"."labs" to "authenticated";

grant insert on table "public"."labs" to "authenticated";

grant references on table "public"."labs" to "authenticated";

grant select on table "public"."labs" to "authenticated";

grant trigger on table "public"."labs" to "authenticated";

grant truncate on table "public"."labs" to "authenticated";

grant update on table "public"."labs" to "authenticated";

grant delete on table "public"."labs" to "service_role";

grant insert on table "public"."labs" to "service_role";

grant references on table "public"."labs" to "service_role";

grant select on table "public"."labs" to "service_role";

grant trigger on table "public"."labs" to "service_role";

grant truncate on table "public"."labs" to "service_role";

grant update on table "public"."labs" to "service_role";

grant delete on table "public"."panel_biomarkers" to "anon";

grant insert on table "public"."panel_biomarkers" to "anon";

grant references on table "public"."panel_biomarkers" to "anon";

grant select on table "public"."panel_biomarkers" to "anon";

grant trigger on table "public"."panel_biomarkers" to "anon";

grant truncate on table "public"."panel_biomarkers" to "anon";

grant update on table "public"."panel_biomarkers" to "anon";

grant delete on table "public"."panel_biomarkers" to "authenticated";

grant insert on table "public"."panel_biomarkers" to "authenticated";

grant references on table "public"."panel_biomarkers" to "authenticated";

grant select on table "public"."panel_biomarkers" to "authenticated";

grant trigger on table "public"."panel_biomarkers" to "authenticated";

grant truncate on table "public"."panel_biomarkers" to "authenticated";

grant update on table "public"."panel_biomarkers" to "authenticated";

grant delete on table "public"."panel_biomarkers" to "service_role";

grant insert on table "public"."panel_biomarkers" to "service_role";

grant references on table "public"."panel_biomarkers" to "service_role";

grant select on table "public"."panel_biomarkers" to "service_role";

grant trigger on table "public"."panel_biomarkers" to "service_role";

grant truncate on table "public"."panel_biomarkers" to "service_role";

grant update on table "public"."panel_biomarkers" to "service_role";

grant delete on table "public"."panels" to "anon";

grant insert on table "public"."panels" to "anon";

grant references on table "public"."panels" to "anon";

grant select on table "public"."panels" to "anon";

grant trigger on table "public"."panels" to "anon";

grant truncate on table "public"."panels" to "anon";

grant update on table "public"."panels" to "anon";

grant delete on table "public"."panels" to "authenticated";

grant insert on table "public"."panels" to "authenticated";

grant references on table "public"."panels" to "authenticated";

grant select on table "public"."panels" to "authenticated";

grant trigger on table "public"."panels" to "authenticated";

grant truncate on table "public"."panels" to "authenticated";

grant update on table "public"."panels" to "authenticated";

grant delete on table "public"."panels" to "service_role";

grant insert on table "public"."panels" to "service_role";

grant references on table "public"."panels" to "service_role";

grant select on table "public"."panels" to "service_role";

grant trigger on table "public"."panels" to "service_role";

grant truncate on table "public"."panels" to "service_role";

grant update on table "public"."panels" to "service_role";

grant delete on table "public"."partner_applications" to "anon";

grant insert on table "public"."partner_applications" to "anon";

grant references on table "public"."partner_applications" to "anon";

grant select on table "public"."partner_applications" to "anon";

grant trigger on table "public"."partner_applications" to "anon";

grant truncate on table "public"."partner_applications" to "anon";

grant update on table "public"."partner_applications" to "anon";

grant delete on table "public"."partner_applications" to "authenticated";

grant insert on table "public"."partner_applications" to "authenticated";

grant references on table "public"."partner_applications" to "authenticated";

grant select on table "public"."partner_applications" to "authenticated";

grant trigger on table "public"."partner_applications" to "authenticated";

grant truncate on table "public"."partner_applications" to "authenticated";

grant update on table "public"."partner_applications" to "authenticated";

grant delete on table "public"."partner_applications" to "service_role";

grant insert on table "public"."partner_applications" to "service_role";

grant references on table "public"."partner_applications" to "service_role";

grant select on table "public"."partner_applications" to "service_role";

grant trigger on table "public"."partner_applications" to "service_role";

grant truncate on table "public"."partner_applications" to "service_role";

grant update on table "public"."partner_applications" to "service_role";

grant delete on table "public"."partners" to "anon";

grant insert on table "public"."partners" to "anon";

grant references on table "public"."partners" to "anon";

grant select on table "public"."partners" to "anon";

grant trigger on table "public"."partners" to "anon";

grant truncate on table "public"."partners" to "anon";

grant update on table "public"."partners" to "anon";

grant delete on table "public"."partners" to "authenticated";

grant insert on table "public"."partners" to "authenticated";

grant references on table "public"."partners" to "authenticated";

grant select on table "public"."partners" to "authenticated";

grant trigger on table "public"."partners" to "authenticated";

grant truncate on table "public"."partners" to "authenticated";

grant update on table "public"."partners" to "authenticated";

grant delete on table "public"."partners" to "service_role";

grant insert on table "public"."partners" to "service_role";

grant references on table "public"."partners" to "service_role";

grant select on table "public"."partners" to "service_role";

grant trigger on table "public"."partners" to "service_role";

grant truncate on table "public"."partners" to "service_role";

grant update on table "public"."partners" to "service_role";

grant delete on table "public"."peak_scores" to "anon";

grant insert on table "public"."peak_scores" to "anon";

grant references on table "public"."peak_scores" to "anon";

grant select on table "public"."peak_scores" to "anon";

grant trigger on table "public"."peak_scores" to "anon";

grant truncate on table "public"."peak_scores" to "anon";

grant update on table "public"."peak_scores" to "anon";

grant delete on table "public"."peak_scores" to "authenticated";

grant insert on table "public"."peak_scores" to "authenticated";

grant references on table "public"."peak_scores" to "authenticated";

grant select on table "public"."peak_scores" to "authenticated";

grant trigger on table "public"."peak_scores" to "authenticated";

grant truncate on table "public"."peak_scores" to "authenticated";

grant update on table "public"."peak_scores" to "authenticated";

grant delete on table "public"."peak_scores" to "service_role";

grant insert on table "public"."peak_scores" to "service_role";

grant references on table "public"."peak_scores" to "service_role";

grant select on table "public"."peak_scores" to "service_role";

grant trigger on table "public"."peak_scores" to "service_role";

grant truncate on table "public"."peak_scores" to "service_role";

grant update on table "public"."peak_scores" to "service_role";

grant delete on table "public"."performance_profiles" to "anon";

grant insert on table "public"."performance_profiles" to "anon";

grant references on table "public"."performance_profiles" to "anon";

grant select on table "public"."performance_profiles" to "anon";

grant trigger on table "public"."performance_profiles" to "anon";

grant truncate on table "public"."performance_profiles" to "anon";

grant update on table "public"."performance_profiles" to "anon";

grant delete on table "public"."performance_profiles" to "authenticated";

grant insert on table "public"."performance_profiles" to "authenticated";

grant references on table "public"."performance_profiles" to "authenticated";

grant select on table "public"."performance_profiles" to "authenticated";

grant trigger on table "public"."performance_profiles" to "authenticated";

grant truncate on table "public"."performance_profiles" to "authenticated";

grant update on table "public"."performance_profiles" to "authenticated";

grant delete on table "public"."performance_profiles" to "service_role";

grant insert on table "public"."performance_profiles" to "service_role";

grant references on table "public"."performance_profiles" to "service_role";

grant select on table "public"."performance_profiles" to "service_role";

grant trigger on table "public"."performance_profiles" to "service_role";

grant truncate on table "public"."performance_profiles" to "service_role";

grant update on table "public"."performance_profiles" to "service_role";

grant delete on table "public"."performance_scores" to "anon";

grant insert on table "public"."performance_scores" to "anon";

grant references on table "public"."performance_scores" to "anon";

grant select on table "public"."performance_scores" to "anon";

grant trigger on table "public"."performance_scores" to "anon";

grant truncate on table "public"."performance_scores" to "anon";

grant update on table "public"."performance_scores" to "anon";

grant delete on table "public"."performance_scores" to "authenticated";

grant insert on table "public"."performance_scores" to "authenticated";

grant references on table "public"."performance_scores" to "authenticated";

grant select on table "public"."performance_scores" to "authenticated";

grant trigger on table "public"."performance_scores" to "authenticated";

grant truncate on table "public"."performance_scores" to "authenticated";

grant update on table "public"."performance_scores" to "authenticated";

grant delete on table "public"."performance_scores" to "service_role";

grant insert on table "public"."performance_scores" to "service_role";

grant references on table "public"."performance_scores" to "service_role";

grant select on table "public"."performance_scores" to "service_role";

grant trigger on table "public"."performance_scores" to "service_role";

grant truncate on table "public"."performance_scores" to "service_role";

grant update on table "public"."performance_scores" to "service_role";

grant delete on table "public"."performances" to "anon";

grant insert on table "public"."performances" to "anon";

grant references on table "public"."performances" to "anon";

grant select on table "public"."performances" to "anon";

grant trigger on table "public"."performances" to "anon";

grant truncate on table "public"."performances" to "anon";

grant update on table "public"."performances" to "anon";

grant delete on table "public"."performances" to "authenticated";

grant insert on table "public"."performances" to "authenticated";

grant references on table "public"."performances" to "authenticated";

grant select on table "public"."performances" to "authenticated";

grant trigger on table "public"."performances" to "authenticated";

grant truncate on table "public"."performances" to "authenticated";

grant update on table "public"."performances" to "authenticated";

grant delete on table "public"."performances" to "service_role";

grant insert on table "public"."performances" to "service_role";

grant references on table "public"."performances" to "service_role";

grant select on table "public"."performances" to "service_role";

grant trigger on table "public"."performances" to "service_role";

grant truncate on table "public"."performances" to "service_role";

grant update on table "public"."performances" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

grant delete on table "public"."system_config" to "anon";

grant insert on table "public"."system_config" to "anon";

grant references on table "public"."system_config" to "anon";

grant select on table "public"."system_config" to "anon";

grant trigger on table "public"."system_config" to "anon";

grant truncate on table "public"."system_config" to "anon";

grant update on table "public"."system_config" to "anon";

grant delete on table "public"."system_config" to "authenticated";

grant insert on table "public"."system_config" to "authenticated";

grant references on table "public"."system_config" to "authenticated";

grant select on table "public"."system_config" to "authenticated";

grant trigger on table "public"."system_config" to "authenticated";

grant truncate on table "public"."system_config" to "authenticated";

grant update on table "public"."system_config" to "authenticated";

grant delete on table "public"."system_config" to "service_role";

grant insert on table "public"."system_config" to "service_role";

grant references on table "public"."system_config" to "service_role";

grant select on table "public"."system_config" to "service_role";

grant trigger on table "public"."system_config" to "service_role";

grant truncate on table "public"."system_config" to "service_role";

grant update on table "public"."system_config" to "service_role";

grant delete on table "public"."user_metrics" to "anon";

grant insert on table "public"."user_metrics" to "anon";

grant references on table "public"."user_metrics" to "anon";

grant select on table "public"."user_metrics" to "anon";

grant trigger on table "public"."user_metrics" to "anon";

grant truncate on table "public"."user_metrics" to "anon";

grant update on table "public"."user_metrics" to "anon";

grant delete on table "public"."user_metrics" to "authenticated";

grant insert on table "public"."user_metrics" to "authenticated";

grant references on table "public"."user_metrics" to "authenticated";

grant select on table "public"."user_metrics" to "authenticated";

grant trigger on table "public"."user_metrics" to "authenticated";

grant truncate on table "public"."user_metrics" to "authenticated";

grant update on table "public"."user_metrics" to "authenticated";

grant delete on table "public"."user_metrics" to "service_role";

grant insert on table "public"."user_metrics" to "service_role";

grant references on table "public"."user_metrics" to "service_role";

grant select on table "public"."user_metrics" to "service_role";

grant trigger on table "public"."user_metrics" to "service_role";

grant truncate on table "public"."user_metrics" to "service_role";

grant update on table "public"."user_metrics" to "service_role";

grant delete on table "public"."user_notifications" to "anon";

grant insert on table "public"."user_notifications" to "anon";

grant references on table "public"."user_notifications" to "anon";

grant select on table "public"."user_notifications" to "anon";

grant trigger on table "public"."user_notifications" to "anon";

grant truncate on table "public"."user_notifications" to "anon";

grant update on table "public"."user_notifications" to "anon";

grant delete on table "public"."user_notifications" to "authenticated";

grant insert on table "public"."user_notifications" to "authenticated";

grant references on table "public"."user_notifications" to "authenticated";

grant select on table "public"."user_notifications" to "authenticated";

grant trigger on table "public"."user_notifications" to "authenticated";

grant truncate on table "public"."user_notifications" to "authenticated";

grant update on table "public"."user_notifications" to "authenticated";

grant delete on table "public"."user_notifications" to "service_role";

grant insert on table "public"."user_notifications" to "service_role";

grant references on table "public"."user_notifications" to "service_role";

grant select on table "public"."user_notifications" to "service_role";

grant trigger on table "public"."user_notifications" to "service_role";

grant truncate on table "public"."user_notifications" to "service_role";

grant update on table "public"."user_notifications" to "service_role";

grant delete on table "public"."user_settings" to "anon";

grant insert on table "public"."user_settings" to "anon";

grant references on table "public"."user_settings" to "anon";

grant select on table "public"."user_settings" to "anon";

grant trigger on table "public"."user_settings" to "anon";

grant truncate on table "public"."user_settings" to "anon";

grant update on table "public"."user_settings" to "anon";

grant delete on table "public"."user_settings" to "authenticated";

grant insert on table "public"."user_settings" to "authenticated";

grant references on table "public"."user_settings" to "authenticated";

grant select on table "public"."user_settings" to "authenticated";

grant trigger on table "public"."user_settings" to "authenticated";

grant truncate on table "public"."user_settings" to "authenticated";

grant update on table "public"."user_settings" to "authenticated";

grant delete on table "public"."user_settings" to "service_role";

grant insert on table "public"."user_settings" to "service_role";

grant references on table "public"."user_settings" to "service_role";

grant select on table "public"."user_settings" to "service_role";

grant trigger on table "public"."user_settings" to "service_role";

grant truncate on table "public"."user_settings" to "service_role";

grant update on table "public"."user_settings" to "service_role";


  create policy "Admin notifications viewable by authenticated"
  on "public"."admin_notifications"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Users can view their own appointments"
  on "public"."appointments"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Biomarker content is viewable by authenticated users"
  on "public"."biomarker_content"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Users can insert own uploads"
  on "public"."blood_result_uploads"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view own uploads"
  on "public"."blood_result_uploads"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can manage own conversations"
  on "public"."chat_conversations"
  as permissive
  for all
  to public
using ((user_id = auth.uid()));



  create policy "Users can manage messages in own conversations"
  on "public"."chat_messages"
  as permissive
  for all
  to public
using ((conversation_id IN ( SELECT chat_conversations.id
   FROM public.chat_conversations
  WHERE (chat_conversations.user_id = auth.uid()))));



  create policy "Lab refs are viewable by authenticated users"
  on "public"."lab_biomarker_references"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Labs are viewable by authenticated users"
  on "public"."labs"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Users can delete their own performance profile"
  on "public"."performance_profiles"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert their own performance profile"
  on "public"."performance_profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own performance profile"
  on "public"."performance_profiles"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own performance profile"
  on "public"."performance_profiles"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Public profiles are viewable by everyone."
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



  create policy "Users can insert their own profile."
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can update own profile."
  on "public"."profiles"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can read own subscription"
  on "public"."subscriptions"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own settings"
  on "public"."user_settings"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own settings"
  on "public"."user_settings"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own settings"
  on "public"."user_settings"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER trigger_update_appointment_timestamp BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_appointment_timestamp();

CREATE TRIGGER trigger_update_performance_profile_timestamp BEFORE UPDATE ON public.performance_profiles FOR EACH ROW EXECUTE FUNCTION public.update_performance_profile_timestamp();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Anyone can upload an avatar."
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'avatars'::text));



  create policy "Avatar images are publicly accessible."
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'avatars'::text) AND (name IS NOT NULL)));



