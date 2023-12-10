import NewPost from "@/app/posts/new-post";
import Posts from "@/app/posts/posts";
import Sidebar from "@/app/sidebar/sidebar";
import { createServerComponentClient } from "@/components/CreateServerComponentClient";
import Image from "next/image";
import { redirect } from "next/navigation";
import GroupInfo from "./group-info";

export default async function Group({ params }: { params: { slug: string } }) {

    const supabase = createServerComponentClient();

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    const groupid = params.slug

    const { data: group_info } = await supabase
        .from('groups')
        .select('group_name, description, avatar_url')
        .eq('id', groupid)
        .single()

    if (!group_info) {
        redirect('/404')
    }

    const { data } = await supabase
        .from("posts")
        .select("*, author: profiles(*), likes(user_id), reposts(user_id), bookmarks(user_id), images(user_id, image_url)")
        .eq('group_id', groupid)
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

    const { data: group_member_id } = await supabase
        .from('group-profile')
        .select('user_id')
        .eq('group_id', groupid)

    let group_member_ids = group_member_id?.map(member => member.user_id)

    if (!group_member_ids) {
        group_member_ids = []
    }

    const { data: group_members } = await supabase
        .from('profiles')
        .select(`id, avatar_url, username`)
        .in('id', group_member_ids)

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
                    <h1 className="text-xl font-bold ml-2">{group_info?.group_name}</h1>
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
                <NewPost user={session.user} avatar_url={current_user_data?.avatar_url ?? null} group_id={groupid} />
                <Posts posts={posts} />
            </div>
            <div className="w-1/6">
                <GroupInfo group_info={group_info} group_members={group_members} />
            </div>
        </div>
    )
}