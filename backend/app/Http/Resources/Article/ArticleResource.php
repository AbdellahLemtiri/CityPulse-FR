<?php

namespace App\Http\Resources\Article;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'slug'           => $this->slug,
            'content'        => $this->content,
            'scope'          => $this->scope,
            'status'         => $this->status,
            'created_at'     => $this->created_at->diffForHumans(),
            'likes_count'    => (int) $this->likes_count,
            'comments_count' => (int) $this->comments_count,
            'is_liked'       => (bool) $this->is_liked,
            'author_name'    => $this->user ? $this->user->first_name . ' ' . $this->user->last_name : 'Inconnu',
            'sector_name'    => $this->sector?->name,
            'images' => $this->media->map(function ($item) {
                return asset('storage/' . $item->file_path);
            }),
        ];
    }
}
