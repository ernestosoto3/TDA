import { uuid, pgTable, primaryKey, index } from 'drizzle-orm/pg-core';
import { posts } from './posts';
import { games } from './games';

export const postGames = pgTable(
  'post_games',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    gameId: uuid('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
  },
  (postGames) => [
    primaryKey({
      columns: [postGames.postId, postGames.gameId],
    }),

    index('post_games_game_id_idx').on(postGames.gameId),
  ],
);
