<?php
namespace App\Services;

use App\Models\Incident;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
class IncidentService
{
    public function createIncident(array $data, $user, $images = [], $audio = null)
    {
         return DB::transaction(function () use ($data, $user, $images, $audio) {
            
             $refNum = 'SAF-' . date('Y') . '-' . strtoupper(Str::random(5));

            $user = Auth::user();
             $incident = Incident::create([
                'ref_num'     => $refNum,
                'title'       => $data['title'],
                'description' => $data['description'],
                'latitude'    => $data['latitude'] ?? 0,
                'longitude'   => $data['longitude']?? 0,
                'address'     => $data['address'] ?? null,
                'sector_id'   => $user->sector_id,
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