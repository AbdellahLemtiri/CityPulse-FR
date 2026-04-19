<?php

namespace App\Http\Controllers;

use App\Http\Requests\comment\getCommentRequest;
use App\Models\Comment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\comment\CommentResorse;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(getCommentRequest $request)
    {
        $data = $request->validated();
        $modelType = 'App\\Models\\' . class_basename($data['commentable_type']);
        $modelId = $data['commentable_id'];
        $comments = Comment::where('commentable_id', $modelId)->where('commentable_type', $modelType)->whereNull('parent_id')
            ->with([
                'user:id,first_name,last_name',
                'replies'
            ])
            ->latest()
            ->paginate(100);
        $totalCount = Comment::where('commentable_id', $modelId)
            ->where('commentable_type', $modelType)
            ->count();
        return CommentResorse::collection($comments)->additional([
            'meta' => [
                'total_all_comments' => $totalCount,
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommentRequest $request)
    {
        $UserId = Auth::id();
        $validated = $request->validated();
        $modelClass = 'App\\Models\\' . $validated['commentable_type'];
        $model = $modelClass::findOrFail($validated['commentable_id']);
        $comment = $model->comments()->create([
            'user_id'   => $UserId,
            'body'      => $validated['body'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);
        return response()->json([
            'comment'   => new CommentResorse($comment->load('user')), 
            'parent_id' => $comment->parent_id
        ], 201);
    }

    /**
     * Display the specified resource.
     */

    public function destroy(Comment $comment)
    {
        $UserId = Auth::id();
        if ($UserId !== $comment->user_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        $comment->delete();
        return response()->json(['message' => 'Commentaire supprimé'], 200);
    }
}
