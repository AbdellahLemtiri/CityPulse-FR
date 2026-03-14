<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //  
        $posts = Post::with(['user', 'media'])
            ->withCount(['likes', 'comments'])
            ->where('status', 'published')
            ->where('is_approved', true)
            ->latest()
            ->paginate(10);

        return response()->json($posts, 200);
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
    public function store(Request $request)
    {
        // Validation inline (T9der t-khrjha l FormRequest b7al li derti f Article)
        $data = $request->validate([
            'caption'  => 'required|string',
            'location' => 'nullable|string|max:255',
            'status'   => 'required|in:draft,published',
            'photo'    => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data['user_id'] =Auth::id();
        $post = Post::create($data);
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('posts', 'public');
            $post->media()->create([
                'file_path' => $path,
                'file_type' => 'image',
                'is_public' => true,
            ]);
        }
        return response()->json([
            'message' => 'Post créé avec succès',
            'post'    => $post->load('media')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
        return response()->json($post->load(['user', 'media', 'comments.user']), 200);
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
    public function update(Request $request, Post $post)
    {
        Gate::authorize('update', $post);

        $data = $request->validate([
            'caption'  => 'sometimes|string',
            'location' => 'nullable|string|max:255',
            'status'   => 'sometimes|in:draft,published',
        ]);

        $post->update($data);

        return response()->json(['message' => 'Post modifié avec succès', 'post' => $post], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        Gate::authorize('delete', $post);

        $post->delete();

        return response()->json(['message' => 'Post supprimé avec succès'], 200);
    }
}
