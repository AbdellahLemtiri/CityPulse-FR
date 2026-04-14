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
            'description' => $this->description,
            'created_at' => date('Y-m-d  ', strtotime($this->created_at)),
            'status' => $this->status,
            'sector_name' => $this->sector->name,
            'images' => $this->media?->isNotEmpty()
                ? $this->media->map(fn($m) => asset('storage/' . $m->file_path))
                : [],
            'author_name' => $this->user->first_name . ' ' . $this->user->last_name,
            'imageAuthor'  => $this->user->photo ? asset('storage/' . $this->user->photo->file_path)
                : 'https://ui-avatars.com/api/?name=' . urlencode($this->user->first_name . '+' . $this->user->last_name) . '&background=random&color=fff&rounded=true',
            'location_name' => $this->location_name,

            'votes_count' => $this->likes_count,
            'is_voted' => (bool) $this->is_liked,
        ];
    }
}
