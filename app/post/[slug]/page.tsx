'use client'
import Posts from "@/app/posts/posts"
import Sidebar from "@/app/sidebar/sidebar"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import { redirect, useRouter } from "next/navigation"
import { useCallback } from "react"

export default async function PostPage({ params }: { params: { slug: string } }) {
    const router = useRouter()

    const onClick = useCallback(() => {
        router.back()
    }, [router])

    const supabase = createClientComponentClient<Database>()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    const postid = params.slug

    const { data } = await supabase
        .from("posts")
        .select("*, author: profiles(*), likes(user_id), reposts(user_id), bookmarks(user_id), images(user_id, image_url)")
        .eq('id', postid)

    if (!data) {
        redirect('/404')
    }

    const posts = data?.map(post => ({
        ...post,
        author: Array.isArray(post.author) ? post.author[0] : post.author,
        user_has_liked_post: !!post.likes.find(
            (like) => like.user_id === session.user.id
        ),
        user_has_reposted_post: !!post.reposts.find(
            (repost) => repost.user_id === session.user.id
        ),
        user_has_bookmarked_post: !!post.bookmarks.find(
            (bookmark) => bookmark.user_id === session.user.id
        ),
        likes: post.likes.length,
        reposts: post.reposts.length,
        bookmarks: post.bookmarks.length,
        image_url: post.images[0]?.image_url
    })) ?? [];

    const { data: current_user_data } = await supabase
        .from("profiles")
        .select(`avatar_url, username`)
        .eq('id', session.user.id)
        .single()

    return (
        <div className="flex">
            <Sidebar current_user_data={current_user_data} />
            <div className="text-white w-full max-w-xl mr-auto ml-4 min-w-[600px]">
                <div className="flex justify-between px-4 py-6 border border-gray-800 border-t-0">
                    <Image
                        src="/Coat_of_arms_of_Kharkiv.svg"
                        width={25}
                        height={25}
                        alt="Kharkiv"
                    ></Image>
                    {/* <h1 className="text-xl font-bold ml-2">{group_info?.group_name}</h1> */}
                    <button
                        className="rounded-full"
                        onClick={onClick}
                    >
                        <Image
                            src='/arrow-left.svg'
                            width={25}
                            height={25}
                            alt="back"
                        />
                    </button>
                </div>
                <Posts posts={posts} />
            </div>
        </div>
    )
}