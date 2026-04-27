<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pharmacy;
use Carbon\Carbon;

class PharmacySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $startDate = Carbon::create(2026, 4, 6, 0, 0, 0);
        $endDate = Carbon::create(2026, 4, 12, 23, 59, 59);

        $pharmacies = [
             [
                'name' => 'Pharmacie La Mimosa',
                'address' => 'N° 95, Rue Ibn Batouta, Azib Deraii',
                'phone' => '05-24-62-81-83 / 06-12-05-85-81',
                'location_url' => null,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'city_id' => 1,
                'user_id' => 1,
            ],
            [
                'name' => 'Pharmacie El Madina',
                'address' => '92, Avenue Bir Anzarane, Place Sidi Bouddahab, Ancienne Médina',
                'phone' => '05-24-46-42-93',
                'location_url' => null,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'city_id' => 1,
                'user_id' => 1,
            ],
            [
                'name' => 'Pharmacie Lebiar',
                'address' => '209, Avenue Boujdour, Lebiar, près de la Commune Zaouia',
                'phone' => '05-27-64-51-86',
                'location_url' => null,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'city_id' => 1,
                'user_id' => 1,
            ],
            [
                'name' => 'Pharmacie Chekkar',
                'address' => 'Douar Rmel',
                'phone' => '05-24-66-44-44',
                'location_url' => null,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'city_id' => 1,
                'user_id' => 1,
            ],

             [
                'name' => 'Pharmacie El Annabi',
                'address' => '18, Rue Oum El Banine, Quartier de l\'Hôpital, Jnan Mestari, près de l\'école Ahmed Achour',
                'phone' => '05-24-62-81-32',
                'location_url' => null,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'city_id' => 1,
                'user_id' => 1,
            ],
            [
                'name' => 'Pharmacie Ben Sassi',
                'address' => 'Quartier El Mohammadi 2, Lotissement en construction, près de la mosquée du Quartier El Mohammadi et de l\'auto-école',
                'phone' => '0524-62-56-35',
                'location_url' => null,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'city_id' => 1,
                'user_id' => 1,
            ],
            [
                'name' => 'Pharmacie Al Jamiaa',
                'address' => 'Lotissement Ibn Rochd (Villas Al Omrane), derrière l\'ENSA (Entrée à côté du café mobile Simo Coffee), Sidi Bouzid',
                'phone' => '0526-03-05-07',
                'location_url' => null,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'city_id' => 1,
                'user_id' => 1,
            ],
        ];

        foreach ($pharmacies as $pharmacy) {
            Pharmacy::create($pharmacy);
        }
    }
}