import {uuid , text , timestamp , pgTable , check , uniqueIndex , index} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { userRoles } from './userroles'
import { communities } from './communities'
import { users } from './users'


export const moderatorCommunityScopes = pgTable('moderator_community_scopes',{
id : uuid('id').defaultRandom().primaryKey(),
userRoleId : uuid('user_role_id').notNull().references(()=>userRoles.id,{onDelete:'restrict'}),
communityId : uuid('community_id').notNull().references(()=>communities.id,{onDelete:'restrict'}),
assignedByUserId : uuid('assigned_by_user_id').notNull().references(()=>users.id,{onDelete:'restrict'}),
approvedByUserId : uuid('approved_by_user_id').notNull().references(()=>users.id,{onDelete:'restrict'}),
assignmentReason : text('assignment_reason').notNull(),
assignedAt : timestamp('assigned_at',{withTimezone:true}).defaultNow().notNull(),
revokedAt : timestamp('revoked_at',{withTimezone:true}),
},
(moderatorCommunityScopes)=>[
check(
'moderator_scopes_assigner_approver_different_check',
sql`${moderatorCommunityScopes.assignedByUserId} <> ${moderatorCommunityScopes.approvedByUserId}`,
),

uniqueIndex('moderator_community_scopes_active_unique_idx')
.on(
moderatorCommunityScopes.userRoleId,
moderatorCommunityScopes.communityId,
)
.where(
sql`${moderatorCommunityScopes.revokedAt} IS NULL`
),

index('moderator_community_scopes_user_role_id_idx').on(
moderatorCommunityScopes.userRoleId,
),

index('moderator_community_scopes_community_id_idx').on(
moderatorCommunityScopes.communityId,
),

index('moderator_community_scopes_assigned_by_user_id_idx').on(
moderatorCommunityScopes.assignedByUserId,
),

index('moderator_community_scopes_approved_by_user_id_idx').on(
moderatorCommunityScopes.approvedByUserId,
),
],
)