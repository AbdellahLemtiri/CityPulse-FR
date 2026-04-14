<?php

namespace App\Http\Resources\profile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class userProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'first_name'  => $this->first_name,
            'last_name'   => $this->last_name,
            'email'       => $this->email,
            'phone'       => $this->phone,
            'cin'         => $this->cin,
            'adresse'     => $this->adresse,
             'city_name'   => $this->city->name,
            'sector_name' => $this->sector->name,
            'role' => $this->getRoleNames()->first(),
            
            'image'   => $this->photo? asset('storage/' . $this->photo->file_path): 'https://ui-avatars.com/api/?name=' . urlencode($this->first_name . '+' . $this->last_name) . '&background=random&color=fff&rounded=true',
        ];
    }
}
