import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
// import { formatDistanceToNow } from "date-fns";
// import { fr } from "date-fns/locale";
import CommentItem from './CommentItem.jsx';
export default function HomeFeed() {
  const [activeTab, setActiveTab] = useState('Tout');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
   const [openCommentsId, setOpenCommentsId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [comments, setComments] = useState([{}]);
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchFeed(activeTab, 1, false);
  }, [activeTab]);

  const fetchFeed = async (category, pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let typeParam = 'tout';
      if (category === 'Officiel') typeParam = 'office';
      if (category === 'Quartier') typeParam = 'quartier';
      const response = await axiosClient.get(`/articles?type=${typeParam}&page=${pageNum}`);
      const metaData = response.data.meta;
      const rawData = response.data.data;
      const formattedPosts = rawData.map((post) => {
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          scope: post.scope,
          status: post.status,
          image_url: post.image_url ? post.image_url : null,
          created_at: post.created_at,
          is_liked: post.is_liked,
          sector_name: post.sector_name,
          comment_count: post.comments_count,
          like_count: post.likes_count,
          author_name: post.author_name,
        };
      });
      if (isLoadMore) {
        setPosts((prev) => [...prev, ...formattedPosts]);
      } else {
        setPosts(formattedPosts);
      }

      setHasMore(metaData.current_page < metaData.last_page);
      setPage(metaData.current_page);
    } catch (error) {
      console.error('Erreur fetch feed:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchFeed(activeTab, page + 1, true);
    }
  };

  const tabs = ['Tout', 'Officiel', 'Quartier'];

  const handlLikeart = (clickedPost) => {
    const updatedPosts = posts.map((p) => {
      if (p.id === clickedPost.id) {
        return {
          ...p,
          is_liked: !p.is_liked,
          like_count: p.is_liked ? p.like_count - 1 : p.like_count + 1,
        };
      }
      return p;
    });

    setPosts(updatedPosts);

    let data = new FormData();

    data.append('likeable_type', 'Article');
    data.append('likeable_id', clickedPost.id);
    try {
      axiosClient.post(`/likes/toggle`, data);
    } catch (error) {
      console.log(error);
    }
  };

  async function handleFetchComments(postId) {
    try {
      if (openCommentsId === postId) {
        setOpenCommentsId(null);
      } else {
        setOpenCommentsId(postId);

        let response = await axiosClient.get(`/comments?commentable_type=Article&commentable_id=${postId}`);

        setComments(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSendComment(postId){
    try {
      let data = new FormData();
      data.append('commentable_type', 'Article');
      data.append('commentable_id', postId);
      data.append('body', commentText);

      console.log(commentText+'ddezd');
      await axiosClient.post('/comments', data);
      setCommentText('');
    } catch (error) {
      console.log(error);
    }
  };
  console.log(comments);
  return (
    <>
      <div className="sticky relative  w-full top-[60px] md:top-[64px] z-30 rounded-b-lg pt-2 pb-2 px-2 md:px-0 mb-4 bg-gray-50 dark:bg-gray-800">
        {' '}
        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg flex font-bold text-sm shadow-sm border border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-1.5 rounded-lg   ${activeTab === tab ? 'bg-primary-100 dark:bg-primary-600/20 dark:text-primary-100 dark:primary-500 text-gray-500   ' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50  '}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 pb-20 md:pb-0 ">
        {loading && page === 1 ? (
          <div className="text-center py-10">
            <span className="material-symbols-outlined animate-spin text-blue-500 text-4xl">autorenew</span>
            <p className="text-gray-500 mt-2">Chargement de l'actualité...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300">
            <span className="material-symbols-outlined text-4xl mb-2 text-gray-400 block">article</span>
            Aucune actualité trouvée pour la catégorie "{activeTab}".
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 px-1.5 md:rounded-lg border-y md:border border-gray-200 dark:border-gray-700 mb-6">
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-gray-500">account_circle</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{post.author_name || 'Utilisateur'}</h3>

                      {post.sector_id === null && (
                        <span className="material-symbols-outlined text-blue-500 text-[16px]" title="Compte Officiel">
                          verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="px-4 pb-3">
                  <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>

                <div className=" w-full h-64 md:h-80 bg-gray-100 dark:bg-gray-700 relative cursor-pointer">
                  <img src={post.image_url} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" alt="Post" />
                </div>
                <div className="flex items-center justify-between  grid grid-cols-3">
                  <button className="  ">
                    <span className={`text-gray-500   rounded-xl `}>{post.like_count}</span>
                  </button>
                </div>

                <div className="px-2 py-1 flex justify-between border-t border-gray-200 dark:border-gray-700 mt-2">
                  <button onClick={() => handlLikeart(post)} className=" hover:bg-gray-50 dark:hover:bg-gray-700  dark:border-gray-100 flex-1  flex items-center justify-center   py-1 text-gray-500 dark:text-gray-400  rounded-lg  group">
                    <button className={`rounded-xl    mr-2 px-2 ${post.is_liked ? 'text-green-500 dark:bg-primary-500/20  ' : 'text-gray-500  '}  `}>
                      <span className={`   material-symbols-outlined ${post.is_liked ? 'text-green-500    ' : 'text-gray-500  '}`}>check</span>
                    </button>
                    {'  '}
                  </button>

                  <button onClick={() => handleFetchComments(post.id)} className="flex-1  flex items-center justify-center gap-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg  group">
                    <span className="material-symbols-outlined  ">comment</span>
                    {post.comments_count || 0}
                  </button>

                  <button className="flex-1 flex items-center justify-center gap-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700  rounded-lg  group">
                    <span className="material-symbols-outlined   ">share</span>
                  </button>
                </div>

                {openCommentsId === post.id && (
                  <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 p-4 animate-fade-in rounded-b-2xl">
                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto no-scrollbar">
                      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto no-scrollbar">
                        {comments.length === 0 ? (
                          <div className="text-center text-gray-500 py-4 text-sm">Aucun commentaire pour l'instant. Soyez le premier !</div>
                        ) : (
                          comments.map((comment) => (
                          <CommentItem key={comment.id} comment={comment} />
                          ))
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 items-center mt-2 relative">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                      <input value={commentText} onChange={ (e) => setCommentText(e.target.value)}  type="text" placeholder="Écrire un commentaire..." className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm" />
                      <button onClick={() => handleSendComment(openCommentsId)} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 w-8 h-8 flex items-center justify-center rounded-full transition-colors">
                        <span className="material-symbols-outlined text-[20px]">send</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {hasMore && (
              <div className="text-center py-4">
                <button onClick={handleLoadMore} disabled={loadingMore} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2 px-6 rounded-full text-sm  disabled:opacity-50 flex items-center justify-center mx-auto gap-2">
                  {loadingMore ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>
                      Chargement...
                    </>
                  ) : (
                    "Afficher plus d'actualités"
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* --- SECTION COMMENTAIRES INLINE --- */}
      </div>
    </>
  );
}
