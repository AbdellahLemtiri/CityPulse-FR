<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Partner extends Model
{
     protected $fillable = ['name', 'email', 'phone_fix', 'whatsapp', 'sla_hours'];

     public function categories(): BelongsToMany
    {
        return $this->belongsToMany(
            CategoryIncident::class, 
            'workflows', 
            'partner_id', 
            'category_incident_id'
        );
    }

     public function workflows(): HasMany
    {
        return $this->hasMany(Workflow::class, 'partner_id');
    }

     public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class, 'partner_id');
    }

    // 5. L-Logo (Media)
    public function logo(): MorphOne
    {
        return $this->morphOne(Media::class, 'model');
    }
}