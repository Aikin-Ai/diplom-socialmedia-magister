import { createServerActionClient } from "@/components/CreateServerActionClient"
export default function NewGroup() {
    const addGroup = async (formData: FormData) => {
        'use server'
        const name = String(formData.get('name'))
        const description = String(formData.get('description'))
        const supabase = createServerActionClient()
        const { data, error } = await supabase.from('groups').insert({ group_name: name, description }).select()
        if (error) {
            console.error(error)
        }
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
                    required
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