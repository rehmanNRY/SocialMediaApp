"use client"
import { Loading } from '@/components';
import PostCard from '@/components/feed/posts/PostCard'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BsFillPostcardFill } from 'react-icons/bs';

const page = ({ params }) => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/posts/${params.postId}`);
        setPost(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user details');
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.profileId]);

  if (loading) return <Loading />;
  if (error) return (
    <div className="flex flex-col items-center justify-center text-center p-10">
      <BsFillPostcardFill className="text-gray-300 text-6xl mb-4" />
      <p className="text-xl text-gray-500">No post.</p>
      <p className="text-sm text-gray-400 mt-2">
        Failed to fetch post details
      </p>
    </div>
  );

  return (
    <div className='px-6 py-12'>
      <PostCard post={post} />
    </div>
  )
}

export default page