'use client'
import ImageURLTransformer from "@/components/ImageURLTransformer";
import Image from "next/image";
import { useState } from "react";

export default function ImageWithModal({ image_url }: { image_url: string }) {
    const [showModal, setShowModal] = useState(false)
    return (
        <>
            <Image
                src={ImageURLTransformer({ bucket_name: 'Images', image_url: image_url }) ?? '/Profile_avatar_placeholder_large.png'}
                alt="Зображення публікації"
                width={400}
                height={400}
                className="aspect-video object-cover rounded-xl my-2 hover:cursor-pointer"
                onClick={() => setShowModal(true)}
            />
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        onClick={() => setShowModal(false)}
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/* content */}
                            <div>
                                <Image
                                    src={ImageURLTransformer({ bucket_name: 'Images', image_url: image_url }) ?? '/Profile_avatar_placeholder_large.png'}
                                    alt="Зображення публікації"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-full h-auto hover:cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="opacity-75 fixed inset-0 z-40 bg-black" />
                </>
            ) : null}
        </>
    )
}