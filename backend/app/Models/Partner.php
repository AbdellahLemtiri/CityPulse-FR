<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Partner extends Model
{
    protected $fillable = ['name', 'email', 'phone_fix', 'whatsapp', 'sla_hours', 'city_id'];

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(CategoryIncident::class, 'category_partner');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id');
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
