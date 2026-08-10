import {uuid , boolean , timestamp , pgTable , primaryKey , check , index} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { posts } from './posts'
import { communities } from './communities'
import { users } from './users'


export const postCommunities = pgTable('post_communities',{
postId : uuid('post_id').notNull().references(()=>posts.id,{onDelete:'cascade'}),
communityId : uuid('community_id').notNull().references(()=>communities.id,{onDelete:'cascade'}),
isPinned : boolean('is_pinned').default(false).notNull(),
pinnedAt : timestamp('pinned_at',{withTimezone:true}),
pinnedByUserId : uuid('pinned_by_user_id').references(()=>users.id),
},
(postCommunities)=>[
primaryKey({
columns:[
postCommunities.postId,
postCommunities.communityId,
]
}),

check(
'post_communities_pinned_requires_pinned_at_check',
sql`${postCommunities.isPinned} = false OR ${postCommunities.pinnedAt} IS NOT NULL`,
),

index('post_communities_community_pinned_idx').on(
postCommunities.communityId,
postCommunities.isPinned,
postCommunities.pinnedAt.desc(),
),

index('community_pinned_posts_idx').on(
postCommunities.communityId,
postCommunities.pinnedAt.desc(),
).where(
sql`${postCommunities.isPinned} = true`
),

index('post_communities_pinned_by_user_id_idx').on(
postCommunities.pinnedByUserId,
),
],
)