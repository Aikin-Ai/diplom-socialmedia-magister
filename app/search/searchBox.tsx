export default function SearchBox() {
    return (
        <form action="/search" method="get" className="w-full flex flex-col items-center border border-gray-800 border-t-0">
            <input name="search_query" type="text" className="border-2 border-gray-800 m-1 bg-inherit rounded-lg h-10 px-5 pr-16 text-sm focus:outline-none" placeholder="Пошук..." />
        </form>
    )
}