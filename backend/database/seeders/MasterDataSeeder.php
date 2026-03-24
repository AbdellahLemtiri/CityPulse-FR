<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sector;
use App\Models\Partner;
use App\Models\CategoryIncident;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
 
        $sectors = [
            [
                'name' => 'Annexe 1 : Médina',
                'description' => 'Quartiers inclus : Ancienne Médina, Plateau, Rbat, Qsar El Bahr.','city' => 'Safi'
            ],
            [
                'name' => 'Annexe 3 : Biada',
                'description' => 'Quartiers inclus : Biada, Oued El Bacha, Derb Moulay El Hassan.','city' => 'Safi'
            ],
            [
                'name' => 'Annexe 4 : Chenguite',
                'description' => 'Quartiers inclus : Hay Chenguite, Lkourss, L-Mina (Port).','city' => 'Safi'
            ],
            [
                'name' => 'Annexe 7 : Sidi Abdelkrim',
                'description' => 'Quartiers inclus : Sidi Abdelkrim, Azib Derai, Jinane.','city' => 'Safi'
            ],
            [
                'name' => 'Annexe 12 : Sidi Bouzid',
                'description' => 'Quartiers inclus : Sidi Bouzid, La Corniche, Amouni.','city' => 'Safi'
            ],
            [
                'name' => 'Annexe 14 : Hay El Matar',
                'description' => 'Quartiers inclus : Hay El Matar, Miftah El Kheir, Quartier Anas, Boustane.','city' => 'Safi'
            ],
            [
                'name' => 'Annexe 15 : Kawki',
                'description' => 'Quartiers inclus : Hay Kawki, El Kala, Qariat Echams.','city' => 'Safi'
            ]
        ];

        foreach ($sectors as $sector) {
            Sector::firstOrCreate(['name' => $sector['name']], $sector);
        }

 
        $partners = [
            [
                'name' => 'RADEES (Eau & Électricité)',
                'email' => 'contact@radees.ma',
                'phone_fix' => '0604789190',
                'whatsapp' => '0604789190',
                'sla_hours' => 24
            ],
            [
                'name' => 'Safi Propreté - Mecomar',
                'email' => 'urgence@mecomar-safi.ma',
                'phone_fix' => '0604789190',
                'whatsapp' => '0604789190',
                'sla_hours' => 12
            ],
            [
                'name' => 'Commune de Safi - Service Voirie',
                'email' => 'voirie@communesafi.ma',
                'phone_fix' => '0604789190',
                'whatsapp' => '0604789190',
                'sla_hours' => 72
            ],
            [
                'name' => 'Safi Éclairage Public (SEP)',
                'email' => 'intervention@sep-safi.ma',
                'phone_fix' => '0604789190',
                'whatsapp' => '0604789190',
                'sla_hours' => 48
            ],
            [
                'name' => 'Service des Espaces Verts',
                'email' => 'espaces-verts@communesafi.ma',
                'phone_fix' => '0604789190',
                'whatsapp' => '0604789190',
                'sla_hours' => 48
            ]
        ];

        foreach ($partners as $partner) {
            Partner::firstOrCreate(['email' => $partner['email']], $partner);
        }

        
        $categories = [
            [
                'name' => 'Voirie & Routes',
                'description' => 'Nids de poule, trottoirs endommagés, affaissement de la chaussée.',
                'sla_hours' => 72,
                'is_active' => true
            ],
            [
                'name' => 'Éclairage Public',
                'description' => 'Poteaux électriques défectueux, lampes grillées, câbles exposés.',
                'sla_hours' => 48,
                'is_active' => true
            ],
            [
                'name' => 'Propreté & Déchets',
                'description' => 'Décharges sauvages, poubelles débordantes, animaux errants.',
                'sla_hours' => 24,
                'is_active' => true
            ],
            [
                'name' => 'Espaces Verts',
                'description' => 'Arbres menaçants de tomber, parcs non entretenus.',
                'sla_hours' => 48,
                'is_active' => true
            ],
            [
                'name' => 'Eau & Assainissement',
                'description' => 'Fuites d\'eau potable, regards d\'égouts ouverts ou bouchés.',
                'sla_hours' => 12, 
                'is_active' => true
            ]
        ];

        foreach ($categories as $category) {
            CategoryIncident::firstOrCreate(['name' => $category['name']], $category);
        }
    }
}