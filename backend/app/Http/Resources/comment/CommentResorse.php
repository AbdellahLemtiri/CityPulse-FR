<?php

namespace App\Http\Resources\comment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\comment\ReplyCommentResorse;

class CommentResorse extends JsonResource
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
            'body' => $this->body,
            'created_at' => $this->created_at->diffForHumans(),
            'author_name' => $this->user->first_name . ' ' . $this->user->last_name,
            'is_accessible' => $this->user->role_id === 1 || in_array($this->user->id, [2, 4]),
            'replies' => ReplyCommentResorse::collection($this->whenLoaded('replies')),         ];
    }
    
}
