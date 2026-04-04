import { useState, useEffect, useRef } from 'react';
import axiosClient from '../config/axios-client';
import { ScrollText } from 'lucide-react';

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
  const [replyingToId, setReplyingToId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [comments, setComments] = useState([]);
  const commentInputRef = useRef(null);
  const tabs = ['Tout', 'Officiel', 'Quartier'];
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchFeed(activeTab, 1, false);
  }, [activeTab]);

  const fetchFeed = async (selectTab, pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    let typeParam = 'tout';
    if (selectTab === 'Officiel') {
      typeParam = 'global';
    }
    if (selectTab === 'Quartier') {
      typeParam = 'local';
    }
    let type = typeParam;
    try {
      console.log(selectTab);
      console.log(typeParam);
      const response = await axiosClient.get('/articles', { params: { type: typeParam, page: pageNum } });
      console.log(typeParam);

      const metaData = response.data.meta;
      const rawData = response.data.data;
      const formattedPosts = rawData.map((post) => {
        return {
          id: post.id,
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
  const handleReplyClick = (commentId, authorName) => {
    setReplyingToId(commentId);
    setCommentText(`@${authorName}  `);

    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 10);
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
  const handleSendComment = async (articleId) => {
    if (!commentText.trim()) return;
    try {
      const payload = {
        commentable_type: 'Article',
        commentable_id: articleId,
        body: commentText,
        parent_id: replyingToId,
      };

      const response = await axiosClient.post('/comments', payload);

      setCommentText('');
      setReplyingToId(null);

      if (!replyingToId) {
        setComments((prev) => [response.data.comment, ...prev]);

        console.log(response.data.comment);
        setPosts(posts.map((p) => (p.id === articleId ? { ...p, comment_count: p.comment_count + 1 } : p)));
      } else {
        // handleFetchComments(articleId);
      }
    } catch (error) {
      console.error('Mouchkil :', error);
    }
  };
  console.log(comments);
  return (
    <>
      <div className="sticky relative  w-full top-[60px] md:top-[64px] z-30 rounded-b-lg pt-2 pb-2 px-2 md:px-0 mb-4 bg-gray-50 dark:bg-gray-800">
        {' '}
        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg flex font-bold text-sm shadow-sm border border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
              }}
              className={`flex-1 py-1.5 rounded-lg   ${activeTab === tab ? 'bg-primary-100 dark:bg-primary-600/20 dark:text-primary-100 dark:primary-500 text-gray-500   ' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50  '}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 pb-20 md:pb-0 ">
        {loading && page === 1 ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center flex justify-center gap-4 py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-lg    ">
            <ScrollText className='text-gray-500 dark:text-gray-400 ' />
            Aucune actualité trouvée pour le mement .
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 px-1.5 md:rounded-lg border-y md:border border-gray-200 dark:border-gray-700 mb-6">
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 flex items-center justify-center overflow-hidden">
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
                    <p className="text-xs text-gray-500 flex items-center gap-1">{post.created_at}</p>
                  </div>
                </div>

                <div className="px-4 pb-3">
                  <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>

                <div className=" w-full h-64 md:h-80 bg-gray-100 dark:bg-gray-700 relative cursor-pointer">
                  <img src={post.image_url} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" alt="Post" />
                </div>
                <div className="flex items-center   pt-1.5  text-sm  grid grid-cols-3">
                  <button className="  ">
                    <span className={`text-gray-400   rounded-xl `}>{post.like_count}</span>
                  </button>
                  <button className="  ">
                    <span className={`text-gray-400   rounded-xl `}>{post.comment_count}</span>
                  </button>{' '}
                  <button className="  ">
                    <span className={`text-gray-400   rounded-xl `}>...</span>
                  </button>
                </div>

                <div className="px-2 py-1 flex justify-between border-t border-gray-200 dark:border-gray-700 mt-2">
                  <button onClick={() => handlLikeart(post)} className=" hover:bg-gray-50 dark:hover:bg-gray-700  dark:border-gray-100 flex-1  flex items-center justify-center   py-1 text-gray-500 dark:text-gray-400  rounded-lg  group">
                    <span className={`rounded-xl    mr-2 px-2 ${post.is_liked ? 'text-green-500 dark:bg-primary-500/20  ' : 'text-gray-500  '}  `}>
                      <span className={`   material-symbols-outlined ${post.is_liked ? 'text-green-500    ' : 'text-gray-500  '}`}>check</span>
                    </span>
                    {'  '}
                  </button>

                  <button onClick={() => handleFetchComments(post.id)} className="flex-1  flex items-center justify-center gap-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg  group">
                    <span className="material-symbols-outlined  ">comment</span>
                  </button>

                  <button className="flex-1 flex items-center justify-center gap-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700  rounded-lg  group">
                    <span className="material-symbols-outlined   ">share</span>
                  </button>
                </div>

                {openCommentsId === post.id && (
                  <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 p-4 animate-fade-in rounded-b-lg">
                    <div className="space-y-4 mb-4  overflow-y-auto no-scrollbar">{comments.length === 0 ? <div className="text-center text-gray-500 py-4 text-sm">Aucun commentaire pour l'instant. Soyez le premier !</div> : comments.map((comment) => <CommentItem key={comment.id} comment={comment} onReply={handleReplyClick} />)}</div>

                    <div className="flex gap-2 items-center mt-2 relative flex-col">
                      {replyingToId && (
                        <div className="w-full text-[11px] text-blue-600 flex justify-between px-2 mb-1 bg-blue-50/50 rounded-t-md py-1">
                          <span>En réponse à un commentaire...</span>
                          <button
                            onClick={() => {
                              setReplyingToId(null);
                              setCommentText('');
                            }}
                            className="font-bold hover:text-red-500">
                            Annuler
                          </button>
                        </div>
                      )}

                      <div className="flex w-full gap-2 relative items-center">
                        <div className="w-8 h-8 rounded-lg bg-gray-300 flex-shrink-0"></div>
                        <input
                          ref={commentInputRef}
                          value={commentText}
                          onChange={(e) => {
                            setCommentText(e.target.value);
                            if (e.target.value === '') setReplyingToId(null);
                          }}
                          type="text"
                          placeholder="Écrire un commentaire...."
                          className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                        />
                        <button onClick={() => handleSendComment(post.id)} disabled={!commentText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 w-8 h-8 flex items-center justify-center rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {hasMore && (
              <div className="text-center py-4">
                <button onClick={handleLoadMore} disabled={loadingMore} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2 px-6 rounded-lg text-sm  disabled:opacity-50 flex items-center justify-center mx-auto gap-2">
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
      </div>
    </>
  );
}
