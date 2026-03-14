<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Badge extends Model
{
    //
    protected $fillable = ['name', 'xp_required', 'description'];

    public function users(): BelongsToMany { return $this->belongsToMany(User::class, 'user_badges'); }
    public function icon(): MorphOne { return $this->morphOne(Media::class, 'model'); }
}
