'use client'
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import Messages from "../login/messages";
export default function FinishRegistrationForm({ session }: { session: Session }) {
    const supabase = createClientComponentClient<Database>()
    const user = session.user

    async function updateProfile() {
        const usernameInput = document.querySelector('input[name="username"]') as HTMLInputElement;
        const fullNameInput = document.querySelector('input[name="full_name"]') as HTMLInputElement;

        const username = usernameInput.value;
        const fullName = fullNameInput.value;

        try {
            let { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user?.id as string,
                    full_name: fullName,
                    username: username,
                    updated_at: new Date().toISOString(),
                })
            if (error) throw error
            redirect('/')
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <form
                className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
            >
                <Messages />
                <label className="text-md" htmlFor="username">
                    Ім'я користувача
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    name="username"
                    placeholder="IvanIvanovich"
                    required
                />
                <label className="text-md" htmlFor="full_name">
                    Повне ім'я
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    name="full_name"
                    placeholder="Ivan Ivanovich"
                    required
                />
                <button className="bg-green-700 rounded px-4 py-2 text-white mb-2"
                    onClick={() => updateProfile()}>
                    Підтвердити
                </button>
            </form>
        </div>
    )
}