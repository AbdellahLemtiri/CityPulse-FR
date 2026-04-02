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
        //

        $data = $request->validated();

        $modelType = 'App\\Models\\' . class_basename($data['commentable_type']);
        $modelId = $data['commentable_id'];

        $comments = Comment::where('commentable_id', $modelId)->where('commentable_type', $modelType)->with([
            'user:id,first_name,last_name,role_id',
            'replies' => function ($query) {
                $query->with('user:id,first_name,last_name,role_id')
                    ->orderBy('created_at', 'asc');
            }
        ])->latest()->paginate(10);

        return CommentResorse::collection($comments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommentRequest $request)
    {
        $UserId = Auth::id();

        $modelClass = 'App\\Models\\' . $data['commentable_type'];
        $model = $modelClass::findOrFail($data['commentable_id']);
        $comment = $model->comments()->create([
            'user_id' => $UserId,
            'body'=> $data['body'],
            'parent_id' => $data['parent_id']?? 0,
        ]);


        return response()->json([
            'message' => 'Commentaire ajouté',
            'comment' => $comment->load('user'),$data['parent_id']??0 
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
