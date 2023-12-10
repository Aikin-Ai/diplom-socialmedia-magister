import LogoutButton from "@/components/LogoutButton";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar({ current_user_data }: { current_user_data: any }) {
    return (
        <div className="sticky top-0 text-white h-full ml-auto text-xl flex flex-col pr-5">
            <div className="my-1">
                <Link
                    href={"/"}
                    className="flex"
                >
                    <div className="py-2 px-2 cursor-pointer hover:bg-btn-background rounded-xl flex flex-nowrap">
                        <Image
                            className="mr-2"
                            src="/home.svg"
                            width={20}
                            height={20}
                            alt="home"
                        ></Image>
                        Головна
                    </div>
                </Link></div>
            <div className="my-1">
                <Link
                    href={"/search"}
                    className="flex"
                >
                    <div className="py-2 px-2 cursor-pointer hover:bg-btn-background rounded-xl flex flex-nowrap">
                        <Image
                            className="mr-2"
                            src="/search.svg"
                            width={20}
                            height={20}
                            alt="search"
                        ></Image>
                        Пошук
                    </div>
                </Link>
            </div>
            <div className="my-1">
                <Link
                    href={"/groups"}
                    className="flex">
                    <div className="py-2 px-2 cursor-pointer hover:bg-btn-background rounded-xl flex flex-nowrap">
                        <Image
                            className="mr-2"
                            src="/users.svg"
                            width={20}
                            height={20}
                            alt="home"
                        ></Image>
                        Групи
                    </div>
                </Link></div>
            <div className="my-1 w-44">
                <Link
                    href={"/messages"}
                    className="flex">
                    <div className="py-2 px-2 cursor-pointer hover:bg-btn-background rounded-xl flex flex-nowrap">
                        <Image
                            className="mr-2"
                            src="/mail.svg"
                            width={20}
                            height={20}
                            alt="home"
                        ></Image>
                        Повідомлення
                    </div>
                </Link></div>
            <div className="my-1">
                <Link
                    href={"/bookmarks"}
                    className="flex">
                    <div className="py-2 px-2 cursor-pointer hover:bg-btn-background rounded-xl flex flex-nowrap">
                        <Image
                            className="mr-2"
                            src="/bookmark.svg"
                            width={20}
                            height={20}
                            alt="home"
                        ></Image>
                        Закладки
                    </div>
                </Link></div>
            <div className="my-1">
                <Link
                    href={"/subscription"}
                    className="flex">
                    <div className="py-2 px-2 cursor-pointer hover:bg-btn-background rounded-xl flex flex-nowrap">
                        <Image
                            className="mr-2"
                            src="/star.svg"
                            width={20}
                            height={20}
                            alt="home"
                        ></Image>
                        Premium
                    </div>
                </Link></div>
            <div className="my-1">
                <Link
                    href={"/account/" + current_user_data?.username}
                    className="flex">
                    <div className="py-2 px-2 cursor-pointer hover:bg-btn-background rounded-xl flex flex-nowrap">
                        <Image
                            className="mr-2"
                            src="/user.svg"
                            width={20}
                            height={20}
                            alt="home"
                        ></Image>
                        Профіль
                    </div>
                </Link>
            </div>
            <div className="my-1">
                <LogoutButton />
            </div>
        </div>
    )
}