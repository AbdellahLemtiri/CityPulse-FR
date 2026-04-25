<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\auth\LoginRequest;
use App\Http\Requests\auth\RegisterRequest;
use Illuminate\Auth\Events\Validated;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Sector;
use App\Http\Resources\UserResource;
use App\Http\Resources\profile\userProfileResource;

class AuthController extends Controller
{
    //

    public function register(registerRequest $request)
    {

        $data = $request->validated();

        $sector = Sector::find($data['sector_id']);
        $user = User::create([
            'uuid' => Str::uuid(),
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'sector_id' => $sector->id,
            'phone' => $data['telephone'],
            'cin' => $data['cin'],
            'adresse' => $data['adresse'] ?? null,
            'city_id' => $sector->city_id
        ]);

        $user->assignRole('citoyen');
        // $request->session()->regenerate();

        $token = $user->createToken('CityPulseToken')->plainTextToken;

        $user->load(['sector', 'city', 'photo']);
        return response()->json([
            'message' => 'Compte créé avec succès',
            'user' => new userProfileResource($user),
            'token' => $token
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        if (!Auth::attempt($data)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        // $request->session()->regenerate();

        $user = User::where('email', $data['email'])->firstOrFail();
        $user->load(['sector', 'city', 'photo']);
        $token = $user->createToken('CityPulseToken')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => new userProfileResource($user),
            'token' => $token
        ]);
    }


    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Deconnexion réussie']);
    }
}
