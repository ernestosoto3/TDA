import {uuid , timestamp , primaryKey , pgTable} from 'drizzle-orm/pg-core'
import { leagues } from './leagues'
import { teams } from './teams'


export const leagueTeams = pgTable('league_teams',{
leagueId : uuid('league_id').notNull().references(()=>leagues.id,{onDelete:'cascade'}),
teamId : uuid('team_id').notNull().references(()=>teams.id,{onDelete:'cascade'}),
joinedAt : timestamp('joined_at',{withTimezone:true}).defaultNow().notNull(),
leftAt : timestamp('left_at',{withTimezone:true}),
},
(leagueTeams)=>[
primaryKey({
columns:[
leagueTeams.leagueId,
leagueTeams.teamId,
]
}),
],
)