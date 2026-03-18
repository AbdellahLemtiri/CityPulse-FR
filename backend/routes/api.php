<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\StaffController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::resource('/articles', ArticleController::class)->only(['index', 'store','destroy']);

    Route::apiResource('/posts', PostController::class);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
    Route::post('/likes/toggle', [LikeController::class, 'toggle']);



    // ---------------------------------------------------------------------------

    Route::post('/admin/staff', [StaffController::class, 'store']);
    Route::get('/admin/staff', [StaffController::class, 'index']);
});

Route::middleware('auth:sanctum')->group(function () {
     Route::get('/manager/articles/', [ArticleController::class, 'getArticleByEditor']);
    Route::put('/manager/articles/{article}', [ArticleController::class, 'update']);
    Route::get('/manager/articles/{article}', [ArticleController::class, 'showEditor']);
    Route::patch('/manager/articles/status/{article}', [ArticleController::class, 'update']);

});
