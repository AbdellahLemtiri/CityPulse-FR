<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\Article;
use App\Models\User;
use Faker\Factory as Faker;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('fr_MA');

         $articles = Article::all();
        $users = User::all();

         if ($articles->count() === 0 || $users->count() === 0) {
            $this->command->info('A khoya Abdellah, sayeb les Articles w les Users homa l-wlin 9bel ma t-lanci had Seeder!');
            return;
        }

         $commentairesDarija = [
            "Tbarkellah 3likom, had l-projet ghadi y-nfe3 l-mdina bzaf.",
            "Wach hadchi ghadi y-chmel 7ta l-Moqata3a d-Kawki?",
            "L-ma dima m-qto3 f d-derb, chofou lina chi 7el!",
            "Mzyan, walakin fo9ach ghadi y-bda had l-khedma d-bessa7?",
            "L-fikra wa3ra! Chapeau l-équipe d-SafiPulse."
        ];

        $reponsesManager = [
            "Salam, ah bien sûr l-projet ghadi y-wsel l-ga3 l-a7ya2 d-Asfi.",
            "Chokran 3la l-ihtimam dialek! L-fariq dialna khddam 3la l-mouchkil.",
            "Insha'Allah f ch-her l-jay ghadi t-choufou n-natija.",
        ];

         foreach ($articles as $article) {
            for ($i = 0; $i < 3; $i++) {
                
                 $mainComment = Comment::create([
                    'body'             => $faker->randomElement($commentairesDarija),
                    'is_flagged'       => false,
                    'user_id'          => $users->random()->id,  
                    'commentable_type' => 'App\\Models\\Article', 
                    'commentable_id'   => $article->id,
                    'parent_id'        => null,  
                    'created_at'       => now()->subDays(rand(1, 10)), 
                    'updated_at'       => now(),
                ]);

                 if (rand(0, 1)) {
                    Comment::create([
                        'body'             => $faker->randomElement($reponsesManager),
                        'is_flagged'       => false,
                        // Kan-ferdouha t-koun l-User r9m 1 awla 2 (b-ze3ma homa l-Managers)
                        'user_id'          => $users->whereIn('role_id', [1, 2])->random()->id ?? $users->random()->id,
                        'commentable_type' => 'App\\Models\\Article',
                        'commentable_id'   => $article->id,
                        'parent_id'        => $mainComment->id, 
                        'created_at'       => now()->subHours(rand(1, 12)), 
                        'updated_at'       => now(),
                    ]);
                }
            }
        }

        $this->command->info('Nadi! L-Commentaires w R-Réponses t-zadou b-naja7!');
    }
}