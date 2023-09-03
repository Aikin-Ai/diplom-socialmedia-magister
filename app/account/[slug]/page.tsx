import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccountForm from "./account-form";

export default async function Account({ params }: { params: { slug: string } }) {
    const supabase = createServerComponentClient<Database>({ cookies });

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    console.log(params);

    return (
        <div>
            <AccountForm session={session} />
        </div>
    )
}