<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Partner;
use Carbon\Carbon;

class PartnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $partners = [
            [
                'name' => 'RADEES Safi',
                'email' => 'contact@radees.ma',
                'phone_fix' => '0524462011',
                'whatsapp' => '0612345678',
                'sla_hours' => 24,
                'city_id' => 1,
            ],
            [
                'name' => 'Arma Environnement Safi',
                'email' => 'reclamation.safi@arma.ma',
                'phone_fix' => '0524620000',
                'whatsapp' => '0600112233',
                'sla_hours' => 48,
                'city_id' => 1,
            ],
            [
                'name' => 'Commune de Safi - Service Technique',
                'email' => 'technique@communesafi.ma',
                'phone_fix' => '0524462233',
                'whatsapp' => '0661000011',
                'sla_hours' => 72,
                'city_id' => 1,
            ],
            [
                'name' => 'Vectalia Safi',
                'email' => 'contact.safi@vectalia.ma',
                'phone_fix' => '0524465566',
                'whatsapp' => '0677889900',
                'sla_hours' => 48,
                'city_id' => 1,
            ],
            [
                'name' => 'Police Administrative Safi',
                'email' => 'police.admin@communesafi.ma',
                'phone_fix' => '0524468899',
                'whatsapp' => null,
                'sla_hours' => 12,
                'city_id' => 1,
            ],
            [
                'name' => 'Bureau Communal d\'Hygiène (BCH)',
                'email' => 'bch.safi@sante.gov.ma',
                'phone_fix' => '0524467788',
                'whatsapp' => '0655443322',
                'sla_hours' => 24,
                'city_id' => 1,
            ],
            [
                'name' => 'Délégation Jeunesse et Sports Safi',
                'email' => 'safi@mjs.gov.ma',
                'phone_fix' => '0524612345',
                'whatsapp' => null,
                'sla_hours' => 72,
                'city_id' => 1,
            ]
        ];

        foreach ($partners as $partner) {
            Partner::create($partner);
        }
    }
}
