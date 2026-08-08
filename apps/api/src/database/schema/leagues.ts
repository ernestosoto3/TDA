import { pgTable, uuid, text, timestamp, varchar,unique } from 'drizzle-orm/pg-core';
import { sports } from './sports';
import { leagueStatusEnum } from './enums';

export const leagues = pgTable('leagues',{
    id:uuid('id').defaultRandom().primaryKey(),
    sportId:uuid('sport_id').defaultRandom().notNull().references(()=>sports.id),
    name : varchar('name',{length:200}).notNull(),
    seasonLabel: varchar('season_label',{length : 50}).notNull(),
    region : varchar('region',{length: 150}),
    logoUrl : text('logo_url').notNull(),
    description : text('description'),
    status : leagueStatusEnum('status').notNull().default('upcoming'),
    archivedAt : timestamp('archived_at',{ withTimezone : true,}),
    createdAt : timestamp( 'created_at',{withTimezone : true , }).notNull().defaultNow(),
    updatedAt : timestamp( 'updated_at',{withTimezone : true , }).notNull().defaultNow(),
    
}, 

(leagues)=>[
unique().on(
    leagues.sportId,
    leagues.name , 
    leagues.seasonLabel,
)
],

);

