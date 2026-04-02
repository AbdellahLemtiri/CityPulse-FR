<?php

namespace App\Http\Controllers;

use App\Http\Resources\Article\ArticleResource;
use Illuminate\Support\Facades\Auth;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\article\getDataRequest;
class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(getDataRequest $request)
    {
        $user = Auth::user();
        $req = $request->validated();
        $articles = Article::select('id', 'title', 'slug', 'content', 'created_at', 'user_id', 'sector_id', 'status', 'scope')
            ->with([
                'user:id,first_name,last_name',
                'sector:id,name',
                'media'
            ])->withCount(['likes', 'comments'])
            ->withExists(['likes as is_liked' => function ($q) {
                $q->where('user_id', Auth::id());
            }])->where('status', 'published');
        if ($req['type'] === 'local') {
            $articles->where('scope', 'local')->where('sector_id', $user->sector_id);
        }
        if ($req['type'] === 'global') {
            $articles->where('scope', 'global')->whereNull('sector_id');
        }
        $articles = $articles->latest()->paginate(5);
        return ArticleResource::collection($articles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticleRequest $request)
    {
        $user = Auth::user();
        $data = $request->validated();
        $data['user_id'] = $user->id;
        if ($user->role_id === 2) {
            $data['sector_id'] = $user->sector_id;
            if ($data['scope'] === 'global') {
                $data['sector_id'] = null;
            }
        }

        $data['slug'] = Str::slug($data['title']);
        $article = Article::create($data);
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('articles', 'public');
            $article->media()->create([
                'file_path' => $path,
                'file_type' => 'image',
                'is_public' => true,
            ]);
        }

        return response()->json([
            'message' => 'Article créé avec succès',
            'article' => $article->load('media')
        ], 201);
    }

    public function getArticleByEditor()
    {
        $user = Auth::user();

        $articles = Article::with(['media' => function ($query) {
            $query->latest();
        }])
            ->select('id', 'title', 'content', 'scope', 'status', 'created_at', 'user_id')
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);

        $articles->getCollection()->transform(function ($article) {
            $article->file_path = $article->media->first() ? $article->media->first()->file_path : null;
            unset($article->media);
            unset($article->user_id);
            return $article;
        });

        return response()->json($articles, 200);
    }


    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        return response()->json($article->load(['media', 'user', 'sector', 'comments.user']), 200);
    }

    public function showEditor($id)
    {
        $article = DB::table('articles')->leftJoin('media', function ($join) {
            $join->on('articles.id', '=', 'media.model_id')
                ->where('media.model_type', '=', 'App\Models\Article');
        })->select('articles.id', 'articles.title', 'articles.content', 'articles.scope', 'articles.status', 'media.file_path')
            ->where('articles.id', $id)
            ->first();

        return response()->json($article, 200);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticleRequest $request, Article $article)
    {
        Gate::authorize('update', $article);

        $user = Auth::user();
        $data = $request->validated();

        if (isset($data['title']) && $data['title'] !== $article->title) {
            $data['slug'] = Str::slug($data['title']);
        }
        if ($user->role_id === 2 && $data['scope'] === 'local') {
            $data['sector_id'] = $user->sector_id;
        } else {
            $data['sector_id'] = null;
        }
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('articles', 'public');
            $article->media()->update([
                'file_path' => $path,
            ]);
        }
        $article->update($data);
        return response()->json(['message' => 'Article modifié avec succès', 'article' => $article], 200);
    }

    public function updateStatus(Request $request, Article $article)
    {
        Gate::authorize('update', $article);
        $data = $request->validated(
            [
                'status' => 'required|in:draft,published'
            ]
        );
        $article->update($data);
        return response()->json(['message' => 'Status modifié avec succès', 'article' => $article], 200);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        Gate::authorize('delete', $article);
        $article->delete();
        return response()->json(['message' => 'Article supprimé avec succès'], 200);
    }
}
