import {uuid , text , timestamp , pgTable , index} from 'drizzle-orm/pg-core'
import { users } from './users'
import { communities } from './communities'
import { reports } from './reports'


export const userWarnings = pgTable('user_warnings',{
id : uuid('id').defaultRandom().primaryKey(),
userId : uuid('user_id').notNull().references(()=>users.id,{onDelete:'restrict'}),
communityId : uuid('community_id').references(()=>communities.id,{onDelete:'restrict'}),
issuedByUserId : uuid('issued_by_user_id').notNull().references(()=>users.id,{onDelete:'restrict'}),
reportId : uuid('report_id').references(()=>reports.id,{onDelete:'restrict'}),
reason : text('reason').notNull(),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
revokedAt : timestamp('revoked_at',{withTimezone:true}),
revokedByUserId : uuid('revoked_by_user_id').references(()=>users.id,{onDelete:'restrict'}),
},
(userWarnings)=>[
index('user_warnings_user_created_idx').on(
userWarnings.userId,
userWarnings.createdAt.desc(),
),
],
)