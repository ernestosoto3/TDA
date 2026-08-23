import { uuid, text, timestamp, pgTable, index } from 'drizzle-orm/pg-core';
import { reports } from './reports';
import { users } from './users';
import { reportActionTypeEnum, reportStatusEnum } from './enums';

export const reportActions = pgTable(
  'report_actions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    reportId: uuid('report_id')
      .notNull()
      .references(() => reports.id, { onDelete: 'restrict' }),
    actorUserId: uuid('actor_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    action: reportActionTypeEnum('action').notNull(),
    previousStatus: reportStatusEnum('previous_status'),
    newStatus: reportStatusEnum('new_status').notNull(),
    reason: text('reason').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (reportActions) => [
    index('report_actions_report_created_idx').on(reportActions.reportId, reportActions.createdAt),

    index('report_actions_actor_user_idx').on(reportActions.actorUserId),
  ],
);
