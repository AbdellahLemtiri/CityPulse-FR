<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\DutyPharmacy;
use App\Models\User;

class DutyPharmacyPolicy
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
    public function view(User $user, DutyPharmacy $dutyPharmacy): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
<<<<<<< HEAD
        return $user->hasRole('journaliste') ;
=======
        return false;
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, DutyPharmacy $dutyPharmacy): bool
    {
<<<<<<< HEAD
        return $user->id === $dutyPharmacy->user_id;
    }

    public function journalistIndex(User $user): bool
    {
        return $user->hasRole('journaliste');
=======
        return false;
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, DutyPharmacy $dutyPharmacy): bool
    {
<<<<<<< HEAD
        return  $user->id === $dutyPharmacy->user_id;
=======
        return false;
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, DutyPharmacy $dutyPharmacy): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, DutyPharmacy $dutyPharmacy): bool
    {
        return false;
    }
}
