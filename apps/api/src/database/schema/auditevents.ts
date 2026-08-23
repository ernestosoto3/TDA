import { uuid, varchar, text, jsonb, timestamp, pgTable, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { auditResultEnum } from './enums';

export const auditEvents = pgTable(
  'audit_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'restrict' }),
    action: varchar('action', { length: 150 }).notNull(),
    targetType: varchar('target_type', { length: 100 }).notNull(),
    targetId: uuid('target_id'),
    scopeType: varchar('scope_type', { length: 100 }),
    scopeId: uuid('scope_id'),
    reason: text('reason'),
    result: auditResultEnum('result').notNull(),
    metadata: jsonb('metadata').default({}).notNull(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (auditEvents) => [
    index('audit_events_actor_occurred_idx').on(
      auditEvents.actorUserId,
      auditEvents.occurredAt.desc(),
    ),

    index('audit_events_target_occurred_idx').on(
      auditEvents.targetType,
      auditEvents.targetId,
      auditEvents.occurredAt.desc(),
    ),
  ],
);
