import { uuid, text, timestamp, pgTable, check, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { posts } from './posts';
import { comments } from './comments';
import { messages } from './messages';
import { reportEntityTypeEnum, reportStatusEnum } from './enums';

export const reports = pgTable(
  'reports',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    reporterUserId: uuid('reporter_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    reportedEntityType: reportEntityTypeEnum('reported_entity_type').notNull(),
    reportedUserId: uuid('reported_user_id').references(() => users.id, { onDelete: 'restrict' }),
    reportedPostId: uuid('reported_post_id').references(() => posts.id, { onDelete: 'restrict' }),
    reportedCommentId: uuid('reported_comment_id').references(() => comments.id, {
      onDelete: 'restrict',
    }),
    reportedMessageId: uuid('reported_message_id').references(() => messages.id, {
      onDelete: 'restrict',
    }),
    reason: text('reason').notNull(),
    status: reportStatusEnum('status').default('pending').notNull(),
    moderationNotes: text('moderation_notes'),
    resolvedByUserId: uuid('resolved_by_user_id').references(() => users.id, {
      onDelete: 'restrict',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  },
  (reports) => [
    check(
      'reports_exactly_one_target_check',
      sql`num_nonnulls(
${reports.reportedUserId},
${reports.reportedPostId},
${reports.reportedCommentId},
${reports.reportedMessageId}
) = 1`,
    ),

    check(
      'reports_entity_type_matches_target_check',
      sql`(
(${reports.reportedEntityType} = 'user' AND ${reports.reportedUserId} IS NOT NULL)
OR
(${reports.reportedEntityType} = 'post' AND ${reports.reportedPostId} IS NOT NULL)
OR
(${reports.reportedEntityType} = 'comment' AND ${reports.reportedCommentId} IS NOT NULL)
OR
(${reports.reportedEntityType} = 'message' AND ${reports.reportedMessageId} IS NOT NULL)
)`,
    ),

    check(
      'reports_resolved_requires_resolution_data_check',
      sql`${reports.status} NOT IN ('resolved','dismissed') OR (${reports.resolvedByUserId} IS NOT NULL AND ${reports.resolvedAt} IS NOT NULL)`,
    ),

    index('reports_status_created_idx').on(reports.status, reports.createdAt),

    index('reports_reporter_user_idx').on(reports.reporterUserId),

    index('reports_reported_user_idx').on(reports.reportedUserId),

    index('reports_reported_post_idx').on(reports.reportedPostId),

    index('reports_reported_comment_idx').on(reports.reportedCommentId),

    index('reports_reported_message_idx').on(reports.reportedMessageId),

    index('reports_resolved_by_user_idx').on(reports.resolvedByUserId),

    index('reports_open_queue_idx')
      .on(reports.createdAt)
      .where(sql`${reports.status} IN ('pending','in_review')`),
  ],
);
