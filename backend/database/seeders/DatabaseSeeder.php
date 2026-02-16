<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Incident;
use App\Models\Sector;
use App\Models\Category;
use App\Models\Badge;
use App\Models\Role;
class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Roles (Static)
        $adminRole = Role::create(['name' => 'admin', 'label' => 'Administrateur']);
        $managerRole = Role::create(['name' => 'manager', 'label' => 'Manager de Secteur']);
        $citoyenRole = Role::create(['name' => 'citoyen', 'label' => 'Citoyen']);

        // 2. Sectors (Quartiers de Safi - Real Data 🇲🇦)
        $sectors = [
            'Plateau', 'Jrifat', 'Biaada', 'Sidi Bouzid', 'Kao Kiou', 
            'Lgharyan', 'Zawiya', 'Miftah El Khair', 'Azib Drai'
        ];
        foreach ($sectors as $sectorName) {
            Sector::create(['name' => $sectorName, 'city' => 'Safi']);
        }

        // 3. Categories
        $categories = [
            ['name' => 'Voirie', 'sla_hours' => 48],
            ['name' => 'Éclairage Public', 'sla_hours' => 24],
            ['name' => 'Déchets', 'sla_hours' => 12],
            ['name' => 'Eau & Assainissement', 'sla_hours' => 36],
            ['name' => 'Espaces Verts', 'sla_hours' => 72],
        ];
        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // 4. Badges (Gamification)
        Badge::create(['name' => 'Débutant', 'xp_required' => 0, 'description' => 'Bienvenue sur SafiPulse']);
        Badge::create(['name' => 'Citoyen Actif', 'xp_required' => 100, 'description' => '10 Incidents signalés']);
        Badge::create(['name' => 'Héros de Safi', 'xp_required' => 500, 'description' => 'Contribution majeure']);

        // 5. Users (1 Admin + 50 Random)
        User::factory()->create([
            'first_name' => 'Abdellah',
            'last_name' => 'Lem',
            'email' => 'admin@safipulse.com',
            'password' => bcrypt('12345678'),
            'role_id' => $adminRole->id,
            'xp_points' => 1000,
        ]);

        User::factory(50)->create([
            'role_id' => $citoyenRole->id,
            'sector_id' => Sector::inRandomOrder()->first()->id,
        ]);

        // 6. Incidents (100 fake reports)
        Incident::factory(100)->create();

        echo "✅ Base de données initialisée avec succès pour SafiPulse ! 🚀\n";
    }
}
