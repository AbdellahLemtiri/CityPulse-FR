<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
 
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable,HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'role_id',
        'sector_id',
        'xp_points',
        'is_banned',
        'preferences',
        'cin',        
        'adresse'     
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'preferences' => 'array',
        'is_banned' => 'boolean',
    ];

    public function role(): BelongsTo { return $this->belongsTo(Role::class); }
    public function sector(): BelongsTo { return $this->belongsTo(Sector::class); }
    public function incidents(): HasMany { return $this->hasMany(Incident::class); }
    public function posts(): HasMany { return $this->hasMany(Post::class); }
     public function badges(): BelongsToMany { return $this->belongsToMany(Badge::class, 'user_badges')->withPivot('awarded_at'); }
    public function strikes(): HasMany { return $this->hasMany(Strike::class); }
}
