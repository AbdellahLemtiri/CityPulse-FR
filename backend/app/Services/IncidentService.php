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
        // DB::transaction kat-dmen lina blli ila w9e3 mochkil f t-tsawer, l-Incident ma-kay-t-sajjelch (Rollback)
        return DB::transaction(function () use ($data, $user, $images, $audio) {
            
            // 1. Génération d'une référence unique (Ex: SAF-2026-A8F9K)
            $refNum = 'SAF-' . date('Y') . '-' . strtoupper(Str::random(5));

            $user = Auth::user();
            // 2. Création de l'incident (n-3zlou ghir les champs li baghin)
            $incident = Incident::create([
                'ref_num'     => $refNum,
                'title'       => $data['title'],
                'description' => $data['description'],
                'latitude'    => $data['latitude'],
                'longitude'   => $data['longitude'],
                'address'     => $data['address'] ?? null,
                'sector_id'   => $user->sector_id,
                 'user_id'     => $user->id,
                'status'      => 'pending',
            ]);

            // 3. Traitement et sauvegarde des Images
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

            // 4. Traitement et sauvegarde de l'Audio (Note vocale)
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