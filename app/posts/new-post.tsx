import { createServerActionClient } from "@/components/CreateServerActionClient";
import ImageURLTransformer from "@/components/ImageURLTransformer";
import { User } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function NewPost({ user, avatar_url }: { user: User, avatar_url: string | null }) {
    const addPost = async (formData: FormData) => {
        'use server'
        const content = String(formData.get('content'))
        const image = formData.get('image')
        const supabase = createServerActionClient()
        const { data, error } = await supabase.from('posts').insert({ content, user_id: user.id }).select()
        if (error) {
            console.error(error)
        }
        if (data && (image as File).size !== 0) {
            const fileExt = (image as File).name.split('.').pop()
            const { data: imageid, error } = await supabase.storage.from('Images').upload(`posts/${data[0].id}.${fileExt}`, image as File)
            if (error) {
                console.error(error)
            }
            if (imageid) {
                const { error } = await supabase.from('images').insert({ image_url: imageid.path, post_id: data[0].id, user_id: user.id })
                if (error) {
                    console.error(error)
                }
            }
        }
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
                <div className="flex flex-col">
                    <input name="content"
                        className="bg-inherit flex-1 ml-2 text-2xl text leading-loose placeholder-gray-500 px-2"
                        placeholder="Що відбувається?!"
                        required />
                    <label className="cursor-pointer group ml-2 px-2"
                        htmlFor="single">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="group-hover:stroke-blue-500 stroke-gray-500">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </label>
                    <input
                        name="image"
                        className="hidden"
                        type="file"
                        id="single"
                        accept="image/*"
                    />
                </div>
            </div>
        </form>
    )
}