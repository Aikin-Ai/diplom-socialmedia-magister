import { Database as DB } from '@/lib/database.types';

type Post = DB['public']['Tables']['posts']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

declare global {
    type Database = DB
    type PostWithAuthor = Post & {
        author: Profile;
        likes: number;
        user_has_liked: boolean;
    }
    type Profile = Database['public']['Tables']['profiles']['Row']
}