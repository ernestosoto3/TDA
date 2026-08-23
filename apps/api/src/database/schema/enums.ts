import { pgEnum } from 'drizzle-orm/pg-core';

export const userStatusEnum = pgEnum('user_status', ['active', 'suspended', 'soft_deleted']);

export const platformRoleEnum = pgEnum('platform_role', ['moderator', 'editor', 'administrator']);

export const sportStatusEnum = pgEnum('sport_status', ['draft', 'active', 'inactive', 'archived']);

export const leagueStatusEnum = pgEnum('league_status', [
  'upcoming',
  'ongoing',
  'finished',
  'archived',
]);

export const teamStatusEnum = pgEnum('team_status', ['active', 'inactive', 'archived']);

export const athleteStatusEnum = pgEnum('athlete_status', ['active', 'inactive', 'archived']);

export const gameStatusEnum = pgEnum('game_status', [
  'scheduled',
  'in_progress',
  'finished',
  'postponed',
  'canceled',
]);

export const scoreStatusEnum = pgEnum('score_status', ['pending', 'updated', 'final']);

export const scoreResultTypeEnum = pgEnum('score_result_type', [
  'home_win',
  'away_win',
  'draw',
  'no_contest',
]);

export const postStatusEnum = pgEnum('post_status', [
  'draft',
  'scheduled',
  'published',
  'archived',
  'hidden',
  'soft_deleted',
]);

export const postContentTypeEnum = pgEnum('post_content_type', ['post', 'article']);

export const commentStatusEnum = pgEnum('comment_status', ['active', 'hidden', 'soft_deleted']);

export const messageStatusEnum = pgEnum('message_status', ['active', 'hidden', 'soft_deleted']);

export const communityStatusEnum = pgEnum('community_status', ['active', 'restricted', 'archived']);

export const membershipRoleEnum = pgEnum('membership_role', ['member', 'moderator', 'admin']);

export const membershipStatusEnum = pgEnum('membership_status', [
  'active',
  'muted',
  'banned',
  'left',
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  'game_reminder',
  'game_start',
  'score_update',
  'final_score',
  'schedule_change',
  'breaking_news',
  'comment_reply',
  'community_activity',
  'official_announcement',
  'system',
]);

export const pushProviderEnum = pgEnum('push_provider', ['expo', 'fcm']);

export const mobilePlatformEnum = pgEnum('mobile_platform', ['ios', 'android']);

export const sourceTypeEnum = pgEnum('source_type', [
  'official_federation',
  'official_league',
  'official_team',
  'approved_provider',
  'other_verified',
]);

export const reportStatusEnum = pgEnum('report_status', [
  'pending',
  'in_review',
  'resolved',
  'dismissed',
]);

export const reportEntityTypeEnum = pgEnum('report_entity_type', [
  'post',
  'comment',
  'message',
  'user',
]);

export const mediaTypeEnum = pgEnum('media_type', ['image', 'video']);

export const deletionRequestStatusEnum = pgEnum('deletion_request_status', [
  'pending_verification',
  'verified',
  'scheduled',
  'completed',
  'cancelled',
  'rejected',
]);

export const reportActionTypeEnum = pgEnum('report_action_type', [
  'assignment',
  'review',
  'warning',
  'hide',
  'restore',
  'mute',
  'escalate',
  'resolve',
  'dismiss',
  'reopen',
]);

export const escalationStatusEnum = pgEnum('escalation_status', [
  'open',
  'reviewing',
  'resolved',
  'cancelled',
]);

export const auditResultEnum = pgEnum('audit_result', ['succeeded', 'denied', 'failed']);

export const policyTypeEnum = pgEnum('policy_type', ['terms_of_service', 'privacy_policy']);

export const policyStatusEnum = pgEnum('policy_status', [
  'draft',
  'published',
  'superseded',
  'withdrawn',
]);
