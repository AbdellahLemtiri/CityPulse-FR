<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
// use Illuminate\Database\Eloquent\SoftDeletes;


class Article extends Model
{
    /** @use HasFactory<\Database\Factories\ArticleFactory> */
    // use SoftDeletes, HasFactory;

    protected $fillable = [
        'user_id',
        'sector_id', 
        'title',
        'slug',
        'content',
        'scope',
        'status',
        'deleted_at'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'model');
    }

    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }
}