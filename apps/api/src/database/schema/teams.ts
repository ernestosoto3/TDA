import { uuid, varchar, text, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { teamStatusEnum } from './enums';

export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),
  officialName: varchar('official_name', { length: 200 }).notNull(),
  shortName: varchar('short_name', { length: 50 }),
  city: varchar('city', { length: 150 }).notNull(),
  homeVenue: varchar('home_venue', { length: 200 }),
  logoUrl: text('logo_url').notNull(),
  status: teamStatusEnum('status').default('active').notNull(),
  archivedAt: timestamp('archived_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
