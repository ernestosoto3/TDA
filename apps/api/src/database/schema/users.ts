import { uuid, varchar, text, timestamp, pgTable, check, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { userStatusEnum } from './enums';
import { citext } from './custom-types';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    clerkId: varchar('clerk_id', { length: 255 }),
    email: citext('email'),
    username: citext('username'),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    profilePhotoUrl: text('profile_photo_url'),
    status: userStatusEnum('status').default('active').notNull(),
    suspendedAt: timestamp('suspended_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    onboardingCompletedAt: timestamp('onboarding_completed_at', { withTimezone: true }),
  },
  (users) => [
    check(
      'users_identity_required_unless_soft_deleted_check',
      sql`
${users.status} = 'soft_deleted'
OR (
${users.clerkId} IS NOT NULL
AND ${users.email} IS NOT NULL
AND ${users.username} IS NOT NULL
AND ${users.firstName} IS NOT NULL
AND ${users.lastName} IS NOT NULL
)
`,
    ),

    uniqueIndex('users_clerk_id_unique_idx')
      .on(users.clerkId)
      .where(sql`${users.clerkId} IS NOT NULL`),

    uniqueIndex('users_email_unique_idx')
      .on(users.email)
      .where(sql`${users.email} IS NOT NULL`),

    uniqueIndex('users_username_unique_idx')
      .on(users.username)
      .where(sql`${users.username} IS NOT NULL`),
  ],
);
