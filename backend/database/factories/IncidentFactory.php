<?php

namespace Database\Factories;

use App\Models\Incident;
use App\Models\User;
use App\Models\CategoryIncident; // T2eked mn smit l'model dyal Category
use App\Models\Partner;
use App\Models\Sector; // Wla City 3la 7sab chno 3endek
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class IncidentFactory extends Factory
{
    protected $model = Incident::class;

    public function definition(): array
    {
         $titres = [
            'Nid de poule dangereux', 'Lampadaire en panne', 'Ordures accumulées', 
            'Fuite d\'eau potable', 'Câbles électriques exposés', 'Chiens errants', 
            'Bouche d\'égout ouverte', 'Occupation illégale du trottoir', 
            'Arbre menaçant de tomber', 'Bruit nocturne (Atelier)'
        ];

         $adresses = [
            'Avenue Hassan II', 'Quartier El Mohammadi', 'Ancienne Médina', 
            'Hay Salam', 'Hay Kawki', 'Boulevard Mohammed V', 
            'Sidi Bouzid', 'Azib Deraii', 'Quartier Anas'
        ];

         $statuts = ['pending', 'validated', 'rejected', 'in_progress', 'resolved'];

        $status = $this->faker->randomElement($statuts);
        
         $resolvedAt = ($status === 'resolved') ? $this->faker->dateTimeBetween('-1 month', 'now') : null;
        $rejectionReason = ($status === 'rejected') ? 'Information incomplète ou hors zone.' : null;

        return [
            'ref_num' => 'INC-' . strtoupper(Str::random(8)),
            'title' => $this->faker->randomElement($titres),
            'description' => $this->faker->realText(100), 
            'status' => $status,
             'latitude' => $this->faker->randomFloat(8, 32.2000, 32.4000), 
            'longitude' => $this->faker->randomFloat(8, -9.3000, -9.1000),
            'address' => $this->faker->randomElement($adresses) . ', N° ' . $this->faker->numberBetween(1, 100),
            'rejection_reason' => $rejectionReason,
            'resolved_at' => $resolvedAt,
             'user_id' => User::inRandomOrder()->first()->id ?? 1,
            'sector_id' => Sector::inRandomOrder()->first()->id ?? 1, 
            'category_id' => CategoryIncident::inRandomOrder()->first()->id ?? 1,
            'partner_id' => Partner::inRandomOrder()->first()->id ?? 1,
            'created_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'updated_at' => now(),
        ];
    }
}