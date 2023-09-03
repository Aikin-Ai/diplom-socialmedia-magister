import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function ImageURLTransformer({ bucket_name, image_url }: { bucket_name: string, image_url: string | null }) {
    if (!image_url) return null
    const supabase = createClientComponentClient<Database>()
    const { data } = supabase.storage.from(`${bucket_name}`).getPublicUrl(image_url)
    return (data.publicUrl)
}