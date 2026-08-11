import { uuid, boolean, timestamp, pgTable, check, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { sports } from './sports';
import { leagues } from './leagues';
import { teams } from './teams';
import { athletes } from './athletes';

export const favorites = pgTable(
  'favorites',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    sportId: uuid('sport_id').references(() => sports.id, { onDelete: 'cascade' }),
    leagueId: uuid('league_id').references(() => leagues.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }),
    athleteId: uuid('athlete_id').references(() => athletes.id, { onDelete: 'cascade' }),
    notificationsEnabled: boolean('notifications_enabled').default(true).notNull(),
    addedAt: timestamp('added_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (favorites) => [
    check(
      'favorites_exactly_one_target_check',
      sql`num_nonnulls(
${favorites.sportId},
${favorites.leagueId},
${favorites.teamId},
${favorites.athleteId}
) = 1`,
    ),

    uniqueIndex('favorites_user_sport_unique_idx')
      .on(favorites.userId, favorites.sportId)
      .where(sql`${favorites.sportId} IS NOT NULL`),

    uniqueIndex('favorites_user_league_unique_idx')
      .on(favorites.userId, favorites.leagueId)
      .where(sql`${favorites.leagueId} IS NOT NULL`),

    uniqueIndex('favorites_user_team_unique_idx')
      .on(favorites.userId, favorites.teamId)
      .where(sql`${favorites.teamId} IS NOT NULL`),

    uniqueIndex('favorites_user_athlete_unique_idx')
      .on(favorites.userId, favorites.athleteId)
      .where(sql`${favorites.athleteId} IS NOT NULL`),

    index('favorites_user_id_idx').on(favorites.userId),

    index('favorites_sport_id_idx')
      .on(favorites.sportId)
      .where(sql`${favorites.sportId} IS NOT NULL`),

    index('favorites_league_id_idx')
      .on(favorites.leagueId)
      .where(sql`${favorites.leagueId} IS NOT NULL`),

    index('favorites_team_id_idx')
      .on(favorites.teamId)
      .where(sql`${favorites.teamId} IS NOT NULL`),

    index('favorites_athlete_id_idx')
      .on(favorites.athleteId)
      .where(sql`${favorites.athleteId} IS NOT NULL`),
  ],
);
