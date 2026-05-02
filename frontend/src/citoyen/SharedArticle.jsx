import { useParams, Link } from 'react-router-dom';
import axiosClient from '../config/axios-client';
import { useState, useEffect, useRef } from 'react';
import { ScrollText, ArrowBigLeftDash, ArrowBigRightDash } from 'lucide-react';

import CommentItem from './CommentItem.jsx';
export default function SharedArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get(`/articles/shared/${slug}`)
      .then((response) => {
        setArticle(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur:', error);
        setLoading(false);
      });
  }, [slug]);
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
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">error</span>
        <h1 className="text-2xl font-bold mb-2">Article introuvable</h1>
        <p className="text-gray-500 mb-6">Ce lien est peut-être expiré ou l'article a été supprimé.</p>
        <Link to="/" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-bold transition">
          Retour à SafiPulse
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white max-w-3xl justify-center h-full mx-auto dark:bg-gray-800 px-1.5 md:rounded-lg border-y md:border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img src={post.author_avatar} className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 flex items-center justify-center overflow-hidden" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">{article.author_name}</h3>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">{article.created_at}</p>
          </div>
        </div>

        <div className="px-4 pb-3">
          <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">{article.content}</p>
        </div>
        <>{article.images && article.images.length > 0 && <ImageCarousel images={article.images} onImageClick={(clickedImageUrl) => setFullscreenImage(clickedImageUrl)} />}</>
      </div>
      {fullscreenImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setFullscreenImage(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full transition-colors" onClick={() => setFullscreenImage(null)}>
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>

          <img src={fullscreenImage} alt="Fullscreen" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
