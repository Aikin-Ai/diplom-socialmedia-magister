import Link from "next/link";

export default function UserMentionLink({ username }: { username: string }) {
    return (
        <Link
            href={`/account/${username}`}
            className="text-blue-500 hover:underline"
        >
            @{username}
        </Link>
    )
}