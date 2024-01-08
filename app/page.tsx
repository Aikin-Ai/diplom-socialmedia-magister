import { createServerComponentClient } from "@/components/CreateServerComponentClient";
import { Session, SupabaseClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import NewPost from "./posts/new-post";
import Posts from "./posts/posts";
import Sidebar from "./sidebar/sidebar";

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createServerComponentClient();

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  let post_type = 'all'

  if (Array.isArray(searchParams.post_type)) {
    post_type = searchParams.post_type[0]
  } else if (searchParams.post_type) {
    post_type = searchParams.post_type
  }

  const { data } = await DataChooser({
    post_type: post_type,
    supabase,
    session
  })

  const { data: current_user_data } = await supabase
    .from("profiles")
    .select(`avatar_url, username`)
    .eq('id', session.user.id)
    .single()

  if (current_user_data?.username === null) {
    redirect("/finishregistration")
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
        <NewPost user={session.user} avatar_url={current_user_data?.avatar_url ?? null} group_id={null} parent_post={null} />
        <PostSwitch current_post_type={post_type} />
        <Posts posts={posts} />
      </div>
    </div>
  )
}

function PostSwitch({ current_post_type }: { current_post_type: string }) {
  return (
    <div className="flex justify-evenly">
      <Link
        className={`border border-gray-800 border-t-0 flex-1 text-center ${current_post_type === 'all' ? 'border-b-blue-500' : ''} hover:bg-btn-background-hover`}
        href={{
          pathname: "/",
          query: {
            post_type: "all"
          }
        }}
      >
        Всі пости
      </Link>
      <Link
        className={`border border-gray-800 border-t-0 flex-1 text-center ${current_post_type === 'subscribed_groups' ? 'border-b-blue-500' : ''} hover:bg-btn-background-hover`}
        href={{
          pathname: "/",
          query: {
            post_type: "subscribed_groups"
          }
        }}
      >
        Ваші підписки
      </Link>
    </div>
  )
}

async function DataChooser({
  post_type,
  supabase,
  session
}: {
  post_type: string;
  supabase: SupabaseClient<Database>;
  session: Session
}) {
  if (post_type === 'subscribed_groups') {
    const { data: users_groups } = await supabase
      .from('group-profile')
      .select('group_id')
      .eq('user_id', session.user.id)

    var group_ids: string[] = []

    if (!users_groups) {
      group_ids = []
    } else {
      users_groups?.map((group) => {
        group_ids.push(group.group_id)
      })
    }

    return supabase
      .from("posts")
      .select("*, author: profiles(*), likes(user_id), reposts(user_id), bookmarks(user_id), images(user_id, image_url)")
      .in('group_id', group_ids)
      .is('parent_post', null)
      .order("created_at", { ascending: false })

  } else {
    return supabase
      .from("posts")
      .select("*, author: profiles(*), likes(user_id), reposts(user_id), bookmarks(user_id), images(user_id, image_url)")
      .is('group_id', null)
      .is('parent_post', null)
      .order("created_at", { ascending: false })
  }
}