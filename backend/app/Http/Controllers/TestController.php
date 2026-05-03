<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Incident;
use App\Models\Partner;
use App\Models\Article;
use App\Models\Comment;
class TestController extends Controller
{
    public function test()
    {

      $resul = Comment::withCount('replies');
      return $resul;
    }
}









// $result = app(\App\Http\Controllers\TestController::class)->test();





//has('count',> 5)
// strtoupper