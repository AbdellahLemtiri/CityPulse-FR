<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Proposal extends Model
{
    /** @use HasFactory<\Database\Factories\ProposalFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'location_name',
        'status',
        'xp_reward',
        'user_id',
        'sector_id'
    ];

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function media()
    {
        return $this->morphMany(Media::class, 'model');
    }
    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }
}
