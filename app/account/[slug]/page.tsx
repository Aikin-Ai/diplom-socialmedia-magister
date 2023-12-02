import Posts from "@/app/posts/posts";
import Sidebar from "@/app/sidebar/sidebar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import AccountForm from "./account-form";
import AccountPage from "./account-page";

export default async function Account({ params }: { params: { slug: string } }) {

    const supabase = createServerComponentClient<Database>({ cookies });

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    //get userid from slug
    const { data: userid } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', params.slug)

    if (!userid || !userid[0]?.id) {
        redirect('/404')
    }

    const is_current_user = session.user.id === userid[0].id

    //get posts and reposts of user
    const { data: userPostsIds } = await supabase
        .from('posts')
        .select('id')
        .eq('user_id', userid[0].id)

    const { data: userRepostIds } = await supabase
        .from('reposts')
        .select('post_id')
        .eq('user_id', userid[0].id)

    //merge posts and reposts ids
    const merge = (a: string[], b: string[], predicate = (a: any, b: any) => a === b) => {
        const c = [...a];
        b.forEach((bItem: string) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)));
        return c;
    }

    const postsIds = userPostsIds?.map(post => post.id)
    const repostIds = userRepostIds?.map(post => post.post_id)
    let allPostsIds: any = []
    if (!postsIds && !repostIds) {
        allPostsIds = []
    } else if (!postsIds && repostIds) {
        allPostsIds = repostIds
    } else if (!repostIds && postsIds) {
        allPostsIds = postsIds
    } else if (postsIds && repostIds) {
        allPostsIds = merge(postsIds, repostIds)
    }

    //show all posts and reposts of user
    const { data } = await supabase
        .from("posts")
        .select("*, author: profiles(*), likes(user_id), reposts(user_id), bookmarks(user_id), images(user_id, image_url)")
        .in('id', allPostsIds)
        .order("created_at", { ascending: false })

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
                <div className="flex justify-start px-4 py-6 border border-gray-800 border-t-0">
                    <Image
                        src="/Coat_of_arms_of_Kharkiv.svg"
                        width={25}
                        height={25}
                        alt="Kharkiv"
                    ></Image>
                    <h1 className="text-xl font-bold ml-2">Профіль</h1>
                </div>
                {/* <button>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="stroke-gray-500">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button> */}
                {is_current_user ? (
                    <AccountForm session={session} />
                ) : (
                    <AccountPage user_id={userid[0].id} />
                )}
                <Posts posts={posts} />
            </div>
        </div>
    )
}