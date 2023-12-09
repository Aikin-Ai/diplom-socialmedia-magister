'use client';

import ImageURLTransformer from "@/components/ImageURLTransformer";
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Groups({ groups, session, user_groups }: {
    groups: Group[]; session: Session; user_groups: string[]
}) {
    const supabase = createClientComponentClient<Database>();
    const user = session.user

    const router = useRouter()

    async function JoinGroup(id: string) {
        const { data, error } = await supabase
            .from('group-profile')
            .insert({ group_id: id, user_id: user.id })
            .select()
        if (error) {
            console.error(error)
        }
        router.refresh()
    }

    async function LeaveGroup(id: string) {
        const { data, error } = await supabase
            .from('group-profile')
            .delete()
            .eq('group_id', id)
            .eq('user_id', user.id)
        if (error) {
            console.error(error)
        }
        router.refresh()
    }

    return groups.map((group) => (
        <div key={group.id} className="border border-gray-800 border-t-0 px-4 py-8 flex">
            <div className="h-12 w-12">
                <Image
                    className="rounded-full"
                    src={ImageURLTransformer({ bucket_name: 'avatars', image_url: group.avatar_url }) ?? '/Profile_avatar_placeholder_large.png'}
                    alt="group avatar"
                    width={48}
                    height={48}
                />
            </div>
            <div className="ml-4 flex flex-col flex-grow-[1] justify-center">
                <div className="flex items-center">
                    <span className="font-bold">{group.group_name}</span>
                </div>
                <p>{group.description}</p>
            </div>
            <div className="flex">
                {
                    user_groups.includes(group.id) ? (
                        <button
                            className="bg-blue-500 hover:bg-red-600 text-foreground font-bold py-2 px-4 my-1 mx-1 rounded border"
                            onClick={() => LeaveGroup(group.id)}
                        >
                            Покинути
                        </button>
                    ) : (
                        <button
                            className="bg-gray-500 hover:bg-blue-500 text-foreground font-bold py-2 px-2 my-1 mx-1 rounded"
                            onClick={() => JoinGroup(group.id)}
                        >Приєднатись</button>
                    )
                }
                <button
                    className="bg-transparent hover:bg-btn-background-hover text-foreground font-bold py-2 px-4 my-1 mx-1 rounded border"
                    onClick={() => router.push(`/group/${group.id}`)}
                >Відкрити</button>
            </div>
        </div>
    ))
}