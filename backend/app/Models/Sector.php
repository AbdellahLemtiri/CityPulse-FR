<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Sector extends Model
{
    //

    protected $fillable = ['name', 'city', 'boundaries', 'description'];
    protected $casts = ['boundaries' => 'array'];
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class);
    }
    public function logo(): MorphOne
    {
        return $this->morphOne(Media::class, 'model');
    }
}
