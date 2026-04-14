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
use App\Services\Article\ArticleService;

class ArticleController extends Controller
{




    protected $articleService;

    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(getDataRequest $request)
    {
        $user = Auth::user();
        $req = $request->validated();

        $articles = Article::select('id', 'content', 'slug', 'created_at', 'user_id', 'sector_id', 'city_id', 'status', 'scope')
            ->where('city_id', $user->city_id)
            ->with([
                'user:id,first_name,last_name',
                'sector:id,name',
                'media'
            ])
            ->withCount(['likes', 'comments'])
            ->withExists(['likes as is_liked' => function ($q) {
                $q->where('user_id', Auth::id());
            }])
            ->where('status', 'published');

        if ($req['type'] === 'local') {
            $articles->where('scope', 'local')->where('sector_id', $user->sector_id);
        }
        if ($req['type'] === 'global') {
            $articles->where('scope', 'global')->where('city_id', $user->city_id)->whereNull('sector_id');
        }

        $articles = $articles->latest()->paginate(5);

        return ArticleResource::collection($articles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticleRequest $request)
    {
        Gate::authorize('create', Article::class);
        $user = Auth::user();
        $data = $request->validated();
        $images = $request->file('images');
        $article = $this->articleService->createArticle($data, $user, $images);
        return response()->json([
            'message' => 'Article créé avec succès',
            'article' => $article
        ], 201);
    }






    public function getArticleByEditor()
    {

        $user = Auth::user();
        $articles = Article::with(['media' => function ($query) {
            $query->latest();
        }])
            ->select('id', 'content', 'scope', 'status', 'created_at', 'user_id')
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
        })->select('articles.id', 'articles.content', 'articles.content', 'articles.scope', 'articles.status', 'media.file_path')
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

        $data = $request->validated();

        $images = $request->file('images');

        $article = $this->articleService->updateArticle($article, $data, $images);

        return response()->json([
            'message' => 'Article modifié avec succès',
            'article' => $article
        ], 200);
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


    public function showBySlug($slug)
    {
        $article = Article::select('id', 'content', 'slug', 'created_at', 'user_id', 'sector_id', 'status', 'scope')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with([
                'user:id,first_name,last_name',
                'sector:id,name',
                'media'
            ])
            ->withCount(['likes', 'comments'])
            ->firstOrFail();
        $article->is_liked = false;

        if (Auth::guard('sanctum')->check()) {
            $article->is_liked = $article->likes()->where('user_id', Auth::guard('sanctum')->id())->exists();
        }

        return new ArticleResource($article);
    }
}
