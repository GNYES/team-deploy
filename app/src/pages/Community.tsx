import { useState } from 'react';
import { useUserStore, useCommunityStore } from '@/stores';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function Community() {
  const user = useUserStore((s) => s.user);
  const posts = useCommunityStore((s) => s.posts);
  const addPost = useCommunityStore((s) => s.addPost);
  const toggleLike = useCommunityStore((s) => s.toggleLike);
  
  const [newPost, setNewPost] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handlePost = () => {
    if (!newPost.trim() || !user) return;
    addPost(user.id, user.name, newPost);
    setNewPost('');
    setShowInput(false);
  };

  return (
    <div className="pb-4">
      <div className="card mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
            {user?.name[0] || 'U'}
          </div>
          <button
            onClick={() => setShowInput(true)}
            className="flex-1 text-left px-4 py-2.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
          >
            分享你的动态...
          </button>
        </div>
        
        {showInput && (
          <div className="mt-4 animate-in slide-in-from-top-2">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="分享你的铺设心得..."
              className="input-field resize-none h-24 mb-3"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowInput(false)} className="btn-secondary flex-1">
                取消
              </button>
              <button onClick={handlePost} className="btn-primary flex-1">
                发布
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                {post.userName[0]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{post.userName}</p>
                <p className="text-xs text-slate-400">{post.createdAt}</p>
              </div>
            </div>
            
            <p className="text-slate-700 mb-4 leading-relaxed">{post.content}</p>
            
            <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.liked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                }`}
              >
                {post.liked ? (
                  <HeartIconSolid className="w-5 h-5" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-slate-400 hover:text-blue-500 transition-colors">
                <ChatBubbleLeftIcon className="w-5 h-5" />
                <span className="text-sm">{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
