<?php

namespace App\Services;

use App\Models\Incident;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Models\Sector;
use App\Models\Partner;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\PartnerIncidentMail;
use App\Notifications\IncidentUpdatedNotification;
use App\Http\Resources\incident\getIncidentResourse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;

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


    public function qualify(int $incidentId, int $categoryId, User $manager)
    {
        return DB::transaction(function () use ($incidentId, $categoryId, $manager) {

            $incident = Incident::findOrFail($incidentId);

            Gate::authorize('qualifyIncident', $incident, Incident::class);

            $partner = Partner::where('city_id', $manager->city_id)->whereHas('categories', function ($query) use ($categoryId) {
                $query->where('category_incidents.id', $categoryId);
            })->first();

            if (!$partner) {
                throw new \Exception(' Aucun partenaire assigné à cette catégorie dans cette ville.');
            }

            $incident->update([
                'category_id' => $categoryId,
                'partner_id' => $partner->id,
                'status' => 'in_progress',
                'qualified_at' => now(),
            ]);



            Notification::send($incident->user, new IncidentUpdatedNotification([
                'id' => $incident->id,
                'title' => $incident->title,
            ]));
            $incident->load('category', "media");
            Mail::to($partner->email)->send(new PartnerIncidentMail($incident, $partner, $manager));
            return $incident->load('partner');
        });
    }
}
