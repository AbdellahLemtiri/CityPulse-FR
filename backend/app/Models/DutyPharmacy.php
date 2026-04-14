<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
 use Illuminate\Database\Eloquent\Builder;

class DutyPharmacy extends Model
{
    

    protected $fillable = [
        'name', 'address', 'phone', 'location_url', 
        'start_date', 'end_date', 'city_id', 'user_id'
    ];

        protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

   

    public function city() {
        return $this->belongsTo(City::class);
    }
}