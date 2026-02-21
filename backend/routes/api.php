<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\IncidentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


 
Route::middleware('auth:sanctum')->group(function () {
    
   
    Route::post('/logout', [AuthController::class, 'logout']); 
    Route::get('/user', function (Request $request) {           
        return $request->user();
    });
 
    Route::get('/incidents', [IncidentController::class, 'index']);  
    Route::post('/incidents', [IncidentController::class, 'store']);  

});