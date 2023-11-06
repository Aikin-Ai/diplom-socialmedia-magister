import UserMentionLink from "@/components/UserMentionLink"

export default function PostContent({ post }: { post: PostWithAuthor }) {
    const contentWithMentions = post.content.split(/@(\w+)/g).map((match, index) => {
        if (index % 2 === 1) {
            return <UserMentionLink key={match} username={match} />
        }
        return match
    })
    return (
        <div>{contentWithMentions}</div>
    )
}