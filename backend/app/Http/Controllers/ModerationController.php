<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\users\searchUsers;
use App\Http\Requests\users\strikUserRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Role;
use  App\Http\Resources\ModirationUserResource;
class ModerationController extends Controller
{
    //

    public function SerchUser(searchUsers $request)
    {
        $sectorId = Auth::user()->sector_id;
        $roleId = Role::where('name', 'citoyen')->first()->id;

        $data = $request->validated();

        $users = User::where('sector_id', $sectorId)
            ->where('role_id', $roleId)
            ->where(function ($query) use ($data) {
                $query->where('last_name', 'like', '%' . $data['search'] . '%')
                    ->orWhere('email', 'like', '%' . $data['search'] . '%')
                    ->orWhere('cin', 'like', '%' . $data['search'] . '%');
            })
            ->with('strikes')
            ->get();

            $users = ModirationUserResource::collection($users);
        return response()->json($users, 200);
    }


  public function strikeUser(strikUserRequest $request)
{
    $data = $request->validated();

     $user = User::with('strikes')->findOrFail($data['id']);

     $user->strikes()->create([
        'reason' => $data['reason'],
      
    ]);

   
    if ($user->strikes()->count() >= 3) {
        $user->update(['is_banned' => true]);
    }

     return response()->json(new ModirationUserResource($user), 200);
}
}
