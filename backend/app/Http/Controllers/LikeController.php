<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreLikeRequest;
class LikeController extends Controller
{
    //


    public function toggle(StoreLikeRequest $request)
    {
        $UserId = Auth::id();
        $data = $request->validated();
        
 
        $modelClass = 'App\\Models\\' . $data['likeable_type'];
        $model = $modelClass::findOrFail($data['likeable_id']);

         $existingLike = $model->likes()->where('user_id', $UserId)->first();

        if ($existingLike) {
             $existingLike->delete();
            return response()->json(['message' => 'Unliked', 'liked' => false], 200);
        } else {
            
             $model->likes()->create(['user_id' =>  $UserId]);
            return response()->json(['message' => 'Liked', 'liked' => true], 201);
        }
    }
}
