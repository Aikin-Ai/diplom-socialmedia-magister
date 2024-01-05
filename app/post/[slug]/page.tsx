// 'use client'
import NewPost from "@/app/posts/new-post"
import Posts from "@/app/posts/posts"
import Sidebar from "@/app/sidebar/sidebar"
import { createServerComponentClient } from "@/components/CreateServerComponentClient"
import Image from "next/image"
import { redirect } from "next/navigation"
import BackButton from "./back-button"

export default async function PostPage({ params }: { params: { slug: string } }) {
    const supabase = createServerComponentClient()
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

    const { data: comments_data } = await supabase
        .from("posts")
        .select("*, author: profiles(*), likes(user_id), reposts(user_id), bookmarks(user_id), images(user_id, image_url)")
        .eq('parent_post', postid)
        .order("created_at", { ascending: false })

    var comments = null

    if (comments_data) {
        comments = comments_data?.map(post => ({
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
    }

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
                    <BackButton />
                </div>
                <Posts posts={posts} />
                <NewPost user={session.user} avatar_url={current_user_data?.avatar_url ?? null} group_id={null} parent_post={postid} />
                {comments && <Posts posts={comments} />}
            </div>
        </div>
    )
}