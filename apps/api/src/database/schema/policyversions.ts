import {uuid , varchar , text , boolean , timestamp , pgTable , check , unique , uniqueIndex , index} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { users } from './users'
import { policyTypeEnum , policyStatusEnum } from './enums'


export const policyVersions = pgTable('policy_versions',{
id : uuid('id').defaultRandom().primaryKey(),
policyType : policyTypeEnum('policy_type').notNull(),
version : varchar('version',{length:50}).notNull(),
title : varchar('title',{length:255}).notNull(),
documentUrl : text('document_url').notNull(),
contentHash : varchar('content_hash',{length:64}).notNull(),
status : policyStatusEnum('status').default('draft').notNull(),
requiresAcceptance : boolean('requires_acceptance').default(true).notNull(),
createdByUserId : uuid('created_by_user_id').references(()=>users.id,{onDelete:'set null'}),
publishedAt : timestamp('published_at',{withTimezone:true}),
effectiveAt : timestamp('effective_at',{withTimezone:true}),
supersededAt : timestamp('superseded_at',{withTimezone:true}),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
},
(policyVersions)=>[
unique().on(
policyVersions.policyType,
policyVersions.version,
),

check(
'policy_versions_content_hash_length_check',
sql`length(${policyVersions.contentHash}) = 64`,
),

check(
'policy_versions_published_requires_dates_check',
sql`${policyVersions.status} <> 'published' OR (${policyVersions.publishedAt} IS NOT NULL AND ${policyVersions.effectiveAt} IS NOT NULL)`,
),

check(
'policy_versions_superseded_requires_date_check',
sql`${policyVersions.status} <> 'superseded' OR ${policyVersions.supersededAt} IS NOT NULL`,
),

uniqueIndex('policy_versions_current_required_unique_idx')
.on(
policyVersions.policyType,
)
.where(sql`${policyVersions.status} = 'published' AND ${policyVersions.requiresAcceptance} = true AND ${policyVersions.supersededAt} IS NULL`),

index('policy_versions_type_status_effective_idx').on(
policyVersions.policyType,
policyVersions.status,
policyVersions.effectiveAt.desc(),
),

index('policy_versions_created_by_user_idx').on(
policyVersions.createdByUserId,
).where(sql`${policyVersions.createdByUserId} IS NOT NULL`),
],
)