import {uuid , text , timestamp , pgTable , check , uniqueIndex} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { userRoles } from './userroles'
import { sports } from './sports'
import { leagues } from './leagues'
import { teams } from './teams'
import { users } from './users'


export const editorEntityScopes = pgTable('editor_entity_scopes',{
id : uuid('id').defaultRandom().primaryKey(),
userRoleId : uuid('user_role_id').notNull().references(()=>userRoles.id,{onDelete:'restrict'}),
sportId : uuid('sport_id').references(()=>sports.id,{onDelete:'restrict'}),
leagueId : uuid('league_id').references(()=>leagues.id,{onDelete:'restrict'}),
teamId : uuid('team_id').references(()=>teams.id,{onDelete:'restrict'}),
assignedByUserId : uuid('assigned_by_user_id').notNull().references(()=>users.id,{onDelete:'restrict'}),
approvedByUserId : uuid('approved_by_user_id').notNull().references(()=>users.id,{onDelete:'restrict'}),
assignmentReason : text('assignment_reason').notNull(),
assignedAt : timestamp('assigned_at',{withTimezone:true}).defaultNow().notNull(),
revokedAt : timestamp('revoked_at',{withTimezone:true}),
},
(editorEntityScopes)=>[
check(
'editor_entity_scopes_exactly_one_entity_check',
sql`num_nonnulls(
${editorEntityScopes.sportId},
${editorEntityScopes.leagueId},
${editorEntityScopes.teamId}
) = 1`,
),

check(
'editor_entity_scopes_assigner_approver_different_check',
sql`${editorEntityScopes.assignedByUserId} <> ${editorEntityScopes.approvedByUserId}`,
),

uniqueIndex('editor_entity_scopes_active_sport_unique_idx')
.on(
editorEntityScopes.userRoleId,
editorEntityScopes.sportId,
)
.where(sql`${editorEntityScopes.sportId} IS NOT NULL AND ${editorEntityScopes.revokedAt} IS NULL`),

uniqueIndex('editor_entity_scopes_active_league_unique_idx')
.on(
editorEntityScopes.userRoleId,
editorEntityScopes.leagueId,
)
.where(sql`${editorEntityScopes.leagueId} IS NOT NULL AND ${editorEntityScopes.revokedAt} IS NULL`),

uniqueIndex('editor_entity_scopes_active_team_unique_idx')
.on(
editorEntityScopes.userRoleId,
editorEntityScopes.teamId,
)
.where(sql`${editorEntityScopes.teamId} IS NOT NULL AND ${editorEntityScopes.revokedAt} IS NULL`),
],
)