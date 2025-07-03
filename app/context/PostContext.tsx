import React, { createContext, useState, useContext } from 'react';

// Post type with optional image, video, likes, comments
export type Post = {
  id: string;
  user: string;
  description?: string;
  location?: string;
  image?: string;
  video?: string;
  likes?: number;
  comments?: number;
};

type PostContextType = {
  posts: Post[];
  addPost: (post: Post) => void;
};

// ✅ Creating the actual context
const PostContext = createContext<PostContextType>({
  posts: [],
  addPost: () => {},
});

// ✅ Context provider
const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <PostContext.Provider value={{ posts, addPost }}>
      {children}
    </PostContext.Provider>
  );
};

// ✅ Hook to use the Post context
const usePosts = () => useContext(PostContext);

// ✅ Export everything needed
export { PostContext, PostProvider, usePosts };
