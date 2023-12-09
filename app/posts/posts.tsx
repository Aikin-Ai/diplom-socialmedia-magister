'use client'

import ImageURLTransformer from "@/components/ImageURLTransformer";
import Labels from "@/components/Labels";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { format, formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, experimental_useOptimistic as useOptimistic, useState } from "react";
import Bookmarks from "./bookmarks";
import Comments from "./comments";
import ImageWithModal from "./image-with-modal";
import Likes from "./likes";
import PostContent from "./post-content";
import Reposts from "./reposts";

export default function Posts({ posts }: { posts: PostWithAuthor[] }) {
    const [isClient, setIsClient] = useState(false)
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

    useEffect(() => {
        setIsClient(true)
    }, [])

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        if (now.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
            return formatDistanceToNow(date, { locale: uk })
        } else if (now.getFullYear() === date.getFullYear()) {
            return format(date, 'd MMM', { locale: uk })
        } else {
            return format(date, 'd MMM y', { locale: uk })
        }
    }

    return optimisticPosts.map((post) => (
        <div key={post.id} className="border border-gray-800 border-t-0 px-4 py-8 flex">
            <div className="h-12 w-12">
                <Link
                    href={`/account/${post.author.username}`}
                >
                    <Image
                        className="rounded-full"
                        src={ImageURLTransformer({ bucket_name: 'avatars', image_url: post.author.avatar_url }) ?? '/Profile_avatar_placeholder_large.png'}
                        alt="user avatar"
                        width={48}
                        height={48}
                    />
                </Link>
            </div>
            <div className="ml-4 flex flex-col flex-grow-[1]">
                <div className="flex items-center">
                    <span className="font-bold">{post.author.full_name}</span>
                    <div>
                        {post.author.user_label && (
                            <Labels label={post.author.user_label} />
                        )}
                    </div>
                    <span className="text-sm ml-1 text-gray-400">
                        <Link
                            href={`/account/${post.author.username}`}
                            className="hover:underline hover:text-blue-500"
                        >
                            @{post.author.username}
                        </Link>
                    </span>
                    <div className="text-sm ml-1 text-gray-400">
                        - {formatDate(post.created_at)}
                    </div>
                </div>
                <p>{isClient ? <PostContent post={post} /> : post.content}</p>
                {post.image_url && <ImageWithModal image_url={post.image_url} />}
                <div className="flex justify-between">
                    <Likes post={post} addOptimisticPost={addOptimisticPost} />
                    <Bookmarks post={post} addOptimisticPost={addOptimisticPost} />
                    <Reposts post={post} addOptimisticPost={addOptimisticPost} />
                    <Comments />
                </div>
            </div>
        </div>
    ))
}