'use server'
import { createServerComponentClient } from "@/components/CreateServerComponentClient";
import { redirect } from "next/navigation";
import FinishRegistrationForm from "./form";

export default async function FinishRegistration() {
    const supabase = createServerComponentClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect('/login')
    }

    return (
        <FinishRegistrationForm session={session} />
    )
}