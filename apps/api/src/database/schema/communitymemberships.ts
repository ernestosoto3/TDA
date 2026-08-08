import {uuid , timestamp , pgTable , primaryKey} from 'drizzle-orm/pg-core'
import { users } from './users'
import { communities } from './communities'
import { membershipRoleEnum , membershipStatusEnum } from './enums'


export const communityMemberships = pgTable('community_memberships',{
communityId : uuid('community_id').notNull().references(()=>communities.id,{onDelete:'cascade'}),
userId : uuid('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),
role : membershipRoleEnum('role').default('member').notNull(),
status : membershipStatusEnum('status').default('active').notNull(),
joinedAt : timestamp('joined_at',{withTimezone:true}).defaultNow().notNull(),
leftAt : timestamp('left_at',{withTimezone:true}),
updatedAt : timestamp('updated_at',{withTimezone:true}).defaultNow().notNull(),
},
(communityMemberships)=>[
primaryKey({
columns:[
communityMemberships.communityId,
communityMemberships.userId,
]
}),
],
)