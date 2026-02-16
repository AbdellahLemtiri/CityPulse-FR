<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Category extends Model
{
    //
    protected $fillable = ['name', 'sla_hours'];

    public function incidents(): HasMany { return $this->hasMany(Incident::class); }
    public function partner(): HasOne { return $this->hasOne(Partner::class); }
    
    // Icon (Image)
    public function image(): MorphOne { return $this->morphOne(Media::class, 'model'); }
}
