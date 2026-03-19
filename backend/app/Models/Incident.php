<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Incident extends Model
{
    //

    use HasFactory, SoftDeletes;
 
    protected $guarded = ['id'];


    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function sector(): BelongsTo { return $this->belongsTo(Sector::class); }
    public function partner(): BelongsTo
    { 
        return $this->belongsTo(Partner::class); 
    }
 
    public function media(): MorphMany { return $this->morphMany(Media::class, 'model'); }
 }
