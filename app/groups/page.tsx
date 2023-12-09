import { createServerComponentClient } from '@/components/CreateServerComponentClient';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Sidebar from '../sidebar/sidebar';
import Groups from './groups';
import NewGroup from './new-group';

export default async function GroupsList() {
    const supabase = createServerComponentClient();

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    const { data: current_user_data } = await supabase
        .from("profiles")
        .select(`avatar_url, username`)
        .eq('id', session.user.id)
        .single()

    const { data: groups } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false })

    const { data: user_groups } = await supabase
        .from('group-profile')
        .select('group_id')
        .eq('user_id', session.user.id)

    var users_groups: string[] = []

    user_groups?.map((group) => {
        users_groups.push(group.group_id)
    })

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
                    <h1 className="text-xl font-bold ml-2">Групи</h1>
                </div>
                <NewGroup />
                {groups && <Groups groups={groups} session={session} user_groups={users_groups} />}
            </div>
        </div>
    )
}