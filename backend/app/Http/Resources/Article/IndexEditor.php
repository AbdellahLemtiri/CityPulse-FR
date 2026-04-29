<?php

namespace App\Http\Resources\Article;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexEditor extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'content' => $this->content,
            'status' => $this->status,
            'images' => $this->media->map(fn($m) => $m->file_path)->values(),
            'created_at' => $this->created_at,
        ];
    }
}
