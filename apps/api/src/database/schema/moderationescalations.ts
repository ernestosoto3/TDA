import {uuid , text , timestamp , pgTable , check , index} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { reports } from './reports'
import { users } from './users'
import { escalationStatusEnum } from './enums'


export const moderationEscalations = pgTable('moderation_escalations',{
id : uuid('id').defaultRandom().primaryKey(),
reportId : uuid('report_id').notNull().references(()=>reports.id,{onDelete:'restrict'}),
escalatedByUserId : uuid('escalated_by_user_id').notNull().references(()=>users.id,{onDelete:'restrict'}),
assignedToUserId : uuid('assigned_to_user_id').references(()=>users.id,{onDelete:'restrict'}),
reason : text('reason').notNull(),
status : escalationStatusEnum('status').notNull(),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
resolvedAt : timestamp('resolved_at',{withTimezone:true}),
resolvedByUserId : uuid('resolved_by_user_id').references(()=>users.id,{onDelete:'restrict'}),
},
(moderationEscalations)=>[
check(
'moderation_escalations_resolved_requires_resolved_at_check',
sql`${moderationEscalations.status} <> 'resolved' OR ${moderationEscalations.resolvedAt} IS NOT NULL`,
),

index('moderation_escalations_status_created_idx').on(
moderationEscalations.status,
moderationEscalations.createdAt,
),

index('moderation_escalations_report_idx').on(
moderationEscalations.reportId,
),

index('moderation_escalations_escalated_by_user_idx').on(
moderationEscalations.escalatedByUserId,
),

index('moderation_escalations_assigned_to_user_idx').on(
moderationEscalations.assignedToUserId,
),

index('moderation_escalations_resolved_by_user_idx').on(
moderationEscalations.resolvedByUserId,
),
],
)