import {uuid , text , timestamp , pgTable , check , uniqueIndex} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { users } from './users'
import { deletionRequestStatusEnum } from './enums'


export const accountDeletionRequests = pgTable('account_deletion_requests',{
id : uuid('id').defaultRandom().primaryKey(),
userId : uuid('user_id').notNull().references(()=>users.id,{onDelete:'restrict'}),
status : deletionRequestStatusEnum('status').notNull(),
requestedAt : timestamp('requested_at',{withTimezone:true}).defaultNow().notNull(),
identityVerifiedAt : timestamp('identity_verified_at',{withTimezone:true}),
scheduledFor : timestamp('scheduled_for',{withTimezone:true}),
processedByUserId : uuid('processed_by_user_id').references(()=>users.id,{onDelete:'restrict'}),
processingReason : text('processing_reason'),
completedAt : timestamp('completed_at',{withTimezone:true}),
cancelledAt : timestamp('cancelled_at',{withTimezone:true}),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
updatedAt : timestamp('updated_at',{withTimezone:true}).defaultNow().notNull(),
},
(accountDeletionRequests)=>[
check(
'account_deletion_requests_completed_requires_completed_at_check',
sql`${accountDeletionRequests.status} <> 'completed' OR ${accountDeletionRequests.completedAt} IS NOT NULL`,
),

check(
'account_deletion_requests_cancelled_requires_cancelled_at_check',
sql`${accountDeletionRequests.status} <> 'cancelled' OR ${accountDeletionRequests.cancelledAt} IS NOT NULL`,
),

uniqueIndex('account_deletion_requests_active_user_unique_idx')
.on(
accountDeletionRequests.userId,
)
.where(sql`${accountDeletionRequests.status} IN ('pending_verification','verified','scheduled')`),
],
)