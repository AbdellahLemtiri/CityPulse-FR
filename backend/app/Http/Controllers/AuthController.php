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
use App\Models\Role;
use App\Http\Resources\UserResource;
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
            'role_id' => Role::where('name', 'citoyen')->first()->id,
            'sector_id' => $sector->id,
            'phone' => $data['telephone'],
            'cin' => $data['cin'],
            'adresse' => $data['adresse'] ?? null,
            'city_id' => $sector->city_id
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $user->load(['role', 'sector', 'city']);
        return response()->json([
            'message' => 'Compte créé avec succès',
            'access_token' => $token,
            'user' => new UserResource($user),
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        if (!Auth::attempt($data)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        $user = User::where('email', $data['email'])->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;
        $user->load(['role', 'sector', 'city']);
        return response()->json([
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'user' => new UserResource($user),
        ]);
    }
}
