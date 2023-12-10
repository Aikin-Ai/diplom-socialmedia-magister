import ImageURLTransformer from "@/components/ImageURLTransformer";
import Image from "next/image";
export default function GroupInfo({ group_info, group_members }: {
    group_info: {
        group_name: string;
        description: string | null;
        avatar_url: string | null;
    },
    group_members: {
        id: string;
        username: string | null;
        avatar_url: string | null;
    }[] | null
}) {
    return (
        <div className="text-white h-full mr-auto flex flex-col">
            <div className="p-1 border border-gray-800">
                <Image
                    className="rounded-full"
                    src={ImageURLTransformer({ bucket_name: 'avatars', image_url: group_info.avatar_url }) ?? '/Profile_avatar_placeholder_large.png'}
                    alt="group avatar"
                    width={150}
                    height={150}
                />
            </div>
            <div className="p-1 border border-gray-800 text-xl font-bold flex justify-center">
                {group_info.group_name}
            </div>
            <div className="p-1 border border-gray-800">
                {group_info.description}
            </div>
            <div className="font-bold p-1 border border-gray-800">
                Учасників: {group_members ? group_members.length : 0}
            </div>
            <div className="p-1 border border-gray-800">
                <div className="flex justify-between flex-wrap">
                    {group_members?.map((member) => (
                        <div key={member.id} className="p-1 flex flex-col items-center">
                            <Image
                                className="rounded-full"
                                src={ImageURLTransformer({ bucket_name: 'avatars', image_url: member.avatar_url }) ?? '/Profile_avatar_placeholder_large.png'}
                                alt="group member avatar"
                                width={50}
                                height={50}
                            />
                            <div className="text-sm">{member.username}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}