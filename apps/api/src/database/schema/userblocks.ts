import { uuid, timestamp, pgTable, primaryKey, check, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const userBlocks = pgTable(
  'user_blocks',
  {
    blockerUserId: uuid('blocker_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    blockedUserId: uuid('blocked_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (userBlocks) => [
    primaryKey({
      columns: [userBlocks.blockerUserId, userBlocks.blockedUserId],
    }),

    check(
      'user_blocks_no_self_block_check',
      sql`${userBlocks.blockerUserId} <> ${userBlocks.blockedUserId}`,
    ),

    index('user_blocks_blocked_user_idx').on(userBlocks.blockedUserId),
  ],
);
