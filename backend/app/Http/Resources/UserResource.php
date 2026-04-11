<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'uuid' => $this->uuid,
            'first_name' => $this->first_name,
            'last_name'  => $this->last_name,
            'full_name'  => $this->first_name . ' ' . $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'cin' => $this->cin,
            'adresse' => $this->adresse,
            'role' => $this->getRoleNames()->first(),
            'city' => $this->city->name,
            'sector' => $this->sector->name,
            'joined_at'  => $this->created_at->diffForHumans(),
        ];
    }
}
