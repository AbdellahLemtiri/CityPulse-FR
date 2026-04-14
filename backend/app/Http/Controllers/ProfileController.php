<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\profile\UpdateProfilAvatar;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\profile\userProfileResource;
use App\Http\Requests\profile\UpdateProfileInfo;
use App\Http\Requests\profile\UpdateProfileLocation;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    //
    public function index()
    {
        //
        $user = Auth::user()->load(['photo', 'city', 'sector']);
        return response()->json(new userProfileResource($user), 200);
    }


    public function updateInfo(UpdateProfileInfo $request)
    {
        $user = Auth::user();
        $data = $request->validated();
        $user->update($data);
        return response()->json(['message' => 'Profil modifié avec succès'], 200);
    }



    public function updatePhoto(UpdateProfilAvatar $request)
    {
        $user = Auth::user();

        $image = $request->file('image');
        if ($user->photo) {
            Storage::disk('public')->delete($user->photo->file_path);
            $user->photo()->delete();
        }
        $path = $image->store('avatars', 'public');
        $user->photo()->create([
            'file_path' => $path,
            'file_type' => 'image',
            'is_public' => true,
        ]);



        return response()->json([
            'message' => 'Avatar modifié avec succès',
            'avatar' => $user->photo()->get()
        ]);
    }
    public function updateLocation(UpdateProfileLocation $request)
    {
        $user = Auth::user();

        if ($user->city_changed_at && $user->city_changed_at->addDays(30)->isFuture()) {
             return response()->json([
                'message' => "Vous ne pouvez changer de ville qu'une fois par mois. Réessayez dans jours."
            ], 403);
        }
        $data = $request->validated();
        $user->update($data);
        $user->update(['city_changed_at' => now()]);
        $user = $user->load(['city', 'sector', 'photo']);
        return response()->json($user, 200);
    }

    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();
        return response()->json(['message' => 'Compte supprimé avec succès']);
    }


    
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);
        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);
        return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
    }


    
}
