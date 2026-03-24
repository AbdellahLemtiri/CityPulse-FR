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
        $adminRole = Role::create(['name' => 'admin', 'label' => 'Administrateur']);
        $managerRole = Role::create(['name' => 'manager', 'label' => 'Manager de Secteur']);
        $citoyenRole = Role::create(['name' => 'citoyen', 'label' => 'Citoyen']);
        $citoyenRole = Role::create(['name' => 'jounaliste', 'label' => 'jounaliste']);
    }
}
