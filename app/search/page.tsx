import { createServerComponentClient } from "@/components/CreateServerComponentClient";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import Posts from "../posts/posts";
import Sidebar from "../sidebar/sidebar";
import SearchBox from "./searchBox";

export default async function Search({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const supabase = createServerComponentClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    let search_query = ''

    if (Array.isArray(searchParams.search_query)) {
        search_query = searchParams.search_query[0]
    } else if (searchParams.search_query) {
        search_query = searchParams.search_query
    }

    // const { data } = await supabase
    //     .from("posts")
    //     .select("*, author: profiles(*), likes(user_id), reposts(user_id), bookmarks(user_id), images(user_id, image_url)")
    //     .textSearch('content', search_query)
    //     .order("created_at", { ascending: false })

    const { data } = await SearchChooser({
        search_query,
        supabase
    })

    const { data: current_user_data } = await supabase
        .from("profiles")
        .select(`avatar_url, username`)
        .eq('id', session.user.id)
        .single()

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

    return (
        <div className="flex">
            <Sidebar current_user_data={current_user_data} />
            <div className="text-white w-full max-w-xl mr-auto ml-4 min-w-[600px]">
                <div className="flex justify-start px-4 py-6 border border-gray-800 border-t-0">
                    <Image
                        src="/Coat_of_arms_of_Kharkiv.svg"
                        width={25}
                        height={25}
                        alt="Kharkiv"
                    ></Image>
                    <h1 className="text-xl font-bold ml-2">Домашня сторінка</h1>
                </div>
                <SearchBox previousSearchQuery={search_query} />
                <Posts posts={posts} />
            </div>
        </div>
    )
}

async function SearchChooser({
    search_query,
    supabase
}: {
    search_query: string,
    supabase: SupabaseClient<Database>;
}) {
    if (search_query.startsWith('@')) {
        const query = search_query.slice(1)
        const { data: users } = await supabase
            .from('profiles')
            .select('id')
            .textSearch('username', search_query)

        var user_ids: string[] = []

        if (!users) {
            user_ids = []
        } else {
            users?.map((user) => {
                user_ids.push(user.id)
            })
        }

        return supabase
            .from("posts")
            .select("*, author: profiles(*), likes(user_id), reposts(user_id), bookmarks(user_id), images(user_id, image_url)")
            .in('user_id', user_ids)
            .order("created_at", { ascending: false })
    } else {
        return supabase
            .from("posts")
            .select("*, author: profiles(*), likes(user_id), reposts(user_id), bookmarks(user_id), images(user_id, image_url)")
            .textSearch('content', search_query)
            .order("created_at", { ascending: false })
    }
}