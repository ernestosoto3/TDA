import { uuid, pgTable, primaryKey, index } from 'drizzle-orm/pg-core';
import { posts } from './posts';
import { sports } from './sports';

export const postSports = pgTable(
  'post_sports',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    sportId: uuid('sport_id')
      .notNull()
      .references(() => sports.id, { onDelete: 'cascade' }),
  },
  (postSports) => [
    primaryKey({
      columns: [postSports.postId, postSports.sportId],
    }),

    index('post_sports_sport_id_idx').on(postSports.sportId),
  ],
);
