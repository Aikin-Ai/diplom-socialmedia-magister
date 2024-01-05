'use client'
import Image from "next/image";
export default function BackButton() {

    const onClick = () => {
        window.history.back();
    };

    return (
        <button
            className="rounded-full"
            onClick={onClick}
        >
            <Image
                src='/arrow-left.svg'
                width={25}
                height={25}
                alt="back"
            />
        </button>
    )
}