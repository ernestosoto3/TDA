import { uuid, pgTable, primaryKey, index } from 'drizzle-orm/pg-core';
import { posts } from './posts';
import { athletes } from './athletes';

export const postAthletes = pgTable(
  'post_athletes',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    athleteId: uuid('athlete_id')
      .notNull()
      .references(() => athletes.id, { onDelete: 'cascade' }),
  },
  (postAthletes) => [
    primaryKey({
      columns: [postAthletes.postId, postAthletes.athleteId],
    }),

    index('post_athletes_athlete_id_idx').on(postAthletes.athleteId),
  ],
);
