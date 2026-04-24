<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\CategoryIncidentController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\cityController;
use App\Http\Controllers\WorkflowController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ModerationController;
use App\Http\Controllers\DutyPharmacyController;
use App\Http\Controllers\NotificationControlller;
use App\Http\Controllers\Auth\PasswordResetController;
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Data publique
Route::get('/cities', [cityController::class, 'index']);
Route::get('/sectors/city', [SectorController::class, 'index']);
Route::get('/articles/shared/{slug}', [ArticleController::class, 'showBySlug']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetCode']);
Route::post('/verify-reset-code', [PasswordResetController::class, 'verifyCode']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
/*
|--------------------------------------------------------------------------
|  Pour TOUS les utilisateurs
|--------------------------------------------------------------------------
*/
Broadcast::routes(['middleware' => ['auth:sanctum']]);

Route::middleware('auth:sanctum','active_sector','not_banned')->group(function () {


    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [ProfileController::class, 'index']);
    Route::put('/profile/info', [ProfileController::class, 'updateInfo']);
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto']);
    Route::put('/profile/location', [ProfileController::class, 'updateLocation']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::delete('/profile/account', [ProfileController::class, 'deleteAccount']);

    Route::get('/notifications', [NotificationControlller::class, 'index']);
    Route::post('/notifications/mark-as-read', [NotificationControlller::class, 'markAllAsRead']);

    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/incidents', [IncidentController::class, 'index']);

    Route::post('/incidents', [IncidentController::class, 'store']);

    Route::get('/proposals', [ProposalController::class, 'index']);
    Route::post('/proposals', [ProposalController::class, 'store']);

    Route::get('/comments', [CommentController::class, 'index']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    Route::post('/likes/toggle', [LikeController::class, 'toggle']);

    Route::get('/duty-pharmacies', [DutyPharmacyController::class, 'index']);
});

/*
|--------------------------------------------------------------------------
|  ROUTES ADMIN
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/users', [ModerationController::class, 'SerchUser']);
    Route::post('/users/ban', [ModerationController::class, 'toggleBan']);

    Route::get('/staff', [StaffController::class, 'index']);
    Route::post('/staff', [StaffController::class, 'store']);
    Route::post('/sectors', [SectorController::class, 'store']);
    Route::put('/sectors/{sector}', [SectorController::class, 'update']);
    Route::apiResource('/categories', CategoryIncidentController::class);
    Route::apiResource('/partners', PartnerController::class);

    Route::get('/workflows', [WorkflowController::class, 'getWorkflows']);
    Route::post('/workflows', [WorkflowController::class, 'assignPartnerToCategory']);
    Route::delete('/workflows/{category_id}/{partner_id}', [WorkflowController::class, 'removeWorkflow']);
});

/*
|--------------------------------------------------------------------------
|  ROUTES MANAGER 
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:manager','not_banned'])->prefix('manager')->group(function () {
    Route::get('/categories', [CategoryIncidentController::class, 'getCategoriesForManager']);

    Route::resource('/incidents', IncidentController::class)->only(['index', 'destroy', 'show']);
    Route::put('/incidents/{id}/validate', [IncidentController::class, 'qualifyIncident']);
    Route::put('/incidents/{id}/reject', [IncidentController::class, 'rejectIncident']);
    Route::put('/incidents/{incident}/resolve', [IncidentController::class, 'ResolveIncident']);

    Route::get('/users', [ModerationController::class, 'SerchUser']);
    Route::post('/users/strike', [ModerationController::class, 'strikeUser']);

    Route::get('/pending-proposals', [ProposalController::class, 'pendingProposals']);
    Route::patch('/proposals/{proposal}/status', [ProposalController::class, 'updateStatus']);
});

/*
|--------------------------------------------------------------------------
|  ROUTES editor  journaliste et manager 
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:journaliste|manager','not_banned'])->prefix('editor')->group(function () {
    Route::get('/articles', [ArticleController::class, 'getArticlesByEditor']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::get('/articles/{article:slug}', [ArticleController::class, 'showEditor']);
    Route::put('/articles/{article:slug}', [ArticleController::class, 'update']);
    Route::delete('/articles/{article:slug}', [ArticleController::class, 'destroy']);
});


/*
|--------------------------------------------------------------------------
|  ROUTES des journaliste pour gere les pharmacys
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:journaliste','not_banned'])->group(function () {
    Route::get('/pharmacies', [DutyPharmacyController::class, 'journalistIndex']);
    Route::post('/pharmacies', [DutyPharmacyController::class, 'store']);
    Route::get('/pharmacies/{dutyPharmacy}', [DutyPharmacyController::class, 'show']);
    Route::put('/pharmacies/{dutyPharmacy}', [DutyPharmacyController::class, 'update']);
    Route::delete('/pharmacies/{dutyPharmacy}', [DutyPharmacyController::class, 'destroy']);
});
