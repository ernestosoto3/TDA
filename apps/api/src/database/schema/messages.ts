import {uuid , text , timestamp , pgTable , check , foreignKey , index} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { communities } from './communities'
import { users } from './users'
import { communityMemberships } from './communitymemberships'
import { messageStatusEnum } from './enums'


export const messages = pgTable('messages',{
id : uuid('id').defaultRandom().primaryKey(),
communityId : uuid('community_id').notNull().references(()=>communities.id,{onDelete:'restrict'}),
senderUserId : uuid('sender_user_id').notNull().references(()=>users.id,{onDelete:'restrict'}),
messageText : text('message_text').notNull(),
status : messageStatusEnum('status').default('active').notNull(),
sentAt : timestamp('sent_at',{withTimezone:true}).defaultNow().notNull(),
deletedAt : timestamp('deleted_at',{withTimezone:true}),
},
(messages)=>[
check(
'messages_soft_deleted_requires_deleted_at_check',
sql`${messages.status} <> 'soft_deleted' OR ${messages.deletedAt} IS NOT NULL`,
),

foreignKey({
columns:[
messages.communityId,
messages.senderUserId,
],
foreignColumns:[
communityMemberships.communityId,
communityMemberships.userId,
]
}),

index('messages_community_sent_at_idx').on(
messages.communityId,
messages.sentAt.desc(),
),

index('messages_sender_user_id_idx').on(
messages.senderUserId,
),

index('messages_membership_fk_idx').on(
messages.communityId,
messages.senderUserId,
),

index('messages_active_community_idx')
.on(
messages.communityId,
messages.sentAt.desc(),
)
.where(
sql`${messages.status} = 'active' AND ${messages.deletedAt} IS NULL`
),
],
)