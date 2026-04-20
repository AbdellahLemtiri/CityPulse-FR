<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\Sector;
use App\Models\User;

class SectorPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Sector $sector): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Sector $sector): bool
    {
        return $user->hasRole('admin')&& $user->sector_id === $sector->id;
    }


    public function toggleStatus(User $user, Sector $sector): bool
    {
        return $user->hasRole('admin')&& $user->sector_id === $sector->id;
    }
    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Sector $sector): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Sector $sector): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Sector $sector): bool
    {
        return false;
    }
}
