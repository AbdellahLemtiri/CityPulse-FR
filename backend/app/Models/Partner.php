<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Partner extends Model
{
    protected $fillable = ['name', 'email', 'phone_fix', 'whatsapp', 'sla_hours'];

    public function categories(): HasMany
    {
        return $this->hasMany(
            CategoryIncident::class
        );
    }



    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class, 'partner_id');
    }

     public function logo(): MorphOne
    {
        return $this->morphOne(Media::class, 'model');
    }
}
