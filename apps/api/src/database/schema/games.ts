import {
  uuid,
  timestamp,
  varchar,
  text,
  pgTable,
  check,
  foreignKey,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { leagues } from './leagues';
import { teams } from './teams';
import { gameStatusEnum } from './enums';
import { leagueTeams } from './leagueteams';

export const games = pgTable(
  'games',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    leagueId: uuid('league_id')
      .notNull()
      .references(() => leagues.id),
    homeTeamId: uuid('home_team_id')
      .notNull()
      .references(() => teams.id),
    awayTeamId: uuid('away_team_id')
      .notNull()
      .references(() => teams.id),
    scheduledStartAt: timestamp('scheduled_start_at', { withTimezone: true }).notNull(),
    status: gameStatusEnum('status').default('scheduled').notNull(),
    venue: varchar('venue', { length: 250 }),
    broadcastDetails: text('broadcast_details'),
    coverImageUrl: text('cover_image_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (games) => [
    check('games_home_away_different_check', sql`${games.homeTeamId} <> ${games.awayTeamId}`),

    foreignKey({
      columns: [games.leagueId, games.homeTeamId],
      foreignColumns: [leagueTeams.leagueId, leagueTeams.teamId],
    }),

    foreignKey({
      columns: [games.leagueId, games.awayTeamId],
      foreignColumns: [leagueTeams.leagueId, leagueTeams.teamId],
    }),

    unique().on(games.leagueId, games.homeTeamId, games.awayTeamId, games.scheduledStartAt),

    index('games_league_id_idx').on(games.leagueId),

    index('games_home_team_id_idx').on(games.homeTeamId),

    index('games_away_team_id_idx').on(games.awayTeamId),

    index('games_status_scheduled_start_at_idx').on(games.status, games.scheduledStartAt),

    index('games_league_scheduled_start_at_idx').on(games.leagueId, games.scheduledStartAt),

    index('games_league_away_team_idx').on(games.leagueId, games.awayTeamId),
  ],
);
