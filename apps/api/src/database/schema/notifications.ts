import {uuid , varchar , text , boolean , timestamp , pgTable , index} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { users } from './users'
import { notificationTypeEnum } from './enums'


export const notifications = pgTable('notifications',{
id : uuid('id').defaultRandom().primaryKey(),
userId : uuid('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),
title : varchar('title',{length:200}).notNull(),
message : text('message').notNull(),
type : notificationTypeEnum('type').notNull(),
isRead : boolean('is_read').default(false).notNull(),
deepLinkRoute : text('deep_link_route'),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
readAt : timestamp('read_at',{withTimezone:true}),
expiresAt : timestamp('expires_at',{withTimezone:true}),
},
(notifications)=>[
index('notifications_user_read_created_idx').on(
notifications.userId,
notifications.isRead,
notifications.createdAt.desc(),
),

index('notifications_unread_idx').on(
notifications.userId,
notifications.createdAt.desc(),
).where(sql`${notifications.isRead} = false`),
],
)