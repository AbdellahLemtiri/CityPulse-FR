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
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\cityController;
use App\Http\Controllers\WorkflowController;
use Illuminate\Support\Facades\Broadcast;
// use App\Http\Controllers\WorkflowController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ModerationController;
use App\Http\Controllers\DutyPharmacyController;
// use DeepCopy\f001\B;
Broadcast::routes(['middleware' => ['auth:sanctum']]);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/cities', [cityController::class, 'index']);
Route::get('sectors/city', [SectorController::class, 'index']);
Route::get('/articles/shared/{slug}', [ArticleController::class, 'showBySlug']);

Route::middleware('auth:sanctum')->get('/notifications', function (Request $request) {
    return response()->json(
        $request->user()->notifications()->limit(10)->get()
    );
});



Route::middleware(['auth:sanctum' ])->group(function () {
    Route::get('/pharmacies', [DutyPharmacyController::class, 'journalistIndex']);
    Route::get('pharmacies/{dutyPharmacy}', [DutyPharmacyController::class, 'show']);
    Route::post('pharmacies/', [DutyPharmacyController::class, 'store']);
    Route::put('pharmacies/{dutyPharmacy}', [DutyPharmacyController::class, 'update']);
    Route::delete('pharmacies/{dutyPharmacy}', [DutyPharmacyController::class, 'destroy']);
});
Route::post('/incidents', [IncidentController::class, 'store']);
Route::post('/proposals', [ProposalController::class, 'store']);
Route::get('/proposals', [ProposalController::class, 'index']);
Route::get('/incidents', [IncidentController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
     Route::get('/articles', [ArticleController::class, 'index']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::get('/comments', [CommentController::class, 'index']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
    Route::post('/likes/toggle', [LikeController::class, 'toggle']);
    Route::get('/duty-pharmacies', [DutyPharmacyController::class, 'index']);
});

Route::middleware('auth:sanctum')->prefix('manager')->group(function () {
    Route::get('/categories', [CategoryIncidentController::class, 'getCategoriesForManager']);
    Route::resource('/incidents', IncidentController::class)->only(['index', 'destroy', 'show']);
    Route::put('/incidents/{id}/validate', [IncidentController::class, 'qualifyIncident']);
    Route::put('/incidents/{id}/reject', [IncidentController::class, 'rejectIncident']);
    Route::get('/users', [ModerationController::class, 'SerchUser']);
    Route::post('users/strike', [ModerationController::class, 'strikeUser']);
    Route::get('/pending-proposals', [ProposalController::class, 'pendingProposals']);
    Route::patch('/proposals/{proposal}/status', [ProposalController::class, 'updateStatus']);
});
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/staff', [StaffController::class, 'store']);
    Route::get('/staff', [StaffController::class, 'index']);
    Route::apiResource('/categories', CategoryIncidentController::class);
    Route::apiResource('/partners', PartnerController::class);
    Route::get('/workflows', [WorkflowController::class, 'getWorkflows']);
    Route::post('/workflows', [WorkflowController::class, 'assignPartnerToCategory']);
    Route::delete('/workflows/{category_id}/{partner_id}', [WorkflowController::class, 'removeWorkflow']);
});

Route::middleware('auth:sanctum')->prefix('editor')->group(function () {

    Route::get('/articles', [ArticleController::class, 'getArticleByEditor']);
    Route::put('/articles/{article}', [ArticleController::class, 'update']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::get('/articles/{id}', [ArticleController::class, 'showEditor']);



    // Route::patch('/articles/status/{article}', [ArticleController::class, 'update']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [ProfileController::class, 'index']);
    Route::put('/profile/info', [ProfileController::class, 'updateInfo']);
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto']);
    Route::put('/profile/location', [ProfileController::class, 'updateLocation']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::delete('/profile/account', [ProfileController::class, 'deleteAccount']);
});
