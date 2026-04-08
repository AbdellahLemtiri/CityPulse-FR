<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    //
    public function index()
    {
        //
        $user = Auth::user();
        $user->load('role');
        return response()->json($user, 200);
    }
}
