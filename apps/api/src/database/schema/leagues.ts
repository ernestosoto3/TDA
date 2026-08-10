import { pgTable, uuid, text, timestamp, varchar, unique, index } from 'drizzle-orm/pg-core'
import { sports } from './sports'
import { leagueStatusEnum } from './enums'


export const leagues = pgTable('leagues',{
id : uuid('id').defaultRandom().primaryKey(),
sportId : uuid('sport_id').notNull().references(()=>sports.id,{onDelete:'restrict'}),
name : varchar('name',{length:200}).notNull(),
seasonLabel : varchar('season_label',{length:50}).notNull(),
region : varchar('region',{length:150}),
logoUrl : text('logo_url').notNull(),
description : text('description'),
status : leagueStatusEnum('status').default('upcoming').notNull(),
archivedAt : timestamp('archived_at',{withTimezone:true}),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
updatedAt : timestamp('updated_at',{withTimezone:true}).defaultNow().notNull(),
},
(leagues)=>[
unique().on(
leagues.sportId,
leagues.name,
leagues.seasonLabel,
),

index('leagues_sport_id_idx').on(
leagues.sportId,
),
],
)