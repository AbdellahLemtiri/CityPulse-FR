<?php

namespace App\Services\Article;

use App\Models\Article;

class ArticleService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }


    public function createArticle(array $data, $user, $images = null)
    {
        $data['user_id'] = $user->id;
        $data['city_id'] = $user->city_id;

        if ($user->hasRole('manager')) {
            $data['scope'] = 'global';
        }
        if ($user->hasRole('journaliste')) {
            $data['scope'] = 'local';
        }
        $article = Article::create($data);
        if ($images) {
            $this->uploadImages($article, $images);
        }

        return $article->load('media');
    }

    private function uploadImages(Article $article, array $images)
    {
        foreach ($images as $file) {
            $path = $file->store('articles', 'public');

            $article->media()->create([
                'file_path' => $path,
                'file_type' => 'image',
                'is_public' => true,
            ]);
        }
    }
}
