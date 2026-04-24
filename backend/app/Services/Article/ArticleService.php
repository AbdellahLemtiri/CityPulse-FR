<?php

namespace App\Services\Article;

use Illuminate\Support\Facades\Storage;
use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\NewArticleNotification;

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
            $data['scope'] = 'local';
            $data['sector_id'] = $user->sector_id;
        }
        if ($user->hasRole('journaliste')) {
            $data['scope'] = 'global';
        }

        $article = Article::create($data);
        if ($images) {
            $this->uploadImages($article, $images);
        }
        $users = User::role('citoyen')->where('sector_id', $user->sector_id)->get();
        Notification::send($users, new NewArticleNotification($article));
        return $article->load('media');
    }

    public function updateArticle(Article $article, array $data, $images = null)
    {
        $article->update($data);
        if (!empty($deletedImages)) {
            foreach ($deletedImages as $imageUrl) {

                $pathParts = explode('storage/', $imageUrl);

                if (count($pathParts) > 1) {
                    $relativePath = $pathParts[1];

                    $media = $article->media()->where('file_path', $relativePath)->first();

                    if ($media) {
                        Storage::disk('public')->delete($media->file_path);
                        $media->delete();
                    }
                }
            }
        }
        if ($images) {

            foreach ($article->media as $media) {
                Storage::disk('public')->delete($media->file_path);

                $media->delete();
            }

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
