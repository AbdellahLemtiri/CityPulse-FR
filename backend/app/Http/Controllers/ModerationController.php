<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\users\searchUsers;
class ModerationController extends Controller
{
    //

    public function SerchUser(searchUsers $request){
        
        $data = $request->validated();
        $users = User::where('last_name', 'like', '%' . $data['search'] . '%')->orWhere('email', 'like', '%' . $data['search'] . '%')->Orwhere('cin', 'like', '%' . $data['search'] . '%')->orWhere('first_name', 'like', '%' . $data['search'] . '%')->get();
        return response()->json($users, 200);
    }
    
    
    //users
}
