import {uuid , varchar , text , boolean , timestamp , pgTable , index} from 'drizzle-orm/pg-core'
import { sourceTypeEnum } from './enums'


export const dataSources = pgTable('data_sources',{
id : uuid('id').defaultRandom().primaryKey(),
name : varchar('name',{length:200}).notNull(),
type : sourceTypeEnum('type').notNull(),
baseUrl : text('base_url'),
isApproved : boolean('is_approved').default(false).notNull(),
notes : text('notes'),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
updatedAt : timestamp('updated_at',{withTimezone:true}).defaultNow().notNull(),
},
(dataSources)=>[
index('data_sources_approved_name_idx').on(
dataSources.isApproved,
dataSources.name,
),
],
)