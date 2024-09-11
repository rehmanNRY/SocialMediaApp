import PostForm from "@/components/feed/posts/PostForm";
import PostList from "@/components/feed/posts/PostList";

export default function Home() {
  return (
    <main className="bg-[#F5F6FA] mx-auto p-4 space-y-6 w-full">
      <div className="flex mb-4">
        <ul className="flex gap-2">
          <li className="border border-indigo-400 font-semibold text-indigo-900 bg-indigo-100 text-sm rounded-full px-4 py-1 hover:bg-indigo-200 transition">
            <a href="/">#Trending</a>
          </li>
          <li className="border border-indigo-400 font-semibold text-indigo-900 bg-indigo-100 text-sm rounded-full px-4 py-1 hover:bg-indigo-200 transition">
            <a href="/">#Dev</a>
          </li>
          <li className="border border-indigo-400 font-semibold text-indigo-900 bg-indigo-100 text-sm rounded-full px-4 py-1 hover:bg-indigo-200 transition">
            <a href="/">#Trees</a>
          </li>
          <li className="border border-indigo-400 font-semibold text-indigo-900 bg-indigo-100 text-sm rounded-full px-4 py-1 hover:bg-indigo-200 transition">
            <a href="/">#Nature</a>
          </li>
        </ul>
      </div>
      <PostForm />
      <PostList />
    </main>
  );
}