// 1. KAN-SAYBOU COMPOSANT SGHIR KAY-RSEM COMMENTAIRE WA7ED
const CommentItem = ({ comment }) => {
  return (
    <div className="mb-2">
      {/* L-Design d-l-Commentaire */}
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 mt-1">
           {/* Hna nqdero n-dirou t-tswira */}
        </div>
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-2.5 rounded-2xl rounded-tl-none shadow-sm">
            <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">
              {comment.author_name}
              {comment.is_accessible && <span className="ml-1 bg-blue-600 text-white text-[8px] px-1 rounded-sm">OFFICIEL</span>}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{comment.body}</p>
          </div>
          <button className="text-[11px] font-bold text-gray-500 hover:text-blue-600 mt-1 ml-2 transition-colors">
            Répondre
          </button>
        </div>
      </div>

      {/* 2. LA RÉCURSIVITÉ (S-SER HNA) */}
      {/* Ila had l-commentaire 3ndo replies, ghadi n-3eytou 3la nfs l-composant weste rasso! */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 ml-8 border-l-2 border-gray-100 dark:border-gray-700 pl-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};