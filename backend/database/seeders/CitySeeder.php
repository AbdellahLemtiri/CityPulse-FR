<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\City;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            ['name' => 'Safi'],
            ['name' => 'Casablanca'],
            ['name' => 'Marrakech'],
            ['name' => 'Rabat'],
            ['name' => 'Tanger'],
            ['name' => 'Fès'],
            ['name' => 'Agadir'],
            ['name' => 'Meknès'],
            ['name' => 'Oujda'],
            ['name' => 'Kenitra'],
            ['name' => 'Tétouan'],
            ['name' => 'Temara'],
            ['name' => 'Safi'],
            ['name' => 'Mohammédia'],
            ['name' => 'Khouribga'],
            ['name' => 'El Jadida'],
            ['name' => 'Béni Mellal'],
            ['name' => 'Nador'],
            ['name' => 'Taza'],
            ['name' => 'Settat'],
            ['name' => 'Berrechid'],
            ['name' => 'Khemisset'],
            ['name' => 'Guelmim'],
            ['name' => 'Laâyoune'],
            ['name' => 'Dakhla'],
            ['name' => 'Errachidia'],
            ['name' => 'Taroudant'],
            ['name' => 'Ouarzazate'],
        ];

        foreach ($cities as $city) {
            City::firstOrCreate(['name' => $city['name']]);
        }
    }
}
