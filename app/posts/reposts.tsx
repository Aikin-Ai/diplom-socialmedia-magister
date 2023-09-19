'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Reposts({ post, addOptimisticPost }: {
    post: PostWithAuthor;
    addOptimisticPost: (newPost: PostWithAuthor) => void
}) {
    const router = useRouter()
    const handleReposts = async () => {
        const supabase = createClientComponentClient<Database>()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            if (post.user_has_reposted_post) {
                addOptimisticPost({
                    ...post,
                    reposts: post.reposts - 1,
                    user_has_reposted_post: !post.user_has_reposted_post,
                });
                await supabase
                    .from('reposts')
                    .delete()
                    .match({ user_id: user.id, post_id: post.id })
            } else {
                addOptimisticPost({
                    ...post,
                    reposts: post.reposts + 1,
                    user_has_reposted_post: !post.user_has_reposted_post,
                });
                await supabase
                    .from('reposts')
                    .insert({ user_id: user.id, post_id: post.id })
            }
            router.refresh()
        }
    }
    return <button onClick={handleReposts} className="group flex items-center">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`group-hover:fill-green-500 group-hover:stroke-green-500 ${post.user_has_reposted_post ? "fill-green-500 stroke-green-500" : "fill-none stroke-gray-500"}`}>
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
        </svg>
        <span
            className={`ml-2 text-sm group-hover:text-green-500 ${post.user_has_reposted_post ?
                'text-green-500' : 'text-gray-500'}`}
        >
            {post.reposts}
        </span>
    </button>
}