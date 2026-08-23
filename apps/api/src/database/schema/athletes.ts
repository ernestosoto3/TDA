import { uuid, varchar, text, timestamp, pgTable, index } from 'drizzle-orm/pg-core';
import { athleteStatusEnum } from './enums';
import { teams } from './teams';

export const athletes = pgTable(
  'athletes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    currentTeamId: uuid('current_team_id')
      .notNull()
      .references(() => teams.id),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    position: varchar('position', { length: 100 }).notNull(),
    jerseyNumber: varchar('jersey_number', { length: 10 }),
    photoUrl: text('photo_url'),
    status: athleteStatusEnum('status').default('active').notNull(),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (athletes) => [index('athletes_current_team_id_idx').on(athletes.currentTeamId)],
);
