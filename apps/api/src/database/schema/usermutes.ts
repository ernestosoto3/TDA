import {uuid , timestamp , pgTable , primaryKey , check , index} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { users } from './users'


export const userMutes = pgTable('user_mutes',{
userId : uuid('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),
mutedUserId : uuid('muted_user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
},
(userMutes)=>[
primaryKey({
columns:[
userMutes.userId,
userMutes.mutedUserId,
]
}),

check(
'user_mutes_no_self_mute_check',
sql`${userMutes.userId} <> ${userMutes.mutedUserId}`,
),

index('user_mutes_muted_user_idx').on(
userMutes.mutedUserId,
),
],
)