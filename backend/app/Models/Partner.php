<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Partner extends Model
{
    //
    protected $fillable = ['name', 'email', 'phone_fix', 'whatsapp', 'sla_hours', 'category_id'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class);
    }

    // Logo du partenaire
    public function logo(): MorphOne
    {
        return $this->morphOne(Media::class, 'model');
    }
}
