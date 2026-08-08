import {uuid , varchar , text , timestamp , pgTable , check , index} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { users } from './users'
import { postContentTypeEnum , postStatusEnum , mediaTypeEnum } from './enums'


export const posts = pgTable('posts',{
id : uuid('id').defaultRandom().primaryKey(),
authorUserId : uuid('author_user_id').notNull().references(()=>users.id,{onDelete:'restrict'}),
contentType : postContentTypeEnum('content_type').default('post').notNull(),
title : varchar('title',{length:250}),
excerpt : text('excerpt'),
content : text('content').notNull(),
coverMediaUrl : text('cover_media_url'),
coverMediaType : mediaTypeEnum('cover_media_type'),
status : postStatusEnum('status').default('draft').notNull(),
publishedAt : timestamp('published_at',{withTimezone:true}),
hiddenAt : timestamp('hidden_at',{withTimezone:true}),
deletedAt : timestamp('deleted_at',{withTimezone:true}),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
updatedAt : timestamp('updated_at',{withTimezone:true}).defaultNow().notNull(),
scheduledFor : timestamp('scheduled_for',{withTimezone:true}),
scheduledByUserId : uuid('scheduled_by_user_id').references(()=>users.id,{onDelete:'restrict'}),
},
(posts)=>[
check(
'posts_article_requires_title_check',
sql`${posts.contentType} <> 'article' OR (${posts.title} IS NOT NULL AND length(trim(${posts.title})) > 0)`,
),

check(
'posts_cover_media_pair_check',
sql`(
(${posts.coverMediaUrl} IS NULL AND ${posts.coverMediaType} IS NULL)
OR
(${posts.coverMediaUrl} IS NOT NULL AND ${posts.coverMediaType} IS NOT NULL)
)`,
),

check(
'posts_scheduled_requires_schedule_data_check',
sql`${posts.status} <> 'scheduled' OR (${posts.scheduledFor} IS NOT NULL AND ${posts.scheduledByUserId} IS NOT NULL)`,
),

check(
'posts_published_requires_published_at_check',
sql`${posts.status} <> 'published' OR ${posts.publishedAt} IS NOT NULL`,
),

check(
'posts_scheduled_for_after_created_at_check',
sql`${posts.status} <> 'scheduled' OR ${posts.scheduledFor} > ${posts.createdAt}`,
),

index('posts_author_user_idx').on(
posts.authorUserId,
),

index('posts_scheduled_by_user_idx').on(
posts.scheduledByUserId,
),

index('posts_status_scheduled_for_idx').on(
posts.status,
posts.scheduledFor,
),

index('posts_content_type_status_published_idx').on(
posts.contentType,
posts.status,
posts.publishedAt.desc(),
),

index('posts_published_feed_idx').on(
posts.publishedAt.desc(),
).where(sql`${posts.status} = 'published' AND ${posts.deletedAt} IS NULL`),
],
)