const CommentItem = ({ comment, onReply, level = 0 }) => {
  const indentClass = level > 0 && level < 3 ? 'ml-6 md:ml-8   pl-2 md:pl-4' : '';

  return (
    <div className={`mb-2 mt-2 ${indentClass}`}>
      <div className="flex gap-2">
        <img src={comment.photo} className="w-8 h-8 rounded-lg bg-gray-300 dark:bg-gray-600 flex-shrink-0 mt-1"/>

        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-2.5 rounded-lg shadow-sm">
            <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 flex items-center">
              { comment.author_name }

              {comment.is_accessible && <span className="ml-2 bg-primary-600 text-white text-[9px] px-1.5   rounded">OFFICIEL</span>}
            </h4>
            <span className="text-[10px] text-gray-600 dark:text-gray-400">{comment.created_at}</span>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.body}</p>
          </div>

          <button onClick={() => onReply(comment.id,  comment.author_name)} className="text-[12px] font-semibold text-gray-500 hover:text-primary-600 mt-1.5 ml-1 transition-colors">
            Répondre
          </button>
        </div>
      </div>


      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-1 mt-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
