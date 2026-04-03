<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    protected $fillable = ['name'];

    public function sectors(): HasMany
    {
        return $this->hasMany(Sector::class);
    }

    public function partners(): HasMany
    {
        return $this->hasMany(Partner::class);
    }

     public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}