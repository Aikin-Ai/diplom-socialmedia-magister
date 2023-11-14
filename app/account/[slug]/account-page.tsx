import ImageURLTransformer from "@/components/ImageURLTransformer";
import Labels from "@/components/Labels";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function AccountPage({ user_id }: { user_id: string }) {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data } = await supabase.from('profiles').select('*').eq('id', user_id).single()
    if (!data) {
        return (
            <div>
                <h1>404</h1>
            </div>
        )
    }
    const withHttp = (url: string) => !/^https?:\/\//i.test(url) ? `https://${url}` : url;
    return (
        <div className="border border-gray-800 border-t-0 border-r-0 border-l-0">
            <Image
                className="rounded-full"
                src={ImageURLTransformer({ bucket_name: 'avatars', image_url: data.avatar_url }) ?? '/Profile_avatar_placeholder_large.png'}
                alt="user avatar"
                width={150}
                height={150}
            />
            <div className="my-1 flex flex-col">
                {/* <p>Повне ім'я: {data.full_name}</p>
                <p>Ім'я користувача: {data.username}</p> */}
                <div className="flex items-center">
                    <span className="font-bold">{data.full_name}</span>
                    <div>
                        {data.user_label && (
                            <Labels label={data.user_label} />
                        )}
                    </div>
                    <span className="text-sm ml-1 text-gray-400">
                        <Link
                            href={`/account/${data.username}`}
                            className="hover:underline hover:text-blue-500"
                        >
                            @{data.username}
                        </Link>
                    </span>
                </div>
                {data.website && <p>
                    Веб-сайт: <a
                        className="hover:underline hover:text-blue-500"
                        href={withHttp(data.website)}
                    >
                        {data.website}
                    </a>
                </p>}
            </div>
        </div>
    )
}