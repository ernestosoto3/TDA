import {uuid , text , timestamp , pgTable , unique , foreignKey , index} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { posts } from './posts'
import { users } from './users'
import { commentStatusEnum } from './enums'


export const comments = pgTable('comments',{
id : uuid('id').defaultRandom().primaryKey(),
postId : uuid('post_id').notNull().references(()=>posts.id,{onDelete:'restrict'}),
authorUserId : uuid('author_user_id').notNull().references(()=>users.id,{onDelete:'restrict'}),
parentCommentId : uuid('parent_comment_id'),
content : text('content').notNull(),
status : commentStatusEnum('status').default('active').notNull(),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
updatedAt : timestamp('updated_at',{withTimezone:true}).defaultNow().notNull(),
deletedAt : timestamp('deleted_at',{withTimezone:true}),
},
(comments)=>[
unique().on(
comments.id,
comments.postId,
),

foreignKey({
columns:[
comments.parentCommentId,
comments.postId,
],
foreignColumns:[
comments.id,
comments.postId,
]
}),

index('comments_post_created_idx').on(
comments.postId,
comments.createdAt,
),

index('comments_parent_created_idx').on(
comments.parentCommentId,
comments.createdAt,
),

index('comments_author_user_idx').on(
comments.authorUserId,
),

index('comments_active_post_idx').on(
comments.postId,
comments.createdAt,
).where(sql`${comments.status} = 'active' AND ${comments.deletedAt} IS NULL`),
],
)