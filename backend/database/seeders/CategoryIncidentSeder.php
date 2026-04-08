<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\CategoryIncident;

class CategoryIncidentSeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Éclairage Public',
                'icon' => 'Lightbulb', 
                'description' => 'Problèmes liés aux lampadaires, câbles exposés et à l\'éclairage des rues.',
            ],
            [
                'name' => 'Propreté & Déchets',
                'icon' => 'Trash2',
                'description' => 'Collecte des ordures, nettoyage des rues et décharges sauvages.',
            ],
            [
                'name' => 'Voirie & Routes',
                'icon' => 'Cone',
                'description' => 'Nids de poule, trottoirs endommagés, et signalisation routière.',
            ],
            [
                'name' => 'Eau & Assainissement',
                'icon' => 'Droplets',
                'description' => 'Fuites d\'eau potable, canalisations bouchées et égouts.',
            ],
            [
                'name' => 'Espaces Verts',
                'icon' => 'TreePine',
                'description' => 'Entretien des parcs, jardins publics et arbres menaçants.',
            ],
            [
                'name' => 'Sécurité & Nuisances',
                'icon' => 'ShieldAlert',
                'description' => 'Animaux errants dangereux, nuisances sonores, ou bâtiments menaçant ruine.',
            ],
            [
                'name' => 'Transport & Mobilité',
                'icon' => 'Bus',
                'description' => 'Feux de circulation en panne, abribus cassés, véhicules abandonnés.',
            ],
            [
                'name' => 'Urbanisme & Espaces Publics',
                'icon' => 'Hammer',
                'description' => 'Constructions clandestines, occupation illégale du trottoir, mobilier urbain.',
            ],
            [
                'name' => 'Hygiène & Santé Publique',
                'icon' => 'Bug',
                'description' => 'Prolifération de nuisibles, problèmes d\'hygiène dans les marchés.',
            ],
            [
                'name' => 'Équipements Sportifs & Loisirs',
                'icon' => 'Activity',
                'description' => 'Terrains de proximité dégradés, jeux pour enfants endommagés.',
            ],
        ];

        foreach ($categories as $category) {
            CategoryIncident::firstOrCreate(
                ['name' => $category['name']],
                [
                    'icon' => $category['icon'],
                    'description' => $category['description']
                ]
            );
        }
    }
}
