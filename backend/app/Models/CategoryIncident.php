<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
class CategoryIncident extends Model
{
    //
    protected $table = 'category_incidents';
    protected $fillable = ['name', 'sla_hours','is_active'];

    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class);
    }
    public function partner(): HasMany
    {
        return $this->hasOneThrough(Partner::class,Workflow::class,'category_incident_id','id','partner_id');
    }
}
