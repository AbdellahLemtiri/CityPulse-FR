<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Incident;
use App\Models\Partner;
use App\Models\Article;
class TestController extends Controller
{
    public function test()
    {

      $resul = User::with('comments')
    }
}
// $result = app(\App\Http\Controllers\TestController::class)->test();