import { uuid, pgTable, primaryKey, index } from 'drizzle-orm/pg-core';
import { posts } from './posts';
import { leagues } from './leagues';

export const postLeagues = pgTable(
  'post_leagues',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    leagueId: uuid('league_id')
      .notNull()
      .references(() => leagues.id, { onDelete: 'cascade' }),
  },
  (postLeagues) => [
    primaryKey({
      columns: [postLeagues.postId, postLeagues.leagueId],
    }),

    index('post_leagues_league_id_idx').on(postLeagues.leagueId),
  ],
);
