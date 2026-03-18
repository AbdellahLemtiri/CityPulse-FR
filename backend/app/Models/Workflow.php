<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Workflow extends Model
{
    //
    protected $table = 'workflows';
    protected $fillable = ['category_incident_id', 'partner_id'];


    public function category_incident(): BelongsTo
    {
        return $this->belongsTo(CategoryIncident::class);
    }
    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }
}
