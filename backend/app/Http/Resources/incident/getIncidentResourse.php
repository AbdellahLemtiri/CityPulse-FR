<?php

namespace App\Http\Resources\incident;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class getIncidentResourse extends JsonResource
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
            'ref_num' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'created_at' => $this->created_at->diffForHumans(),
            'status' => $this->status,
            'images' => $this->media->pluck('file_path'),
            'address' => $this->location_name,
            'rejection_reason' => $this->location_address,
        ];
    }
}
