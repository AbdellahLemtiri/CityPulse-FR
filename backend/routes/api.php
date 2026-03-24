<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticleController;
 use App\Http\Controllers\CommentController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\CategoryIncidentController;
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::resource('/articles', ArticleController::class)->only(['index', 'store','destroy']);

     Route::post('/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
    Route::post('/likes/toggle', [LikeController::class, 'toggle']);
    Route::post('/incidents', [IncidentController::class,'store']);



 
   
});

Route::middleware('auth:sanctum')->group(function () {
     Route::get('/manager/articles/', [ArticleController::class, 'getArticleByEditor']);
    Route::put('/manager/articles/{article}', [ArticleController::class, 'update']);
    Route::post('/manager/articles/', [ArticleController::class, 'store']);
    Route::get('/manager/articles/{id}', [ArticleController::class, 'showEditor']);
    Route::patch('/manager/articles/status/{article}', [ArticleController::class, 'update']);

});
Route::prefix('admin')->group(function () {
     Route::post('/admin/staff', [StaffController::class, 'store']);
    Route::get('/admin/staff', [StaffController::class, 'index']);
    Route::apiResource('/categories', CategoryIncidentController::class);
    Route::apiResource('/sectors', SectorController::class);
    Route::apiResource('/partners', PartnerController::class);
    Route::post('/workflows', [CategoryIncidentController::class, 'storeWorkflows']);
});
