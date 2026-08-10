import {uuid , integer , jsonb , timestamp , pgTable, check , index} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { games } from './games'
import { teams } from './teams'
import { scoreResultTypeEnum , scoreStatusEnum } from './enums'


export const scores = pgTable('scores',{
id : uuid('id').defaultRandom().primaryKey(),
gameId : uuid('game_id').notNull().unique().references(()=>games.id,{onDelete:'cascade'}),
homeScore : integer('home_score').default(0).notNull(),
awayScore : integer('away_score').default(0).notNull(),
periodBreakdown : jsonb('period_breakdown'),
winningTeamId : uuid('winning_team_id').references(()=>teams.id),
resultType : scoreResultTypeEnum('result_type'),
status : scoreStatusEnum('status').default('pending').notNull(),
lastUpdatedAt : timestamp('last_updated_at',{withTimezone:true}).defaultNow().notNull(),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
},
(scores)=>[
check(
'scores_home_score_non_negative_check',
sql`${scores.homeScore} >= 0`,
),

check(
'scores_away_score_non_negative_check',
sql`${scores.awayScore} >= 0`,
),

check(
'scores_final_requires_result_type_check',
sql`${scores.status} <> 'final' OR ${scores.resultType} IS NOT NULL`,
),

index('scores_winning_team_id_idx').on(
scores.winningTeamId,
),
],
)