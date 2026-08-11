import { uuid, text, timestamp, pgTable, check, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { dataSources } from './datasources';
import { sports } from './sports';
import { leagues } from './leagues';
import { teams } from './teams';
import { athletes } from './athletes';
import { games } from './games';
import { scores } from './scores';
import { posts } from './posts';
import { users } from './users';

export const dataVerifications = pgTable(
  'data_verifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sourceId: uuid('source_id')
      .notNull()
      .references(() => dataSources.id, { onDelete: 'restrict' }),
    sportId: uuid('sport_id').references(() => sports.id, { onDelete: 'restrict' }),
    leagueId: uuid('league_id').references(() => leagues.id, { onDelete: 'restrict' }),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'restrict' }),
    athleteId: uuid('athlete_id').references(() => athletes.id, { onDelete: 'restrict' }),
    gameId: uuid('game_id').references(() => games.id, { onDelete: 'restrict' }),
    scoreId: uuid('score_id').references(() => scores.id, { onDelete: 'restrict' }),
    postId: uuid('post_id').references(() => posts.id, { onDelete: 'restrict' }),
    sourceReferenceUrl: text('source_reference_url'),
    verifiedByUserId: uuid('verified_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    verifiedAt: timestamp('verified_at', { withTimezone: true }).defaultNow().notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (dataVerifications) => [
    check(
      'data_verifications_exactly_one_target_check',
      sql`num_nonnulls(
${dataVerifications.sportId},
${dataVerifications.leagueId},
${dataVerifications.teamId},
${dataVerifications.athleteId},
${dataVerifications.gameId},
${dataVerifications.scoreId},
${dataVerifications.postId}
) = 1`,
    ),

    index('data_verifications_source_verified_idx').on(
      dataVerifications.sourceId,
      dataVerifications.verifiedAt.desc(),
    ),

    index('data_verifications_user_verified_idx').on(
      dataVerifications.verifiedByUserId,
      dataVerifications.verifiedAt.desc(),
    ),

    index('data_verifications_sport_idx')
      .on(dataVerifications.sportId)
      .where(sql`${dataVerifications.sportId} IS NOT NULL`),

    index('data_verifications_league_idx')
      .on(dataVerifications.leagueId)
      .where(sql`${dataVerifications.leagueId} IS NOT NULL`),

    index('data_verifications_team_idx')
      .on(dataVerifications.teamId)
      .where(sql`${dataVerifications.teamId} IS NOT NULL`),

    index('data_verifications_athlete_idx')
      .on(dataVerifications.athleteId)
      .where(sql`${dataVerifications.athleteId} IS NOT NULL`),

    index('data_verifications_game_idx')
      .on(dataVerifications.gameId)
      .where(sql`${dataVerifications.gameId} IS NOT NULL`),

    index('data_verifications_score_idx')
      .on(dataVerifications.scoreId)
      .where(sql`${dataVerifications.scoreId} IS NOT NULL`),

    index('data_verifications_post_idx')
      .on(dataVerifications.postId)
      .where(sql`${dataVerifications.postId} IS NOT NULL`),
  ],
);
