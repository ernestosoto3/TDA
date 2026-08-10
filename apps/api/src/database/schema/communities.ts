import { uuid, varchar, text, timestamp, pgTable, check, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { citext } from './custom-types';
import { communityStatusEnum } from './enums';
import { sports } from './sports';
import { leagues } from './leagues';
import { teams } from './teams';

export const communities = pgTable(
  'communities',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 150 }).notNull(),
    slug: citext('slug').notNull().unique(),
    description: text('description'),
    guidelines: text('guidelines'),
    avatarUrl: text('avatar_url'),
    bannerUrl: text('banner_url'),
    linkedSportId: uuid('linked_sport_id').references(() => sports.id),
    linkedLeagueId: uuid('linked_league_id').references(() => leagues.id),
    linkedTeamId: uuid('linked_team_id').references(() => teams.id),
    status: communityStatusEnum('status').default('active').notNull(),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (communities) => [
    check(
      'communities_max_one_linked_entity_check',
      sql`num_nonnulls(${communities.linkedSportId},${communities.linkedLeagueId},${communities.linkedTeamId}) <= 1`,
    ),

    index('communities_linked_sport_id_idx').on(communities.linkedSportId),

    index('communities_linked_league_id_idx').on(communities.linkedLeagueId),

    index('communities_linked_team_id_idx').on(communities.linkedTeamId),
  ],
);
