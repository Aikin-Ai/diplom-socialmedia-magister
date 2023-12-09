'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Avatar({
    uid,
    url,
    size,
    onUpload,
}: {
    uid: string
    url: Profile['avatar_url']
    size: number
    onUpload: (url: string) => void
}) {
    const supabase = createClientComponentClient<Database>()
    const [avatarUrl, setAvatarUrl] = useState<Profile['avatar_url']>(url)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                const { data, error } = await supabase.storage.from('avatars').download(path)
                if (error) {
                    throw error
                }

                const url = URL.createObjectURL(data)
                setAvatarUrl(url)
            } catch (error) {
                console.error('Помилка завантаження зображення: ', error)
            }
        }

        if (url) downloadImage(url)
    }, [url, supabase])

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Ви повинні вибрати зображення для завантаження.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${uid}-${Math.random()}.${fileExt}`

            let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            onUpload(filePath)
        } catch (error) {
            console.error('Помилка завантаження аватара!')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            {avatarUrl ? (
                <Image
                    width={size}
                    height={size}
                    src={avatarUrl}
                    alt="Avatar"
                    className="rounded-full"
                // style={{ height: size, width: size }}
                />
            ) : (
                <div className="rounded-full bg-gray-700" style={{ height: size, width: size }} />
            )}
            <div style={{ width: size }}>
                <label className="cursor-pointer" htmlFor="single">
                    {uploading ? 'Завантаження...' : 'Завантажити'}
                </label>
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute'
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>
        </div>
    )
}