<?php

namespace App\Http\Resources\comment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReplyCommentResorse extends JsonResource
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
            'id'            => $this->id,
            'body'          => $this->body,
            'created_at'    => date('H:i d-m-Y  ', strtotime($this->created_at)),
            'author_name'   => $this->user->first_name . ' ' . $this->user->last_name,
<<<<<<< HEAD

            'photo' => $this->user->photo
                ? asset('storage/' . $this->user->photo->file_path)
                : "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=$bg&color=fff",
=======
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
            'is_accessible' => $this->user->hasRole(['admin', 'manager', 'journaliste']),
            'replies' => ReplyCommentResorse::collection($this->whenLoaded('replies')),
        ];
    }
}
