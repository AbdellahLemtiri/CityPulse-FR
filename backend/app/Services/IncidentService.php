<?php

namespace App\Services;

use App\Models\Incident;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Models\Sector;

class IncidentService
{
    public function createIncident(array $data, $user, $images = [], $audio = null)
    {
        return DB::transaction(function () use ($data, $user, $images, $audio) {


            $sectorId = $user->sector_id;
            $sector = Sector::findOrFail($sectorId);
            $ref =   trim(substr($sector->name, 0, 11));


            $refNum = $ref . '-' . date('Y') . '-' . strtoupper(Str::random(6));

            $user = Auth::user();
            $incident = Incident::create([
                'ref_num'     => $refNum,
                'title'       => $data['title'],
                'description' => $data['description'],
                'latitude'    => $data['latitude'] ?? 0,
                'longitude'   => $data['longitude'] ?? 0,
                'address'     => $data['address'] ?? null,
                'sector_id'   => $sector->id,
                'user_id'     => $user->id,
                'status'      => 'pending',
            ]);

            if (!empty($images)) {
                foreach ($images as $image) {
                    $path = $image->store('incidents/images', 'public');

                    $incident->media()->create([
                        'file_path' => $path,
                        'file_type' => 'image',
                        'is_public' => true
                    ]);
                }
            }

            if ($audio) {
                $path = $audio->store('incidents/audio', 'public');

                $incident->media()->create([
                    'file_path' => $path,
                    'file_type' => 'audio',
                    'is_public' => true
                ]);
            }

            return $incident;
        });
    }
}
