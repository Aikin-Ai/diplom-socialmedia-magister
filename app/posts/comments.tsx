'use client'

import Link from "next/link"

export default function Comments({ id }: { id: string }) {
    return <Link href={`/post/${id}`} className="group flex items-center">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="stroke-gray-500 group-hover:fill-blue-500 group-hover:stroke-blue-500 ">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span
            className={`ml-2 text-sm group-hover:text-blue-500 text-gray-500`}
        >
            {/* {post.comments} */}
            2
        </span>
    </Link>
}