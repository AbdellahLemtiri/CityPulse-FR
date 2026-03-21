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
 

        // 3. Categories
   

        // 4. Badges (Gamification)
   
        // 5. Users (1 Admin + 50 Random)
 
 
        // 6. Incidents (100 fake reports)
     
        echo "✅ Base de données initialisée avec succès pour SafiPulse ! 🚀\n";
    }
}
