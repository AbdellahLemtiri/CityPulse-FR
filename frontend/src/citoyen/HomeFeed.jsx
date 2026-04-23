import { useState, useEffect, useRef } from 'react';
import axiosClient from '../config/axios-client';
<<<<<<< HEAD
import { ScrollText, ArrowBigLeftDash, ArrowBigRightDash, Copy, SendHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
=======
import { ScrollText, ArrowBigLeftDash, ArrowBigRightDash} from 'lucide-react';

>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
import CommentItem from './CommentItem.jsx';
import { useStateContext } from '../contexts/ContextProvider';
export default function HomeFeed() {
  const { user } = useStateContext();
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
  const [seeLink, setSeeLink] = useState(null);
  const [link, setLink] = useState(null);
  const [slugActual, setSlugActual] = useState(null);
  const tabs = ['Tout', 'Officiel', 'Quartier'];
  const [fullscreenImage, setFullscreenImage] = useState(null);
<<<<<<< HEAD
  const [isFetchComment, setIsFetchComment] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

=======
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
  const ImageCarousel = ({ images, onImageClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const nextImage = (e) => {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e) => {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    return (
      <div className="   bg-gray-100 dark:bg-gray-800 relative group overflow-hidden flex items-center justify-center">
        <img src={images[currentIndex]} onClick={() => onImageClick(images[currentIndex])} className="max-w-full max-h-full object-contain cursor-pointer" alt={`Post image ${currentIndex + 1}`} />

        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowBigLeftDash />{' '}
            </button>

            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowBigRightDash />{' '}
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-110' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

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
      // console.log(selectTab);
      // console.log(typeParam);
<<<<<<< HEAD
      const response = await axiosClient.get('/articles', { params: { type: typeParam, page: pageNum , search: searchQuery} });
=======
      const response = await axiosClient.get('/articles', { params: { type: typeParam, page: pageNum } });
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
      console.log(typeParam);

      const metaData = response.data.meta;
      const dataArticles = response.data.data;

      if (isLoadMore) {
        setPosts((prev) => [...prev, ...dataArticles]);
      } else {
        setPosts(dataArticles);
      }

      setHasMore(metaData.current_page < metaData.last_page);
      setPage(metaData.current_page);
    } catch (error) {
      console.error('123', error);
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
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
<<<<<<< HEAD
    toast.success('Lien copié avec succès !');
=======
    // toast.success("Lien copié avec succès !"); // Kay-tle3 l-Toast
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
    setSeeLink(false);
  };
  const handlLikeart = (clickedPost) => {
    const updatedPosts = posts.map((p) => {
      if (p.id === clickedPost.id) {
        return {
          ...p,
          is_liked: !p.is_liked,
          likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1,
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
      const updatedPosts = posts.map((p) => {
        if (p.id === clickedPost.id) {
          return {
            ...p,
            is_liked: !p.is_liked,
            likes_count: p.is_liked ? p.likes_count + 1 : p.likes_count - 1,
          };
        }
        return p;
      });
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
    setIsFetchComment(true);
    try {
      if (openCommentsId === postId) {
        setOpenCommentsId(null);
      } else {
        setOpenCommentsId(postId);

        let response = await axiosClient.get(`/comments?commentable_type=Article&commentable_id=${postId}`);

        setComments(response.data.data);
        // console.log(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchComment(false);
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
      console.log(response.data.comment);

      setCommentText('');
      setReplyingToId(null);

      if (!replyingToId) {
        setComments((prev) => [response.data.comment, ...prev]);

        setPosts(posts.map((p) => (p.id === articleId ? { ...p, comment_count: p.comment_count + 1 } : p)));
      } else {
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === replyingToId) {
              return {
                ...comment,
                replies: [response.data.comment, ...(comment.replies || [])],
              };
            }
            return comment;
          }),
        );
      }
    } catch (error) {
      console.error('err99999 :', error);
    }
  };
  const handleShare = (slug) => {
    setSlugActual(slug);
    const shareUrl = `${window.location.origin}/article/${slug}`;
    setLink(shareUrl);
    setSeeLink(true);
<<<<<<< HEAD
  };
  // console.log(comments);
=======

    // navigator.clipboard.writeText(shareUrl);

    // toast.success("Lien de l'article copié !");
  };
  console.log(comments);
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8

  const hiddLinkDiv = () => {
    setLink(null);
    setSeeLink(null);
    setSlugActual(null);
  };
<<<<<<< HEAD

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
         fetchFeed();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);
=======
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
  return (
    <>
      <div className="sticky relative     w-full top-[40px] md:top-[64px] z-30 rounded-b-lg pt-2 pb-2 px-2 md:px-0 mb-4 bg-gray-50 dark:bg-gray-800">
        {' '}
        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg grid grid-cols-5 gap-2 font-bold text-sm   border border-gray-200 dark:border-gray-700">
          <div className="col-span-2  ">
            <input type="text" placeholder="Rechercher" onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} className="w-full p-2 rounded-lg w-75 outline-none border border-gray-200 dark:border-gray-500 dark:focus:border-primary-500 focus:border-primary-500 bg-gray-100 dark:bg-gray-700 dark:text-white " />
          </div>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                {
                  setActiveTab(tab);
                  setArticles([]);
                  setComments([]);
                }
              }}
              className={`flex-1 py-1.5 rounded-lg   ${activeTab === tab ? 'bg-primary-100 dark:bg-primary-600/20 dark:text-primary-100 dark:primary-500 text-gray-500   ' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50  dark:hover:bg-gray-700 '}`}>
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
            <ScrollText className="text-gray-500 dark:text-gray-400 " />
            Aucune actualité trouvée pour le mement .
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <div key={post.id} className="relative bg-white dark:bg-gray-800 px-1.5 md:rounded-lg border-y md:border border-gray-200 dark:border-gray-700 mb-6">
                <div className="p-4 flex items-center gap-3">
                  <img src={post.author_avatar} className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 flex items-center justify-center overflow-hidden" />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{post.author_name}</h3>

                      {post.sector_id === null && (
                        <span className="material-symbols-outlined text-primary-500 text-[16px]" title="Compte Officiel">
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

                {post.images && post.images.length > 0 && <ImageCarousel images={post.images} onImageClick={(clickedImageUrl) => setFullscreenImage(clickedImageUrl)} />}
                <div className="flex items-center   pt-1.5  text-sm  grid grid-cols-3">
                  <button className="  ">
                    <span className={`text-gray-400   rounded-xl `}>{post.likes_count}</span>
                  </button>
                  <button className="  ">
                    <span className={`text-gray-400   rounded-xl `}>{post.comments_count}</span>
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

                  <button
                    onClick={() => {
                      (setComments([]), handleFetchComments(post.id));
                    }}
                    className="flex-1  flex items-center justify-center gap-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg  group">
                    <span className="material-symbols-outlined  ">comment</span>
                  </button>

                  <button onClick={() => handleShare(post.slug)} className="flex-1 flex items-center justify-center gap-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700  rounded-lg  group">
                    <span className="material-symbols-outlined   ">share</span>
                  </button>
                </div>
                {seeLink && slugActual === post.slug && (
<<<<<<< HEAD
                  <div className="absolute bottom-16 right-0 mt-2 w-72 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 animate-fade-in-up">
=======
                  <div className="absolute bottom-32 right-0 mt-2 w-72 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 animate-fade-in-up">
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                    <button onClick={hiddLinkDiv} className="flex items-center justify-end">
                      <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">close</span>
                    </button>
                    <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Lien de l'article :</span>

                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-1.5 border border-gray-200 dark:border-gray-700">
                      <input type="text" value={link} className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 px-2 outline-none truncate" readOnly />

                      <button onClick={handleCopyLink} className="flex items-center justify-center w-8 h-8 rounded-md bg-white dark:bg-gray-800 text-gray-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 border border-gray-200 dark:border-gray-700 transition-all active:scale-95" title="Copier le lien">
<<<<<<< HEAD
                        <Copy />
=======
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                      </button>
                    </div>
                  </div>
                )}
                {openCommentsId === post.id && (
                  <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 p-4 animate-fade-in rounded-b-lg">
                    <div className="space-y-4 mb-4  overflow-y-auto no-scrollbar">
                      {isFetchComment ? (
                        <div className="flex justify-center py-10">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        </div>
                      ) : comments.length === 0 ? (
                        <div className="text-center text-gray-500 py-4 text-sm">Aucun commentaire pour l'instant. Soyez le premier !</div>
                      ) : (
                        comments.map((comment) => <CommentItem key={comment.id} comment={comment} onReply={handleReplyClick} />)
                      )}
                    </div>

                    <div className="flex gap-2 items-center mt-2 relative flex-col">
                      {replyingToId && (
                        <div className="w-full text-[11px] text-primary-600 flex justify-between px-2 mb-1 bg-primary-50/50 rounded-t-md py-1">
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
                        <input
                          ref={commentInputRef}
                          value={commentText}
                          onChange={(e) => {
                            setCommentText(e.target.value);
                            if (e.target.value === '') setReplyingToId(null);
                          }}
                          type="text"
                          placeholder="Écrire un commentaire...."
                          className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm   focus:outline-none dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600 shadow-sm"
                        />
                        <button onClick={() => handleSendComment(post.id)} disabled={!commentText.trim()} className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-800 disabled:text-gray-400 w-8 h-8 flex items-center justify-center rounded-lg transition-colors">
                          <SendHorizontal />
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

        {fullscreenImage && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setFullscreenImage(null)}>
            <button className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full transition-colors" onClick={() => setFullscreenImage(null)}>
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <img src={fullscreenImage} alt="Fullscreen" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </div>
        )}
      </div>
    </>
  );
}
