import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default function Sidebar({ current_user_data }: { current_user_data: any }) {
    return (
        <div className="text-white h-full ml-auto text-xl flex flex-col">
            <div><Link href={"/"}>Головна</Link></div>
            <div><Link href={"/groups"}>Групи</Link></div>
            <div><Link href={"/messages"}>Приватні повідомлення</Link></div>
            <div><Link href={"/bookmarks"}>Закладки</Link></div>
            <div>
                <Link className="text-white" href={"/account/" + current_user_data?.username}>
                    Профіль
                </Link>
            </div>
            <LogoutButton />
        </div>
    )
}