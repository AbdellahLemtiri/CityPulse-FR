<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Incident;
class IncidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //


        Incident::factory()
            ->count(50)
            ->create()
            ->each(function ($incident) {
                 $incident->media()->create([
                    'file_path' => '69f3e875429d9.png

',
                    'file_type' => 'image'
                ]);
            });
    }
}
