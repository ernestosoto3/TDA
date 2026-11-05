CREATE EXTENSION IF NOT EXISTS "citext";--> statement-breakpoint
CREATE TYPE "public"."athlete_status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TYPE "public"."audit_result" AS ENUM('succeeded', 'denied', 'failed');--> statement-breakpoint
CREATE TYPE "public"."comment_status" AS ENUM('active', 'hidden', 'soft_deleted');--> statement-breakpoint
CREATE TYPE "public"."community_status" AS ENUM('active', 'restricted', 'archived');--> statement-breakpoint
CREATE TYPE "public"."deletion_request_status" AS ENUM('pending_verification', 'verified', 'scheduled', 'completed', 'cancelled', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."escalation_status" AS ENUM('open', 'reviewing', 'resolved', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."game_status" AS ENUM('scheduled', 'in_progress', 'finished', 'postponed', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."league_status" AS ENUM('upcoming', 'ongoing', 'finished', 'archived');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."membership_role" AS ENUM('member', 'moderator', 'admin');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('active', 'muted', 'banned', 'left');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('active', 'hidden', 'soft_deleted');--> statement-breakpoint
CREATE TYPE "public"."mobile_platform" AS ENUM('ios', 'android');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('game_reminder', 'game_start', 'score_update', 'final_score', 'schedule_change', 'breaking_news', 'comment_reply', 'community_activity', 'official_announcement', 'system');--> statement-breakpoint
CREATE TYPE "public"."platform_role" AS ENUM('moderator', 'editor', 'administrator');--> statement-breakpoint
CREATE TYPE "public"."policy_status" AS ENUM('draft', 'published', 'superseded', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."policy_type" AS ENUM('terms_of_service', 'privacy_policy');--> statement-breakpoint
CREATE TYPE "public"."post_content_type" AS ENUM('post', 'article');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'scheduled', 'published', 'archived', 'hidden', 'soft_deleted');--> statement-breakpoint
CREATE TYPE "public"."push_provider" AS ENUM('expo', 'fcm');--> statement-breakpoint
CREATE TYPE "public"."report_action_type" AS ENUM('assignment', 'review', 'warning', 'hide', 'restore', 'mute', 'escalate', 'resolve', 'dismiss', 'reopen');--> statement-breakpoint
CREATE TYPE "public"."report_entity_type" AS ENUM('post', 'comment', 'message', 'user');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('pending', 'in_review', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."score_result_type" AS ENUM('home_win', 'away_win', 'draw', 'no_contest');--> statement-breakpoint
CREATE TYPE "public"."score_status" AS ENUM('pending', 'updated', 'final');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('official_federation', 'official_league', 'official_team', 'approved_provider', 'other_verified');--> statement-breakpoint
CREATE TYPE "public"."sport_status" AS ENUM('draft', 'active', 'inactive', 'archived');--> statement-breakpoint
CREATE TYPE "public"."team_status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'suspended', 'soft_deleted');--> statement-breakpoint
CREATE TABLE "account_deletion_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "deletion_request_status" NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"identity_verified_at" timestamp with time zone,
	"scheduled_for" timestamp with time zone,
	"processed_by_user_id" uuid,
	"processing_reason" text,
	"completed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "account_deletion_requests_completed_requires_completed_at_check" CHECK ("account_deletion_requests"."status" <> 'completed' OR "account_deletion_requests"."completed_at" IS NOT NULL),
	CONSTRAINT "account_deletion_requests_cancelled_requires_cancelled_at_check" CHECK ("account_deletion_requests"."status" <> 'cancelled' OR "account_deletion_requests"."cancelled_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "athletes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"current_team_id" uuid NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"position" varchar(100) NOT NULL,
	"jersey_number" varchar(10),
	"photo_url" text,
	"status" "athlete_status" DEFAULT 'active' NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"action" varchar(150) NOT NULL,
	"target_type" varchar(100) NOT NULL,
	"target_id" uuid,
	"scope_type" varchar(100),
	"scope_id" uuid,
	"reason" text,
	"result" "audit_result" NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"author_user_id" uuid NOT NULL,
	"parent_comment_id" uuid,
	"content" text NOT NULL,
	"status" "comment_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "comments_id_post_id_unique" UNIQUE("id","post_id")
);
--> statement-breakpoint
CREATE TABLE "communities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"slug" "citext" NOT NULL,
	"description" text,
	"guidelines" text,
	"avatar_url" text,
	"banner_url" text,
	"linked_sport_id" uuid,
	"linked_league_id" uuid,
	"linked_team_id" uuid,
	"status" "community_status" DEFAULT 'active' NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"search_vector" "tsvector" GENERATED ALWAYS AS (
      setweight(to_tsvector('simple', coalesce("name", '')), 'A') ||
      setweight(to_tsvector('simple', coalesce("description", '')), 'B') ||
      setweight(to_tsvector('simple', coalesce("guidelines", '')), 'C')
    ) STORED,
	CONSTRAINT "communities_slug_unique" UNIQUE("slug"),
	CONSTRAINT "communities_max_one_linked_entity_check" CHECK (num_nonnulls("communities"."linked_sport_id","communities"."linked_league_id","communities"."linked_team_id") <= 1)
);
--> statement-breakpoint
CREATE TABLE "community_memberships" (
	"community_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "membership_role" DEFAULT 'member' NOT NULL,
	"status" "membership_status" DEFAULT 'active' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"left_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "community_memberships_community_id_user_id_pk" PRIMARY KEY("community_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "data_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"type" "source_type" NOT NULL,
	"base_url" text,
	"is_approved" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"sport_id" uuid,
	"league_id" uuid,
	"team_id" uuid,
	"athlete_id" uuid,
	"game_id" uuid,
	"score_id" uuid,
	"post_id" uuid,
	"source_reference_url" text,
	"verified_by_user_id" uuid NOT NULL,
	"verified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "data_verifications_exactly_one_target_check" CHECK (num_nonnulls(
"data_verifications"."sport_id",
"data_verifications"."league_id",
"data_verifications"."team_id",
"data_verifications"."athlete_id",
"data_verifications"."game_id",
"data_verifications"."score_id",
"data_verifications"."post_id"
) = 1)
);
--> statement-breakpoint
CREATE TABLE "editor_entity_scopes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_role_id" uuid NOT NULL,
	"sport_id" uuid,
	"league_id" uuid,
	"team_id" uuid,
	"assigned_by_user_id" uuid NOT NULL,
	"approved_by_user_id" uuid NOT NULL,
	"assignment_reason" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "editor_entity_scopes_exactly_one_entity_check" CHECK (num_nonnulls(
"editor_entity_scopes"."sport_id",
"editor_entity_scopes"."league_id",
"editor_entity_scopes"."team_id"
) = 1),
	CONSTRAINT "editor_entity_scopes_assigner_approver_different_check" CHECK ("editor_entity_scopes"."assigned_by_user_id" <> "editor_entity_scopes"."approved_by_user_id")
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"sport_id" uuid,
	"league_id" uuid,
	"team_id" uuid,
	"athlete_id" uuid,
	"notifications_enabled" boolean DEFAULT true NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_exactly_one_target_check" CHECK (num_nonnulls(
"favorites"."sport_id",
"favorites"."league_id",
"favorites"."team_id",
"favorites"."athlete_id"
) = 1)
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"home_team_id" uuid NOT NULL,
	"away_team_id" uuid NOT NULL,
	"scheduled_start_at" timestamp with time zone NOT NULL,
	"status" "game_status" DEFAULT 'scheduled' NOT NULL,
	"venue" varchar(250),
	"broadcast_details" text,
	"cover_image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "games_league_id_home_team_id_away_team_id_scheduled_start_at_unique" UNIQUE("league_id","home_team_id","away_team_id","scheduled_start_at"),
	CONSTRAINT "games_home_away_different_check" CHECK ("games"."home_team_id" <> "games"."away_team_id")
);
--> statement-breakpoint
CREATE TABLE "leagues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sport_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"season_label" varchar(50) NOT NULL,
	"region" varchar(150),
	"logo_url" text NOT NULL,
	"description" text,
	"status" "league_status" DEFAULT 'upcoming' NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leagues_sport_id_name_season_label_unique" UNIQUE("sport_id","name","season_label")
);
--> statement-breakpoint
CREATE TABLE "league_teams" (
	"league_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"left_at" timestamp with time zone,
	CONSTRAINT "league_teams_league_id_team_id_pk" PRIMARY KEY("league_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid NOT NULL,
	"sender_user_id" uuid NOT NULL,
	"message_text" text NOT NULL,
	"status" "message_status" DEFAULT 'active' NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "messages_soft_deleted_requires_deleted_at_check" CHECK ("messages"."status" <> 'soft_deleted' OR "messages"."deleted_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "moderation_escalations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"escalated_by_user_id" uuid NOT NULL,
	"assigned_to_user_id" uuid,
	"reason" text NOT NULL,
	"status" "escalation_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	"resolved_by_user_id" uuid,
	CONSTRAINT "moderation_escalations_resolved_requires_resolved_at_check" CHECK ("moderation_escalations"."status" <> 'resolved' OR "moderation_escalations"."resolved_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "moderator_community_scopes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_role_id" uuid NOT NULL,
	"community_id" uuid NOT NULL,
	"assigned_by_user_id" uuid NOT NULL,
	"approved_by_user_id" uuid NOT NULL,
	"assignment_reason" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "moderator_scopes_assigner_approver_different_check" CHECK ("moderator_community_scopes"."assigned_by_user_id" <> "moderator_community_scopes"."approved_by_user_id")
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"push_enabled" boolean DEFAULT false NOT NULL,
	"game_reminders_enabled" boolean DEFAULT true NOT NULL,
	"game_start_enabled" boolean DEFAULT true NOT NULL,
	"final_scores_enabled" boolean DEFAULT true NOT NULL,
	"schedule_changes_enabled" boolean DEFAULT true NOT NULL,
	"breaking_news_enabled" boolean DEFAULT true NOT NULL,
	"comment_replies_enabled" boolean DEFAULT true NOT NULL,
	"community_activity_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"deep_link_route" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "policy_acceptances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"policy_version_id" uuid NOT NULL,
	"acceptance_source" varchar(50) NOT NULL,
	"application_version" varchar(50),
	"security_evidence" jsonb,
	"accepted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "policy_acceptances_user_id_policy_version_id_unique" UNIQUE("user_id","policy_version_id")
);
--> statement-breakpoint
CREATE TABLE "policy_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"policy_type" "policy_type" NOT NULL,
	"version" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"document_url" text NOT NULL,
	"content_hash" varchar(64) NOT NULL,
	"status" "policy_status" DEFAULT 'draft' NOT NULL,
	"requires_acceptance" boolean DEFAULT true NOT NULL,
	"created_by_user_id" uuid,
	"published_at" timestamp with time zone,
	"effective_at" timestamp with time zone,
	"superseded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "policy_versions_policy_type_version_unique" UNIQUE("policy_type","version"),
	CONSTRAINT "policy_versions_content_hash_length_check" CHECK (length("policy_versions"."content_hash") = 64),
	CONSTRAINT "policy_versions_published_requires_dates_check" CHECK ("policy_versions"."status" <> 'published' OR ("policy_versions"."published_at" IS NOT NULL AND "policy_versions"."effective_at" IS NOT NULL)),
	CONSTRAINT "policy_versions_superseded_requires_date_check" CHECK ("policy_versions"."status" <> 'superseded' OR "policy_versions"."superseded_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "post_athletes" (
	"post_id" uuid NOT NULL,
	"athlete_id" uuid NOT NULL,
	CONSTRAINT "post_athletes_post_id_athlete_id_pk" PRIMARY KEY("post_id","athlete_id")
);
--> statement-breakpoint
CREATE TABLE "post_communities" (
	"post_id" uuid NOT NULL,
	"community_id" uuid NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"pinned_at" timestamp with time zone,
	"pinned_by_user_id" uuid,
	CONSTRAINT "post_communities_post_id_community_id_pk" PRIMARY KEY("post_id","community_id"),
	CONSTRAINT "post_communities_pinned_requires_pinned_at_check" CHECK ("post_communities"."is_pinned" = false OR "post_communities"."pinned_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "post_games" (
	"post_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	CONSTRAINT "post_games_post_id_game_id_pk" PRIMARY KEY("post_id","game_id")
);
--> statement-breakpoint
CREATE TABLE "post_leagues" (
	"post_id" uuid NOT NULL,
	"league_id" uuid NOT NULL,
	CONSTRAINT "post_leagues_post_id_league_id_pk" PRIMARY KEY("post_id","league_id")
);
--> statement-breakpoint
CREATE TABLE "post_likes" (
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_likes_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_user_id" uuid NOT NULL,
	"content_type" "post_content_type" DEFAULT 'post' NOT NULL,
	"title" varchar(250),
	"excerpt" text,
	"content" text NOT NULL,
	"cover_media_url" text,
	"cover_media_type" "media_type",
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"hidden_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"scheduled_for" timestamp with time zone,
	"scheduled_by_user_id" uuid,
	"search_vector" "tsvector" GENERATED ALWAYS AS (
      setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
      setweight(to_tsvector('simple', coalesce("excerpt", '')), 'B') ||
      setweight(to_tsvector('simple', coalesce("content", '')), 'C')
    ) STORED,
	CONSTRAINT "posts_article_requires_title_check" CHECK ("posts"."content_type" <> 'article' OR ("posts"."title" IS NOT NULL AND length(trim("posts"."title")) > 0)),
	CONSTRAINT "posts_cover_media_pair_check" CHECK ((
("posts"."cover_media_url" IS NULL AND "posts"."cover_media_type" IS NULL)
OR
("posts"."cover_media_url" IS NOT NULL AND "posts"."cover_media_type" IS NOT NULL)
)),
	CONSTRAINT "posts_scheduled_requires_schedule_data_check" CHECK ("posts"."status" <> 'scheduled' OR ("posts"."scheduled_for" IS NOT NULL AND "posts"."scheduled_by_user_id" IS NOT NULL)),
	CONSTRAINT "posts_scheduled_for_requires_scheduler_check" CHECK ("posts"."scheduled_for" IS NULL OR "posts"."scheduled_by_user_id" IS NOT NULL),
	CONSTRAINT "posts_published_requires_published_at_check" CHECK ("posts"."status" <> 'published' OR "posts"."published_at" IS NOT NULL),
	CONSTRAINT "posts_scheduled_for_after_created_at_check" CHECK ("posts"."status" <> 'scheduled' OR "posts"."scheduled_for" > "posts"."created_at")
);
--> statement-breakpoint
CREATE TABLE "post_sports" (
	"post_id" uuid NOT NULL,
	"sport_id" uuid NOT NULL,
	CONSTRAINT "post_sports_post_id_sport_id_pk" PRIMARY KEY("post_id","sport_id")
);
--> statement-breakpoint
CREATE TABLE "post_teams" (
	"post_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	CONSTRAINT "post_teams_post_id_team_id_pk" PRIMARY KEY("post_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "push_devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" "push_provider" NOT NULL,
	"platform" "mobile_platform" NOT NULL,
	"device_token" text NOT NULL,
	"device_label" varchar(150),
	"is_active" boolean DEFAULT true NOT NULL,
	"last_seen_at" timestamp with time zone,
	"disabled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "push_devices_provider_device_token_unique" UNIQUE("provider","device_token")
);
--> statement-breakpoint
CREATE TABLE "report_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"action" "report_action_type" NOT NULL,
	"previous_status" "report_status",
	"new_status" "report_status" NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_user_id" uuid NOT NULL,
	"reported_entity_type" "report_entity_type" NOT NULL,
	"reported_user_id" uuid,
	"reported_post_id" uuid,
	"reported_comment_id" uuid,
	"reported_message_id" uuid,
	"reason" text NOT NULL,
	"status" "report_status" DEFAULT 'pending' NOT NULL,
	"moderation_notes" text,
	"resolved_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	CONSTRAINT "reports_exactly_one_target_check" CHECK (num_nonnulls(
"reports"."reported_user_id",
"reports"."reported_post_id",
"reports"."reported_comment_id",
"reports"."reported_message_id"
) = 1),
	CONSTRAINT "reports_entity_type_matches_target_check" CHECK ((
("reports"."reported_entity_type" = 'user' AND "reports"."reported_user_id" IS NOT NULL)
OR
("reports"."reported_entity_type" = 'post' AND "reports"."reported_post_id" IS NOT NULL)
OR
("reports"."reported_entity_type" = 'comment' AND "reports"."reported_comment_id" IS NOT NULL)
OR
("reports"."reported_entity_type" = 'message' AND "reports"."reported_message_id" IS NOT NULL)
)),
	CONSTRAINT "reports_resolved_requires_resolution_data_check" CHECK ("reports"."status" NOT IN ('resolved','dismissed') OR ("reports"."resolved_by_user_id" IS NOT NULL AND "reports"."resolved_at" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"home_score" integer DEFAULT 0 NOT NULL,
	"away_score" integer DEFAULT 0 NOT NULL,
	"period_breakdown" jsonb,
	"winning_team_id" uuid,
	"result_type" "score_result_type",
	"status" "score_status" DEFAULT 'pending' NOT NULL,
	"last_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scores_game_id_unique" UNIQUE("game_id"),
	CONSTRAINT "scores_home_score_non_negative_check" CHECK ("scores"."home_score" >= 0),
	CONSTRAINT "scores_away_score_non_negative_check" CHECK ("scores"."away_score" >= 0),
	CONSTRAINT "scores_final_requires_result_type_check" CHECK ("scores"."status" <> 'final' OR "scores"."result_type" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "sports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" "citext" NOT NULL,
	"description" text,
	"icon_url" text NOT NULL,
	"banner_url" text,
	"status" "sport_status" DEFAULT 'draft' NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sports_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"official_name" varchar(200) NOT NULL,
	"short_name" varchar(50),
	"city" varchar(150) NOT NULL,
	"home_venue" varchar(200),
	"logo_url" text NOT NULL,
	"status" "team_status" DEFAULT 'active' NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_blocks" (
	"blocker_user_id" uuid NOT NULL,
	"blocked_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_blocks_blocker_user_id_blocked_user_id_pk" PRIMARY KEY("blocker_user_id","blocked_user_id"),
	CONSTRAINT "user_blocks_no_self_block_check" CHECK ("user_blocks"."blocker_user_id" <> "user_blocks"."blocked_user_id")
);
--> statement-breakpoint
CREATE TABLE "user_mutes" (
	"user_id" uuid NOT NULL,
	"muted_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_mutes_user_id_muted_user_id_pk" PRIMARY KEY("user_id","muted_user_id"),
	CONSTRAINT "user_mutes_no_self_mute_check" CHECK ("user_mutes"."user_id" <> "user_mutes"."muted_user_id")
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"preferred_language" varchar(10) DEFAULT 'es-PR' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "platform_role" NOT NULL,
	"assigned_by_user_id" uuid,
	"approved_by_user_id" uuid,
	"assignment_reason" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_by_user_id" uuid,
	"revoked_at" timestamp with time zone,
	"revocation_reason" text,
	CONSTRAINT "user_roles_assigned_by_not_self_check" CHECK ("user_roles"."assigned_by_user_id" IS NULL OR "user_roles"."assigned_by_user_id" <> "user_roles"."user_id"),
	CONSTRAINT "user_roles_approved_by_not_self_check" CHECK ("user_roles"."approved_by_user_id" IS NULL OR "user_roles"."approved_by_user_id" <> "user_roles"."user_id"),
	CONSTRAINT "user_roles_approved_by_not_assigner_check" CHECK ("user_roles"."approved_by_user_id" IS NULL OR "user_roles"."assigned_by_user_id" IS NULL OR "user_roles"."approved_by_user_id" <> "user_roles"."assigned_by_user_id"),
	CONSTRAINT "user_roles_revoked_requires_reason_check" CHECK ("user_roles"."revoked_at" IS NULL OR "user_roles"."revocation_reason" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(255),
	"email" "citext",
	"username" "citext",
	"first_name" varchar(100),
	"last_name" varchar(100),
	"profile_photo_url" text,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"suspended_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"onboarding_completed_at" timestamp with time zone,
	CONSTRAINT "users_identity_required_unless_soft_deleted_check" CHECK (
"users"."status" = 'soft_deleted'
OR (
"users"."clerk_id" IS NOT NULL
AND "users"."email" IS NOT NULL
AND "users"."username" IS NOT NULL
AND "users"."first_name" IS NOT NULL
AND "users"."last_name" IS NOT NULL
)
)
);
--> statement-breakpoint
CREATE TABLE "user_warnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"community_id" uuid,
	"issued_by_user_id" uuid NOT NULL,
	"report_id" uuid,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_by_user_id" uuid
);
--> statement-breakpoint
ALTER TABLE "account_deletion_requests" ADD CONSTRAINT "account_deletion_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_deletion_requests" ADD CONSTRAINT "account_deletion_requests_processed_by_user_id_users_id_fk" FOREIGN KEY ("processed_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_current_team_id_teams_id_fk" FOREIGN KEY ("current_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_id_post_id_comments_id_post_id_fk" FOREIGN KEY ("parent_comment_id","post_id") REFERENCES "public"."comments"("id","post_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_linked_sport_id_sports_id_fk" FOREIGN KEY ("linked_sport_id") REFERENCES "public"."sports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_linked_league_id_leagues_id_fk" FOREIGN KEY ("linked_league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_linked_team_id_teams_id_fk" FOREIGN KEY ("linked_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_memberships" ADD CONSTRAINT "community_memberships_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_memberships" ADD CONSTRAINT "community_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_verifications" ADD CONSTRAINT "data_verifications_source_id_data_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."data_sources"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_verifications" ADD CONSTRAINT "data_verifications_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_verifications" ADD CONSTRAINT "data_verifications_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_verifications" ADD CONSTRAINT "data_verifications_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_verifications" ADD CONSTRAINT "data_verifications_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_verifications" ADD CONSTRAINT "data_verifications_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_verifications" ADD CONSTRAINT "data_verifications_score_id_scores_id_fk" FOREIGN KEY ("score_id") REFERENCES "public"."scores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_verifications" ADD CONSTRAINT "data_verifications_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_verifications" ADD CONSTRAINT "data_verifications_verified_by_user_id_users_id_fk" FOREIGN KEY ("verified_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_entity_scopes" ADD CONSTRAINT "editor_entity_scopes_user_role_id_user_roles_id_fk" FOREIGN KEY ("user_role_id") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_entity_scopes" ADD CONSTRAINT "editor_entity_scopes_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_entity_scopes" ADD CONSTRAINT "editor_entity_scopes_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_entity_scopes" ADD CONSTRAINT "editor_entity_scopes_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_entity_scopes" ADD CONSTRAINT "editor_entity_scopes_assigned_by_user_id_users_id_fk" FOREIGN KEY ("assigned_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_entity_scopes" ADD CONSTRAINT "editor_entity_scopes_approved_by_user_id_users_id_fk" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_home_team_id_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_away_team_id_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_league_id_home_team_id_league_teams_league_id_team_id_fk" FOREIGN KEY ("league_id","home_team_id") REFERENCES "public"."league_teams"("league_id","team_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_league_id_away_team_id_league_teams_league_id_team_id_fk" FOREIGN KEY ("league_id","away_team_id") REFERENCES "public"."league_teams"("league_id","team_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_teams" ADD CONSTRAINT "league_teams_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league_teams" ADD CONSTRAINT "league_teams_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_user_id_users_id_fk" FOREIGN KEY ("sender_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_community_id_sender_user_id_community_memberships_community_id_user_id_fk" FOREIGN KEY ("community_id","sender_user_id") REFERENCES "public"."community_memberships"("community_id","user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_escalations" ADD CONSTRAINT "moderation_escalations_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_escalations" ADD CONSTRAINT "moderation_escalations_escalated_by_user_id_users_id_fk" FOREIGN KEY ("escalated_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_escalations" ADD CONSTRAINT "moderation_escalations_assigned_to_user_id_users_id_fk" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_escalations" ADD CONSTRAINT "moderation_escalations_resolved_by_user_id_users_id_fk" FOREIGN KEY ("resolved_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderator_community_scopes" ADD CONSTRAINT "moderator_community_scopes_user_role_id_user_roles_id_fk" FOREIGN KEY ("user_role_id") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderator_community_scopes" ADD CONSTRAINT "moderator_community_scopes_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderator_community_scopes" ADD CONSTRAINT "moderator_community_scopes_assigned_by_user_id_users_id_fk" FOREIGN KEY ("assigned_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderator_community_scopes" ADD CONSTRAINT "moderator_community_scopes_approved_by_user_id_users_id_fk" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policy_acceptances" ADD CONSTRAINT "policy_acceptances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policy_acceptances" ADD CONSTRAINT "policy_acceptances_policy_version_id_policy_versions_id_fk" FOREIGN KEY ("policy_version_id") REFERENCES "public"."policy_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policy_versions" ADD CONSTRAINT "policy_versions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_athletes" ADD CONSTRAINT "post_athletes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_athletes" ADD CONSTRAINT "post_athletes_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_communities" ADD CONSTRAINT "post_communities_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_communities" ADD CONSTRAINT "post_communities_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_communities" ADD CONSTRAINT "post_communities_pinned_by_user_id_users_id_fk" FOREIGN KEY ("pinned_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_games" ADD CONSTRAINT "post_games_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_games" ADD CONSTRAINT "post_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_leagues" ADD CONSTRAINT "post_leagues_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_leagues" ADD CONSTRAINT "post_leagues_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_scheduled_by_user_id_users_id_fk" FOREIGN KEY ("scheduled_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_sports" ADD CONSTRAINT "post_sports_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_sports" ADD CONSTRAINT "post_sports_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_teams" ADD CONSTRAINT "post_teams_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_teams" ADD CONSTRAINT "post_teams_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_devices" ADD CONSTRAINT "push_devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_actions" ADD CONSTRAINT "report_actions_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_actions" ADD CONSTRAINT "report_actions_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_user_id_users_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_user_id_users_id_fk" FOREIGN KEY ("reported_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_post_id_posts_id_fk" FOREIGN KEY ("reported_post_id") REFERENCES "public"."posts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_comment_id_comments_id_fk" FOREIGN KEY ("reported_comment_id") REFERENCES "public"."comments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_message_id_messages_id_fk" FOREIGN KEY ("reported_message_id") REFERENCES "public"."messages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_user_id_users_id_fk" FOREIGN KEY ("resolved_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_winning_team_id_teams_id_fk" FOREIGN KEY ("winning_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocker_user_id_users_id_fk" FOREIGN KEY ("blocker_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocked_user_id_users_id_fk" FOREIGN KEY ("blocked_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mutes" ADD CONSTRAINT "user_mutes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mutes" ADD CONSTRAINT "user_mutes_muted_user_id_users_id_fk" FOREIGN KEY ("muted_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assigned_by_user_id_users_id_fk" FOREIGN KEY ("assigned_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_approved_by_user_id_users_id_fk" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_revoked_by_user_id_users_id_fk" FOREIGN KEY ("revoked_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_warnings" ADD CONSTRAINT "user_warnings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_warnings" ADD CONSTRAINT "user_warnings_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_warnings" ADD CONSTRAINT "user_warnings_issued_by_user_id_users_id_fk" FOREIGN KEY ("issued_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_warnings" ADD CONSTRAINT "user_warnings_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_warnings" ADD CONSTRAINT "user_warnings_revoked_by_user_id_users_id_fk" FOREIGN KEY ("revoked_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "account_deletion_requests_active_user_unique_idx" ON "account_deletion_requests" USING btree ("user_id") WHERE "account_deletion_requests"."status" IN ('pending_verification','verified','scheduled');--> statement-breakpoint
CREATE INDEX "account_deletion_requests_user_id_idx" ON "account_deletion_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_deletion_requests_processed_by_user_id_idx" ON "account_deletion_requests" USING btree ("processed_by_user_id");--> statement-breakpoint
CREATE INDEX "athletes_current_team_id_idx" ON "athletes" USING btree ("current_team_id");--> statement-breakpoint
CREATE INDEX "audit_events_actor_occurred_idx" ON "audit_events" USING btree ("actor_user_id","occurred_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "audit_events_target_occurred_idx" ON "audit_events" USING btree ("target_type","target_id","occurred_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "comments_post_created_idx" ON "comments" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "comments_parent_created_idx" ON "comments" USING btree ("parent_comment_id","created_at");--> statement-breakpoint
CREATE INDEX "comments_author_user_idx" ON "comments" USING btree ("author_user_id");--> statement-breakpoint
CREATE INDEX "comments_active_post_idx" ON "comments" USING btree ("post_id","created_at") WHERE "comments"."status" = 'active' AND "comments"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "communities_linked_sport_id_idx" ON "communities" USING btree ("linked_sport_id");--> statement-breakpoint
CREATE INDEX "communities_linked_league_id_idx" ON "communities" USING btree ("linked_league_id");--> statement-breakpoint
CREATE INDEX "communities_linked_team_id_idx" ON "communities" USING btree ("linked_team_id");--> statement-breakpoint
CREATE INDEX "communities_search_vector_gin_idx" ON "communities" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "community_memberships_user_status_idx" ON "community_memberships" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "data_sources_approved_name_idx" ON "data_sources" USING btree ("is_approved","name");--> statement-breakpoint
CREATE INDEX "data_verifications_source_verified_idx" ON "data_verifications" USING btree ("source_id","verified_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "data_verifications_user_verified_idx" ON "data_verifications" USING btree ("verified_by_user_id","verified_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "data_verifications_sport_idx" ON "data_verifications" USING btree ("sport_id") WHERE "data_verifications"."sport_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "data_verifications_league_idx" ON "data_verifications" USING btree ("league_id") WHERE "data_verifications"."league_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "data_verifications_team_idx" ON "data_verifications" USING btree ("team_id") WHERE "data_verifications"."team_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "data_verifications_athlete_idx" ON "data_verifications" USING btree ("athlete_id") WHERE "data_verifications"."athlete_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "data_verifications_game_idx" ON "data_verifications" USING btree ("game_id") WHERE "data_verifications"."game_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "data_verifications_score_idx" ON "data_verifications" USING btree ("score_id") WHERE "data_verifications"."score_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "data_verifications_post_idx" ON "data_verifications" USING btree ("post_id") WHERE "data_verifications"."post_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "editor_entity_scopes_active_sport_unique_idx" ON "editor_entity_scopes" USING btree ("user_role_id","sport_id") WHERE "editor_entity_scopes"."sport_id" IS NOT NULL AND "editor_entity_scopes"."revoked_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "editor_entity_scopes_active_league_unique_idx" ON "editor_entity_scopes" USING btree ("user_role_id","league_id") WHERE "editor_entity_scopes"."league_id" IS NOT NULL AND "editor_entity_scopes"."revoked_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "editor_entity_scopes_active_team_unique_idx" ON "editor_entity_scopes" USING btree ("user_role_id","team_id") WHERE "editor_entity_scopes"."team_id" IS NOT NULL AND "editor_entity_scopes"."revoked_at" IS NULL;--> statement-breakpoint
CREATE INDEX "editor_entity_scopes_user_role_id_idx" ON "editor_entity_scopes" USING btree ("user_role_id");--> statement-breakpoint
CREATE INDEX "editor_entity_scopes_sport_id_idx" ON "editor_entity_scopes" USING btree ("sport_id");--> statement-breakpoint
CREATE INDEX "editor_entity_scopes_league_id_idx" ON "editor_entity_scopes" USING btree ("league_id");--> statement-breakpoint
CREATE INDEX "editor_entity_scopes_team_id_idx" ON "editor_entity_scopes" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "editor_entity_scopes_assigned_by_user_id_idx" ON "editor_entity_scopes" USING btree ("assigned_by_user_id");--> statement-breakpoint
CREATE INDEX "editor_entity_scopes_approved_by_user_id_idx" ON "editor_entity_scopes" USING btree ("approved_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_sport_unique_idx" ON "favorites" USING btree ("user_id","sport_id") WHERE "favorites"."sport_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_league_unique_idx" ON "favorites" USING btree ("user_id","league_id") WHERE "favorites"."league_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_team_unique_idx" ON "favorites" USING btree ("user_id","team_id") WHERE "favorites"."team_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_athlete_unique_idx" ON "favorites" USING btree ("user_id","athlete_id") WHERE "favorites"."athlete_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "favorites_user_id_idx" ON "favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "favorites_sport_id_idx" ON "favorites" USING btree ("sport_id") WHERE "favorites"."sport_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "favorites_league_id_idx" ON "favorites" USING btree ("league_id") WHERE "favorites"."league_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "favorites_team_id_idx" ON "favorites" USING btree ("team_id") WHERE "favorites"."team_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "favorites_athlete_id_idx" ON "favorites" USING btree ("athlete_id") WHERE "favorites"."athlete_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "games_league_id_idx" ON "games" USING btree ("league_id");--> statement-breakpoint
CREATE INDEX "games_home_team_id_idx" ON "games" USING btree ("home_team_id");--> statement-breakpoint
CREATE INDEX "games_away_team_id_idx" ON "games" USING btree ("away_team_id");--> statement-breakpoint
CREATE INDEX "games_status_scheduled_start_at_idx" ON "games" USING btree ("status","scheduled_start_at");--> statement-breakpoint
CREATE INDEX "games_league_scheduled_start_at_idx" ON "games" USING btree ("league_id","scheduled_start_at");--> statement-breakpoint
CREATE INDEX "leagues_sport_id_idx" ON "leagues" USING btree ("sport_id");--> statement-breakpoint
CREATE INDEX "league_teams_team_id_idx" ON "league_teams" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "messages_community_sent_at_idx" ON "messages" USING btree ("community_id","sent_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "messages_sender_user_id_idx" ON "messages" USING btree ("sender_user_id");--> statement-breakpoint
CREATE INDEX "messages_membership_fk_idx" ON "messages" USING btree ("community_id","sender_user_id");--> statement-breakpoint
CREATE INDEX "messages_active_community_idx" ON "messages" USING btree ("community_id","sent_at" DESC NULLS LAST) WHERE "messages"."status" = 'active' AND "messages"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "moderation_escalations_status_created_idx" ON "moderation_escalations" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "moderation_escalations_report_idx" ON "moderation_escalations" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "moderation_escalations_escalated_by_user_idx" ON "moderation_escalations" USING btree ("escalated_by_user_id");--> statement-breakpoint
CREATE INDEX "moderation_escalations_assigned_to_user_idx" ON "moderation_escalations" USING btree ("assigned_to_user_id");--> statement-breakpoint
CREATE INDEX "moderation_escalations_resolved_by_user_idx" ON "moderation_escalations" USING btree ("resolved_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "moderator_community_scopes_active_unique_idx" ON "moderator_community_scopes" USING btree ("user_role_id","community_id") WHERE "moderator_community_scopes"."revoked_at" IS NULL;--> statement-breakpoint
CREATE INDEX "moderator_community_scopes_user_role_id_idx" ON "moderator_community_scopes" USING btree ("user_role_id");--> statement-breakpoint
CREATE INDEX "moderator_community_scopes_community_id_idx" ON "moderator_community_scopes" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "moderator_community_scopes_assigned_by_user_id_idx" ON "moderator_community_scopes" USING btree ("assigned_by_user_id");--> statement-breakpoint
CREATE INDEX "moderator_community_scopes_approved_by_user_id_idx" ON "moderator_community_scopes" USING btree ("approved_by_user_id");--> statement-breakpoint
CREATE INDEX "notifications_user_read_created_idx" ON "notifications" USING btree ("user_id","is_read","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "notifications_unread_idx" ON "notifications" USING btree ("user_id","created_at" DESC NULLS LAST) WHERE "notifications"."is_read" = false;--> statement-breakpoint
CREATE INDEX "policy_acceptances_user_accepted_idx" ON "policy_acceptances" USING btree ("user_id","accepted_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "policy_acceptances_policy_version_accepted_idx" ON "policy_acceptances" USING btree ("policy_version_id","accepted_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "policy_versions_current_required_unique_idx" ON "policy_versions" USING btree ("policy_type") WHERE "policy_versions"."status" = 'published' AND "policy_versions"."requires_acceptance" = true AND "policy_versions"."superseded_at" IS NULL;--> statement-breakpoint
CREATE INDEX "policy_versions_type_status_effective_idx" ON "policy_versions" USING btree ("policy_type","status","effective_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "policy_versions_created_by_user_idx" ON "policy_versions" USING btree ("created_by_user_id") WHERE "policy_versions"."created_by_user_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "post_athletes_athlete_id_idx" ON "post_athletes" USING btree ("athlete_id");--> statement-breakpoint
CREATE INDEX "post_communities_community_pinned_idx" ON "post_communities" USING btree ("community_id","is_pinned","pinned_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "community_pinned_posts_idx" ON "post_communities" USING btree ("community_id","pinned_at" DESC NULLS LAST) WHERE "post_communities"."is_pinned" = true;--> statement-breakpoint
CREATE INDEX "post_communities_pinned_by_user_id_idx" ON "post_communities" USING btree ("pinned_by_user_id");--> statement-breakpoint
CREATE INDEX "post_games_game_id_idx" ON "post_games" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX "post_leagues_league_id_idx" ON "post_leagues" USING btree ("league_id");--> statement-breakpoint
CREATE INDEX "post_likes_user_created_idx" ON "post_likes" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "post_likes_post_id_idx" ON "post_likes" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "posts_author_user_idx" ON "posts" USING btree ("author_user_id");--> statement-breakpoint
CREATE INDEX "posts_scheduled_by_user_idx" ON "posts" USING btree ("scheduled_by_user_id");--> statement-breakpoint
CREATE INDEX "posts_status_scheduled_for_idx" ON "posts" USING btree ("status","scheduled_for");--> statement-breakpoint
CREATE INDEX "posts_content_type_status_published_idx" ON "posts" USING btree ("content_type","status","published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "posts_status_published_at_idx" ON "posts" USING btree ("status","published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "posts_published_feed_idx" ON "posts" USING btree ("published_at" DESC NULLS LAST) WHERE "posts"."status" = 'published' AND "posts"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "posts_search_vector_gin_idx" ON "posts" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "post_sports_sport_id_idx" ON "post_sports" USING btree ("sport_id");--> statement-breakpoint
CREATE INDEX "post_teams_team_id_idx" ON "post_teams" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "push_devices_user_active_idx" ON "push_devices" USING btree ("user_id","is_active");--> statement-breakpoint
CREATE INDEX "report_actions_report_created_idx" ON "report_actions" USING btree ("report_id","created_at");--> statement-breakpoint
CREATE INDEX "report_actions_actor_user_idx" ON "report_actions" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "reports_status_created_idx" ON "reports" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "reports_reporter_user_idx" ON "reports" USING btree ("reporter_user_id");--> statement-breakpoint
CREATE INDEX "reports_reported_user_idx" ON "reports" USING btree ("reported_user_id");--> statement-breakpoint
CREATE INDEX "reports_reported_post_idx" ON "reports" USING btree ("reported_post_id");--> statement-breakpoint
CREATE INDEX "reports_reported_comment_idx" ON "reports" USING btree ("reported_comment_id");--> statement-breakpoint
CREATE INDEX "reports_reported_message_idx" ON "reports" USING btree ("reported_message_id");--> statement-breakpoint
CREATE INDEX "reports_resolved_by_user_idx" ON "reports" USING btree ("resolved_by_user_id");--> statement-breakpoint
CREATE INDEX "reports_open_queue_idx" ON "reports" USING btree ("created_at") WHERE "reports"."status" IN ('pending','in_review');--> statement-breakpoint
CREATE INDEX "scores_winning_team_id_idx" ON "scores" USING btree ("winning_team_id");--> statement-breakpoint
CREATE INDEX "user_blocks_blocked_user_idx" ON "user_blocks" USING btree ("blocked_user_id");--> statement-breakpoint
CREATE INDEX "user_mutes_muted_user_idx" ON "user_mutes" USING btree ("muted_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_active_user_unique_idx" ON "user_roles" USING btree ("user_id") WHERE "user_roles"."revoked_at" IS NULL;--> statement-breakpoint
CREATE INDEX "user_roles_role_user_idx" ON "user_roles" USING btree ("role","user_id");--> statement-breakpoint
CREATE INDEX "user_roles_user_id_idx" ON "user_roles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_roles_assigned_by_user_id_idx" ON "user_roles" USING btree ("assigned_by_user_id");--> statement-breakpoint
CREATE INDEX "user_roles_approved_by_user_id_idx" ON "user_roles" USING btree ("approved_by_user_id");--> statement-breakpoint
CREATE INDEX "user_roles_revoked_by_user_id_idx" ON "user_roles" USING btree ("revoked_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_clerk_id_unique_idx" ON "users" USING btree ("clerk_id") WHERE "users"."clerk_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique_idx" ON "users" USING btree ("email") WHERE "users"."email" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_unique_idx" ON "users" USING btree ("username") WHERE "users"."username" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "user_warnings_user_created_idx" ON "user_warnings" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "user_warnings_community_id_idx" ON "user_warnings" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "user_warnings_issued_by_user_id_idx" ON "user_warnings" USING btree ("issued_by_user_id");--> statement-breakpoint
CREATE INDEX "user_warnings_report_id_idx" ON "user_warnings" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "user_warnings_revoked_by_user_id_idx" ON "user_warnings" USING btree ("revoked_by_user_id");