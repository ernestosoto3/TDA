import {uuid , varchar , text , boolean , timestamp , pgTable , unique , index} from 'drizzle-orm/pg-core'
import { users } from './users'
import { pushProviderEnum , mobilePlatformEnum } from './enums'


export const pushDevices = pgTable('push_devices',{
id : uuid('id').defaultRandom().primaryKey(),
userId : uuid('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),
provider : pushProviderEnum('provider').notNull(),
platform : mobilePlatformEnum('platform').notNull(),
deviceToken : text('device_token').notNull(),
deviceLabel : varchar('device_label',{length:150}),
isActive : boolean('is_active').default(true).notNull(),
lastSeenAt : timestamp('last_seen_at',{withTimezone:true}),
disabledAt : timestamp('disabled_at',{withTimezone:true}),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
updatedAt : timestamp('updated_at',{withTimezone:true}).defaultNow().notNull(),
},
(pushDevices)=>[
unique().on(
pushDevices.provider,
pushDevices.deviceToken,
),

index('push_devices_user_active_idx').on(
pushDevices.userId,
pushDevices.isActive,
),
],
)