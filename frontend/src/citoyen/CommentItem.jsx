 
const CommentItem = ({ comment, onReply, level = 0 }) => { // 👈 Zidna onReply w level
  return (
    <div className={`mb-2 mt-2 ${level > 0 && level < 2 ? "ml-8 border-l-2 border-gray-100 dark:border-gray-700 pl-2" : ""}`}>
       <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 mt-1"></div>
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-2.5 rounded-2xl rounded-tl-none shadow-sm">
            <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">
              {comment.author_name}
              {comment.is_accessible && <span className="ml-1 bg-blue-600 text-white text-[8px] px-1 rounded-sm">OFFICIEL</span>}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{comment.body}</p>
          </div>
          
           <button 
            onClick={() => onReply(comment.id, comment.author_name)}
            className="text-[11px] font-bold text-gray-500 hover:text-blue-600 mt-1 ml-2 transition-colors"
          >
            Répondre
          </button>
        </div>
      </div>
 
       {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-1 mt-2">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              onReply={onReply}  
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default CommentItem;