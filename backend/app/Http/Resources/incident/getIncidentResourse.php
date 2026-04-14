<?php

namespace App\Http\Resources\incident;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class getIncidentResourse extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array
    {
        $audio = $this->media->firstWhere('file_type', 'audio');
        $images = $this->media->where('file_type', 'image');
        return [
            'id' => $this->id,
            'ref_num' => $this->ref_num,
            'title' => $this->title,
            'description' => $this->description,
            'created_at' => date('Y-m-d  ', strtotime($this->created_at)),
            'status' => $this->status,
            'images' => $images->map(fn($m) => asset('storage/' . $m->file_path))->values(),
            'audio' => $audio ? asset('storage/' . $audio->file_path) : null,
            'address' => $this->location_name,
            'rejection_reason' => $this->location_address,
            'category' => $this->category?->name,
            'rejection_reason' => $this->rejection_reason ?? null,
        ];
    }
}
