<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Strike extends Model
{
    //
    protected $fillable = ['reason', 'user_id'];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
