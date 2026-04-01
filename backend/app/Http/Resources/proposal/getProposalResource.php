<?php

namespace App\Http\Resources\proposal;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class getProposalResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'created_at' => $this->created_at->diffForHumans(),
            'status' => $this->status,
            'sector_name' => $this->sector->name,
            'images' => $this->media->pluck('file_path'),
            'author_name' => $this->user->first_name . ' ' . $this->user->last_name,
            'location_name' => $this->location_name,

            'votes_count' => $this->likes_count,
            'is_voted' => (bool) $this->is_liked,
        ];
    }
}
