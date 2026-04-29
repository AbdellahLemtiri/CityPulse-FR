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
        $name = $this->user->first_name . ' ' . $this->user->last_name;
        $bg = substr(md5($this->user->id), 0, 6);
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'slug'           => $this->slug,
            'content'        => $this->content,
            'scope'          => $this->scope,
            'status'         => $this->status,
            'created_at'     => date('Y-m-d H:i  ', strtotime($this->created_at)),
            'author_avatar' => $this->user->photo
                ? $this->user->photo->file_path
                : "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=$bg&color=fff",
            'likes_count'    => (int) $this->likes_count,
            'comments_count' => (int) $this->comments_count,
            'is_liked'       => (bool) $this->is_liked,
            'author_name'    => $this->user ? $this->user->first_name . ' ' . $this->user->last_name : 'Inconnu',
            'sector_name'    => $this->sector?->name,
            'images' => $this->media->map(function ($item) {
                return $item->file_path; 
            }),
        ];
    }
}
