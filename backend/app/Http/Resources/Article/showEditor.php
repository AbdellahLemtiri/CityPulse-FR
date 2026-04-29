<?php

namespace App\Http\Resources\Article;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class showEditor extends JsonResource
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
            'images' => $this->media->map(function ($item) {
                return $item->file_path; 
            }),
        ];
    } 
}
