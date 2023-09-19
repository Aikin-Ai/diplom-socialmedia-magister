import ImageURLTransformer from "@/components/ImageURLTransformer";
import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function NewPost({ user, avatar_url }: { user: User, avatar_url: string | null }) {
    const addPost = async (formData: FormData) => {
        'use server'
        const content = String(formData.get('content'))
        const supabase = createServerActionClient<Database>({ cookies })
        await supabase.from('posts').insert({ content, user_id: user.id })
    }

    return (
        <form className="border border-gray-800 border-t-0" action={addPost}>
            <div className="flex py-8 px-4">
                <div className="h-12 w-12">
                    <Image src={ImageURLTransformer({ bucket_name: 'avatars', image_url: avatar_url }) ?? '/Profile_avatar_placeholder_large.png'}
                        alt="user avatar"
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                </div>
                <input name="content"
                    className="bg-inherit flex-1 ml-2 text-2xl text leading-loose placeholder-gray-500 px-2"
                    placeholder="Що відбувається?!" />
            </div>
        </form>
    )
}