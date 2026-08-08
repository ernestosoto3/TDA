import {uuid , varchar , timestamp , pgTable} from 'drizzle-orm/pg-core'
import { users } from './users'


export const userPreferences = pgTable('user_preferences',{
userId : uuid('user_id').primaryKey().references(()=>users.id,{onDelete:'cascade'}),
preferredLanguage : varchar('preferred_language',{length:10}).default('es-PR').notNull(),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
updatedAt : timestamp('updated_at',{withTimezone:true}).defaultNow().notNull(),
})