<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreCommentRequest;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //


    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommentRequest $request)
    {
        $UserId = Auth::id();
        $data = $request->validated();
        $modelClass = 'App\\Models\\' . $data['commentable_type'];
        $model = $modelClass::findOrFail($data['commentable_id']);
        $comment = $model->comments()->create([
            'user_id' => $UserId,
            'body'    => $data['body'],
        ]);

        return response()->json([
            'message' => 'Commentaire ajouté',
            'comment' => $comment->load('user')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
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
