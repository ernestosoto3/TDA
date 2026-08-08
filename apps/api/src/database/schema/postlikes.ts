import {uuid , timestamp , pgTable , primaryKey , index} from 'drizzle-orm/pg-core'
import { posts } from './posts'
import { users } from './users'


export const postLikes = pgTable('post_likes',{
postId : uuid('post_id').notNull().references(()=>posts.id,{onDelete:'cascade'}),
userId : uuid('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),
createdAt : timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
},
(postLikes)=>[
primaryKey({
columns:[
postLikes.postId,
postLikes.userId,
]
}),

index('post_likes_user_created_idx').on(
postLikes.userId,
postLikes.createdAt.desc(),
),

index('post_likes_post_id_idx').on(
postLikes.postId,
),
],
)