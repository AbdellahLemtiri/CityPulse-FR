<?php
putenv('CLOUDINARY_URL=cloudinary://317913145597975:CSjv2TKnr1rbbYU1W3hob6RPmS4@dyp54bpos');
$_ENV['CLOUDINARY_URL'] = 'cloudinary://317913145597975:CSjv2TKnr1rbbYU1W3hob6RPmS4@dyp54bpos';
$_SERVER['CLOUDINARY_URL'] = 'cloudinary://317913145597975:CSjv2TKnr1rbbYU1W3hob6RPmS4@dyp54bpos';

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CheckBannedSector;
use App\Http\Middleware\CheckBannedUser;
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        channels: __DIR__ . '/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        $middleware->alias([
            'abilities' => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
            'ability' => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'not_banned' => CheckBannedUser::class,
            'active_sector' => CheckBannedSector::class
        ]);
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
