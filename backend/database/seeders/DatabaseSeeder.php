<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Incident;
use App\Models\Sector;
use App\Models\Category;
use App\Models\Badge;
use Spatie\Permission\Models\Role;
use App\Models\CategoryIncident;
use Database\Seeders\CategoryIncidentSeder;
use Database\Seeders\CategorySeeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $journalisteRole = Role::firstOrCreate(['name' => 'journaliste']);
        $citoyenRole = Role::firstOrCreate(['name' => 'citoyen']);
        $this->call(CategoryIncidentSeder::class);
        $this->call(SectorSeeder::class);
        $this->call(CitySeeder::class);
        $users = [
            [
                'first_name' => 'Abdellah',
                'last_name' => 'Lemtiri',
                'email' => 'admin@safipulse.ma',
                'role' => 'admin'
            ],
            [
                'first_name' => 'Ahmed',
                'last_name' => 'bojouni',
                'email' => 'manager1@safipulse.ma',
                'role' => 'manager'
            ],  [
                'first_name' => 'isma',
                'last_name' => 'sirjeedine',
                'email' => 'isam@safipulse.ma',
                'role' => 'admin'
            ],
            [
                'first_name' => 'Sara',
                'last_name' => 'siraji',
                'email' => 'manager2@safipulse.ma',
                'role' => 'manager'
            ],
            [
                'first_name' => 'Hassan',
                'last_name' => 'hilali',
                'email' => 'journaliste1@safipulse.ma',
                'role' => 'journaliste'
            ],
            [
                'first_name' => 'abdesamed',
                'last_name' => 'samedi',
                'email' => 'journaliste2@safipulse.ma',
                'role' => 'journaliste'
            ],
            [
                'first_name' => 'lemtiri',
                'last_name' => 'Abdellah',
                'email' => 'Abdellah@gmail.com',
                'role' => 'citoyen'
            ],
            [
                'first_name' => 'marwa',
                'last_name' => 'elkhayti',
                'email' => 'marwa@gmail.com',
                'role' => 'citoyen'
            ],
            [
                'first_name' => 'Yassine',
                'last_name' => 'bouazizi',
                'email' => 'Yassine@gmail.com',
                'role' => 'citoyen'
            ],
            [
                'first_name' => 'Meryem',
                'last_name' => 'walidiz',
                'email' => 'Meryem@gmail.com',
                'role' => 'citoyen'
            ],
            [
                'first_name' => 'Omar',
                'last_name' => 'mahdi',
                'email' => 'Omar@gmail.com',
                'role' => 'citoyen'
            ],
            [
                'first_name' => 'ahmed',
                'last_name' => 'abderrahim',
                'email' => 'ahmed@gmail.com',
                'role' => 'citoyen'
            ],
            [
                'first_name' => 'Hanaa',
                'last_name' => 'lamliti',
                'email' => 'Hanaa@gmail.com',
                'role' => 'citoyen'
            ],
        ];

        foreach ($users as $userData) {
            $roleName = $userData['role'];
            unset($userData['role']);
            $user = User::create(array_merge($userData, [
                'password' => Hash::make('Safi@2026'),
                'cin' => 'HH' . rand(100000, 999999),
                'phone' => '06' . rand(10000000, 99999999),
                'sector_id' => rand(1, 3),
                'city_id' => 1,
                'adresse' => 'Quartier Safi, Rue ' . rand(1, 50),
            ]));

            $user->assignRole($roleName);
        }
    }
}
