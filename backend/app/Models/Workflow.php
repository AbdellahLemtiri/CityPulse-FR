<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Workflow extends Model
{
    protected $table = 'workflows';
    protected $fillable = ['category_incident_id', 'partner_id'];

     public function category(): BelongsTo
    {
        return $this->belongsTo(CategoryIncident::class, 'category_incident_id');
    }

     public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class, 'partner_id');
    }
}