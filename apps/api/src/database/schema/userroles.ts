import { uuid, text, timestamp, pgTable, check, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { platformRoleEnum } from './enums';

export const userRoles = pgTable(
  'user_roles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    role: platformRoleEnum('role').notNull(),
    assignedByUserId: uuid('assigned_by_user_id').references(() => users.id, {
      onDelete: 'restrict',
    }),
    approvedByUserId: uuid('approved_by_user_id').references(() => users.id, {
      onDelete: 'restrict',
    }),
    assignmentReason: text('assignment_reason').notNull(),
    assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow().notNull(),
    revokedByUserId: uuid('revoked_by_user_id').references(() => users.id, {
      onDelete: 'restrict',
    }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    revocationReason: text('revocation_reason'),
  },
  (userRoles) => [
    check(
      'user_roles_assigned_by_not_self_check',
      sql`${userRoles.assignedByUserId} IS NULL OR ${userRoles.assignedByUserId} <> ${userRoles.userId}`,
    ),

    check(
      'user_roles_approved_by_not_self_check',
      sql`${userRoles.approvedByUserId} IS NULL OR ${userRoles.approvedByUserId} <> ${userRoles.userId}`,
    ),

    check(
      'user_roles_approved_by_not_assigner_check',
      sql`${userRoles.approvedByUserId} IS NULL OR ${userRoles.assignedByUserId} IS NULL OR ${userRoles.approvedByUserId} <> ${userRoles.assignedByUserId}`,
    ),

    check(
      'user_roles_revoked_requires_reason_check',
      sql`${userRoles.revokedAt} IS NULL OR ${userRoles.revocationReason} IS NOT NULL`,
    ),

    uniqueIndex('user_roles_active_user_unique_idx')
      .on(userRoles.userId)
      .where(sql`${userRoles.revokedAt} IS NULL`),

    index('user_roles_role_user_idx').on(userRoles.role, userRoles.userId),

    index('user_roles_user_id_idx').on(userRoles.userId),

    index('user_roles_assigned_by_user_id_idx').on(userRoles.assignedByUserId),

    index('user_roles_approved_by_user_id_idx').on(userRoles.approvedByUserId),

    index('user_roles_revoked_by_user_id_idx').on(userRoles.revokedByUserId),
  ],
);
