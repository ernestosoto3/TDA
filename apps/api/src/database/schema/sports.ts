import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { citext } from './custom-types';
import { sportStatusEnum } from './enums';

export const sports = pgTable('sports', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: citext('name').notNull().unique(),

  description: text('description'),

  iconUrl: text('icon_url').notNull(),

  bannerUrl: text('banner_url'),

  status: sportStatusEnum('status').default('draft').notNull(),

  archivedAt: timestamp('archived_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
