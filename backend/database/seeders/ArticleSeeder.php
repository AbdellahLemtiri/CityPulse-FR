<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\City;
use App\Models\Sector;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
   
        $cityIds = City::pluck('id')->toArray() ?: [1];
        $sectorIds = Sector::pluck('id')->toArray() ?: [1];

       
        for ($i = 1; $i <= 20; $i++) {
            
             $randomCityId = $cityIds[array_rand($cityIds)];
            $randomSectorId = $sectorIds[array_rand($sectorIds)];

            $titre = "Info Locale City Pulse - Secteur #" . $i;

            $article = Article::create([
                'user_id' => 4, 
                'slug' => Str::slug($titre . '-' . uniqid()),
                'content' => " numéro {$i} Ceci est une actualité locale de développement , publiée par le  Manager  de la plateforme City Pulse. Cet article est restreint au scope LOCAL  pour tester l'affichage spécifique à un secteur précis. ",
                'scope' => 'local',
                'city_id' => $randomCityId,
                'sector_id' => $randomSectorId,
                'status' => 'published',
            ]);

             $article->media()->create([
                'file_path' => '69f3b223bbf85.webp', 
            ]);
        }
 
        for ($j = 1; $j <= 60; $j++) {
            
             $randomCityId = $cityIds[array_rand($cityIds)];

            $titre = "Actualité Globale City Pulse - Ville #" . $j;

            $article = Article::create([
                'user_id' => 5,  
                'slug' => Str::slug($titre . '-' . uniqid()),
                'content' => "numéro {$j} Ceci est un article global , publié par le Journaliste. Cet article est configuré avec le scope GLOBAL, ce qui signifie qu'il est visible pour toute la ville, sans être limité à un secteur particulier",
                'scope' => 'global',
                'city_id' => $randomCityId,
                'sector_id' => null,  
                'status' => 'published',
            ]);

             $article->media()->create([
                'file_path' => 'https://citypulse-0a6044.www.dockhosting.dev/uploads/incidents/69f3e875429d9.png', 
            ]);
        }
    }
}