import {uuid,timestamp,primaryKey,pgTable} from 'drizzle-orm/pg-core'
import { leagues } from './leagues'
import { teams } from './teams'

export const leagueTeams = pgTable('league_teams',{
    leagueId : uuid('league_id').defaultRandom().references(()=>leagues.id,{onDelete : 'cascade'}).notNull(),
    teamId : uuid('team_id').defaultRandom().references(()=>teams.id,{onDelete : 'cascade'}).notNull(),
    joinedAt : timestamp('joined_at', { withTimezone : true}).defaultNow().notNull(),
    leftAt : timestamp('left_at',{withTimezone : true}),
},

(leagueTeams)=>[
    primaryKey({
        columns: [
            leagueTeams.leagueId,
            leagueTeams.teamId,
        ]
    })
]
);