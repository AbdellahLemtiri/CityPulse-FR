<?php

namespace App\Policies;

use App\Models\User;

class ProfilPolicy
{
    /**
     * Create a new policy instance.
     */

    public function updateLocation(User $user): bool
    {
        return $user->hasRole('citoyen');
    }


    public function   deleteAccount(User $user): bool
    {
        return $user->hasRole('citoyen');
    }
}
