import { createServerActionClient } from "@/components/CreateServerActionClient"
import { revalidatePath } from "next/cache"
export default function NewGroup() {

    const addGroup = async (formData: FormData) => {
        'use server'
        const name = String(formData.get('name'))
        const description = String(formData.get('description'))
        const image = formData.get('image')
        const supabase = createServerActionClient()
        const { data, error } = await supabase.from('groups').insert({ group_name: name, description }).select()
        if (error) {
            console.error(error)
        }
        if (data && (image as File).size !== 0) {
            const fileExt = (image as File).name.split('.').pop()
            const { data: imageid, error } = await supabase.storage.from('avatars').upload(`groups/${data[0].id}.${fileExt}`, image as File)
            if (error) {
                console.error(error)
            }
            if (imageid) {
                const { data: temp, error } = await supabase.from('groups')
                    .update({ avatar_url: imageid.path })
                    .eq('id', data[0].id)
                    .select()
                if (error) {
                    console.error(error)
                }
            }
        }
        revalidatePath('/groups')
        // const number = Math.random()
        // redirect(`/groups?${number}`)
    }
    return (
        <form className="border border-gray-800 border-t-0" action={addGroup}>
            <div className="flex py-2 px-4 text-2xl font-bold">
                Створити групу
            </div>
            <div className="flex flex-col">
                <input
                    name="name"
                    type="text"
                    placeholder="Назва"
                    className="bg-inherit flex-1 mx-2 text-2xl text leading-loose placeholder-gray-500 px-2 border border-gray-800 rounded my-1"
                    required
                />
                <input
                    name="description"
                    type="text"
                    placeholder="Опис (не обов'язково)"
                    className="bg-inherit flex-1 mx-2 text-2xl text leading-loose placeholder-gray-500 px-2 border border-gray-800 rounded my-1"
                />
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
                <button
                    type="submit"
                    className="bg-transparent border hover:bg-btn-background-hover text-foreground font-bold mt-1 mb-2 mx-2 rounded"
                >
                    Створити
                </button>
            </div>
        </form>
    )
}