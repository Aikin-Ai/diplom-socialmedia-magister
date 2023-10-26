'use client'

import ImageURLTransformer from "@/components/ImageURLTransformer";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import Bookmarks from "./bookmarks";
import Likes from "./likes";
import Reposts from "./reposts";

export default function Posts({ posts }: { posts: PostWithAuthor[] }) {
    const [optimisticPosts, addOptimisticPost] = useOptimistic<
        PostWithAuthor[],
        PostWithAuthor
    >(
        posts,
        (currentOptimisticPosts, newPost) => {
            const newOptimisticPosts = [...currentOptimisticPosts]
            const index = newOptimisticPosts.findIndex(
                (post) => post.id === newPost.id
            )
            newOptimisticPosts[index] = newPost;
            return newOptimisticPosts
        }
    );

    const supabase = createClientComponentClient<Database>();
    const router = useRouter()

    useEffect(() => {
        const channel = supabase
            .channel('realtime posts')
            .on(
                'postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'posts',
            }, (payload) => {
                router.refresh()
            }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, router])

    return optimisticPosts.map((post) => (
        <div key={post.id} className="border border-gray-800 border-t-0 px-4 py-8 flex">
            <div className="h-12 w-12">
                <Image
                    className="rounded-full"
                    src={ImageURLTransformer({ bucket_name: 'avatars', image_url: post.author.avatar_url }) ?? '/Profile_avatar_placeholder_large.png'}
                    alt="user avatar"
                    width={48}
                    height={48}
                />
            </div>
            <div className="ml-4">
                <p>
                    <span className="font-bold">{post.author.full_name}</span>
                    <span className="text-sm ml-2 text-gray-400">@{post.author.username}</span>
                </p>
                <p>{post.content}</p>
                <div className="flex justify-between">
                    <Likes post={post} addOptimisticPost={addOptimisticPost} />
                    <Bookmarks post={post} addOptimisticPost={addOptimisticPost} />
                    <Reposts post={post} addOptimisticPost={addOptimisticPost} />
                </div>
            </div>
        </div>
    ))
}