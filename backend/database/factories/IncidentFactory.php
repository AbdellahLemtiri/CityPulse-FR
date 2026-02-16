<?php

namespace Database\Factories;
use App\Models\User;
use App\Models\Sector;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Incident>
 */
class IncidentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ref_num' => 'INC-' . now()->year . '-' . fake()->unique()->numberBetween(1000, 9999),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(['pending', 'validated', 'resolved', 'rejected']),
            'latitude' => fake()->latitude(32.28, 32.33),
            'longitude' => fake()->longitude(-9.26, -9.20),
            'address' => fake()->address(),

            'user_id' => User::inRandomOrder()->first()->id ?? 1,
            'category_id' => Category::inRandomOrder()->first()->id ?? 1,
            'sector_id' => Sector::inRandomOrder()->first()->id ?? 1,
        ];
    }
}
