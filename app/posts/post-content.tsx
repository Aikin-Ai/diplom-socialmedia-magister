import UserMentionLink from "@/components/UserMentionLink"
import Link from "next/link"

export default function PostContent({ post }: { post: PostWithAuthor }) {
    const contentWithMentionsAndHashtags = post.content.split(/@(\w+)|#(\w+)/g).map((match, index) => {
        if (match === undefined) {
            return ''
        }
        if (index % 3 === 1) {
            return <UserMentionLink key={match} username={match} />
        } else if (index % 3 === 2) {
            return <Link
                key={match}
                href={`/search?search_query=${'%23' + match}`}
                className="text-blue-500 hover:underline"
            >
                #{match}
            </Link>
        } else {
            return match
        }
    })
    const cleanContentWithMentionsAndHashtags = contentWithMentionsAndHashtags.filter((content) => content !== '')
    return (
        <div>{cleanContentWithMentionsAndHashtags}</div>
    )
}