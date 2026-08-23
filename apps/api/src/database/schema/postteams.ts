import { uuid, pgTable, primaryKey, index } from 'drizzle-orm/pg-core';
import { posts } from './posts';
import { teams } from './teams';

export const postTeams = pgTable(
  'post_teams',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
  },
  (postTeams) => [
    primaryKey({
      columns: [postTeams.postId, postTeams.teamId],
    }),

    index('post_teams_team_id_idx').on(postTeams.teamId),
  ],
);
