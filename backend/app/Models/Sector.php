<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sector extends Model
{
    //

    protected $fillable = ['name', 'city', 'boundaries'];
    protected $casts = ['boundaries' => 'array'];
    public function users(): HasMany { return $this->hasMany(User::class); }
    public function incidents(): HasMany { return $this->hasMany(Incident::class); }
    public function logo()
}
