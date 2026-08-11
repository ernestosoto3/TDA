import { uuid, boolean, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { users } from './users';

export const notificationPreferences = pgTable('notification_preferences', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  pushEnabled: boolean('push_enabled').default(false).notNull(),
  gameRemindersEnabled: boolean('game_reminders_enabled').default(true).notNull(),
  gameStartEnabled: boolean('game_start_enabled').default(true).notNull(),
  finalScoresEnabled: boolean('final_scores_enabled').default(true).notNull(),
  scheduleChangesEnabled: boolean('schedule_changes_enabled').default(true).notNull(),
  breakingNewsEnabled: boolean('breaking_news_enabled').default(true).notNull(),
  commentRepliesEnabled: boolean('comment_replies_enabled').default(true).notNull(),
  communityActivityEnabled: boolean('community_activity_enabled').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
