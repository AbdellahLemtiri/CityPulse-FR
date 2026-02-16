<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
class Media extends Model
{
    //
    protected $fillable = ['file_path', 'file_type', 'is_public'];
    
   
    public function model(): MorphTo { return $this->morphTo(); }
}
