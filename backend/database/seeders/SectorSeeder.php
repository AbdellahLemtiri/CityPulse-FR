<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;
use App\Models\Sector;

class SectorSeeder extends Seeder
{
    public function run(): void
    {
        $safi = City::where('name', 'Safi')->first();
        if (!$safi) {
            $safi = City::create(['name' => 'Safi']);
        }

        $safiSectors = [
            ['name' => '1ère Annexe Administrative - Ancienne Médina', 'description' => 'المدينة العتيقة، واد الباشا، الكورس', 'city_id' => $safi->id],
            ['name' => '2ème Annexe Administrative - Biada', 'description' => 'بياضة، درب مولاي الحسن', 'city_id' => $safi->id],
            ['name' => '3ème Annexe Administrative - Zaouia', 'description' => 'الزاوية، حي المطار، جنان الشقوري', 'city_id' => $safi->id],
            ['name' => '4ème Annexe Administrative - Kaouki', 'description' => 'حي كاوكي، حي السلام، وريدة', 'city_id' => $safi->id],
            ['name' => '5ème Annexe Administrative - Sidi Bouzid', 'description' => 'سيدي بوزيد، قرية الشمس', 'city_id' => $safi->id],
            ['name' => '6ème Annexe Administrative - Miftah El Kheir', 'description' => 'مفتاح الخير، حي العودة، شنقيط', 'city_id' => $safi->id],
            ['name' => '7ème Annexe Administrative - Azib Derai', 'description' => 'عزيب الدرعي، حي أموني، لالة هنية الحمرية', 'city_id' => $safi->id],
            ['name' => '8ème Annexe Administrative - Quartier Anas', 'description' => 'حي أنس، برج الناظور', 'city_id' => $safi->id],
        ];

        foreach ($safiSectors as $sector) {
            Sector::firstOrCreate(
                ['name' => $sector['name'], 'city_id' => $sector['city_id']],
                $sector
            );
        }
    }
}
