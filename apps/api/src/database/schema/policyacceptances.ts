import {uuid , varchar , jsonb , timestamp , pgTable , unique , index} from 'drizzle-orm/pg-core'
import { users } from './users'
import { policyVersions } from './policyversions'


export const policyAcceptances = pgTable('policy_acceptances',{
id : uuid('id').defaultRandom().primaryKey(),
userId : uuid('user_id').notNull().references(()=>users.id,{onDelete:'restrict'}),
policyVersionId : uuid('policy_version_id').notNull().references(()=>policyVersions.id,{onDelete:'restrict'}),
acceptanceSource : varchar('acceptance_source',{length:50}).notNull(),
applicationVersion : varchar('application_version',{length:50}),
securityEvidence : jsonb('security_evidence'),
acceptedAt : timestamp('accepted_at',{withTimezone:true}).defaultNow().notNull(),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
},
(policyAcceptances)=>[
unique().on(
policyAcceptances.userId,
policyAcceptances.policyVersionId,
),

index('policy_acceptances_user_accepted_idx').on(
policyAcceptances.userId,
policyAcceptances.acceptedAt.desc(),
),

index('policy_acceptances_policy_version_accepted_idx').on(
policyAcceptances.policyVersionId,
policyAcceptances.acceptedAt.desc(),
),
],
)