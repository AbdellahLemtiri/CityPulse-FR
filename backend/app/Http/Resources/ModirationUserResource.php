<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModirationUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'is_banned' => $this->is_banned,
            'cin' => $this->cin,
            'strikes_count'=>$this->strikes()->count()??0,
            'created_at'=> date('Y-m-d  ', strtotime($this->created_at))  ,      
        ];
    }
}
