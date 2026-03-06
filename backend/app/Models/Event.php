<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Event extends Model
{
    //
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'start_date',
        'end_date',
        'location_lat',
        'location_lng',
        'xp_reward',
        'is_active',
    ];
    protected $guarded = ['id'];
    protected $casts = ['start_date' => 'datetime', 'end_date' => 'datetime'];

    public function participations(): HasMany
    {
        return $this->hasMany(Participation::class);
    }
    public function coverImage(): MorphOne
    {
        return $this->morphOne(Media::class, 'model');
    }
}
