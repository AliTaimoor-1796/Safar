import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  createElement as originalCreateElement,
} from 'react';

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

// ✅ Monkey patch React.createElement for logging string elements
if (__DEV__) {
  const ReactAny = React as any;
  if (!ReactAny._patchedForTextWarning) {
    ReactAny.createElement = function patchedCreateElement(type: any, ...rest: any[]) {
      if (typeof type === 'string' && /^[a-z]/.test(type)) {
        // Normal host components like View, Text etc.
      } else if (typeof type === 'string') {
        // ⚠️ Invalid! Someone trying to render a string directly
        console.log(
          '⚠️ Detected attempt to render plain text without <Text>:',
          type
        );
      }
      return originalCreateElement(type, ...rest);
    };
    ReactAny._patchedForTextWarning = true;
  }
}

// ✅ Context provider
const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
