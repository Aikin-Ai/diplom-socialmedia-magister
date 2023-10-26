'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Bookmarks({ post, addOptimisticPost }: {
    post: PostWithAuthor;
    addOptimisticPost: (newPost: PostWithAuthor) => void
}) {
    const router = useRouter()
    const handleBookmarks = async () => {
        const supabase = createClientComponentClient<Database>()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            if (post.user_has_bookmarked_post) {
                addOptimisticPost({
                    ...post,
                    bookmarks: post.bookmarks - 1,
                    user_has_bookmarked_post: !post.user_has_bookmarked_post,
                });
                await supabase
                    .from('bookmarks')
                    .delete()
                    .match({ user_id: user.id, post_id: post.id })
            } else {
                addOptimisticPost({
                    ...post,
                    bookmarks: post.bookmarks + 1,
                    user_has_bookmarked_post: !post.user_has_bookmarked_post,
                });
                await supabase
                    .from('bookmarks')
                    .insert({ user_id: user.id, post_id: post.id })
            }
            router.refresh()
        }
    }
    return <button onClick={handleBookmarks} className="group flex items-center">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`group-hover:fill-blue-500 group-hover:stroke-blue-500 ${post.user_has_bookmarked_post ? " fill-blue-500 stroke-blue-500" : "fill-none stroke-gray-500"}`}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <span
            className={`ml-2 text-sm group-hover:text-blue-500 ${post.user_has_bookmarked_post ?
                'text-blue-500' : 'text-gray-500'}`}
        >
            {post.bookmarks}
        </span>
    </button>
}