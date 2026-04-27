<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;
use App\Models\Sector;

class SectorSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Safi' => [
                ['name' => '1ère Annexe - Ancienne Médina', 'description' => 'المدينة العتيقة، واد الباشا، الكورس'],
                ['name' => '2ème Annexe - Biada', 'description' => 'بياضة، درب مولاي الحسن'],
                ['name' => '3ème Annexe - Zaouia', 'description' => 'الزاوية، حي المطار، جنان الشقوري'],
                ['name' => '4ème Annexe - Kaouki', 'description' => 'حي كاوكي، حي السلام، وريدة'],
                ['name' => '5ème Annexe - Sidi Bouzid', 'description' => 'سيدي بوزيد، قرية الشمس'],
                ['name' => '6ème Annexe - Miftah El Kheir', 'description' => 'مفتاح الخير، حي العودة، شنقيط'],
                ['name' => '7ème Annexe - Azib Derai', 'description' => 'عزيب الدرعي، حي أموني، لالة هنية الحمرية'],
                ['name' => '8ème Annexe - Quartier Anas', 'description' => 'حي أنس، برج الناظور'],
            ],
            'Casablanca' => [
                ['name' => 'Maârif', 'description' => 'المعاريف'],
                ['name' => 'Anfa', 'description' => 'أنفا'],
                ['name' => 'Sidi Belyout', 'description' => 'سيدي بليوط'],
                ['name' => 'Hay Hassani', 'description' => 'حي الحسني'],
                ['name' => 'Ain Chock', 'description' => 'عين الشق'],
                ['name' => 'Sidi Moumen', 'description' => 'سيدي مومن'],
                ['name' => 'Bernoussi', 'description' => 'البرنوصي'],
            ],
            'Marrakech' => [
                ['name' => 'Guéliz', 'description' => 'جليز'],
                ['name' => 'Médina', 'description' => 'المدينة'],
                ['name' => 'Ennakhil', 'description' => 'النخيل'],
                ['name' => 'Ménara', 'description' => 'المنارة'],
                ['name' => 'Sidi Youssef Ben Ali', 'description' => 'سيدي يوسف بن علي'],
            ],
            'Rabat' => [
                ['name' => 'Agdal-Ryad', 'description' => 'أكدال الرياض'],
                ['name' => 'Hassan', 'description' => 'حسان'],
                ['name' => 'Youssoufia', 'description' => 'اليوسفية'],
                ['name' => 'Yaâcoub El Mansour', 'description' => 'يعقوب المنصور'],
                ['name' => 'Souissi', 'description' => 'السويسي'],
            ],
            'Tanger' => [
                ['name' => 'Tanger-Médina', 'description' => 'طنجة المدينة'],
                ['name' => 'Beni Makada', 'description' => 'بني مكادة'],
                ['name' => 'Charf-Mghogha', 'description' => 'الشرف مغوغة'],
                ['name' => 'Charf-Souani', 'description' => 'الشرف السواني'],
            ],
        ];

        foreach ($data as $cityName => $sectors) {
             $city = City::firstOrCreate(['name' => $cityName]);

            foreach ($sectors as $sector) {
                Sector::firstOrCreate(
                    [
                        'name' => $sector['name'],
                        'city_id' => $city->id
                    ],
                    [
                        'description' => $sector['description']
                    ]
                );
            }
        }
    }
}
