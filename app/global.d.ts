import { Database as DB } from '@/lib/database.types';

type Post = DB['public']['Tables']['posts']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

declare global {
    type Database = DB
    type PostWithAuthor = Post & {
        author: Profile;
        likes: number;
        reposts: number;
        bookmarks: number;
        image_url: string | null;
        user_has_liked_post: boolean;
        user_has_reposted_post: boolean;
        user_has_bookmarked_post: boolean;
    }
    type Profile = Database['public']['Tables']['profiles']['Row']
}