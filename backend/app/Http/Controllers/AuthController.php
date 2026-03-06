<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Auth\Events\Validated;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;
class AuthController extends Controller
{
    //

  public function register(registerRequest $request)
    {
         
        $data = $request->validated(); 
 
        $user = User::create([
            'uuid' => Str::uuid(),  
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),  
            'role_id' => 3,
            'sector_id' => $data['sector_id'], 
            'phone' => $data['telephone'], 
            'cin' => $data['cin'],
            'adresse' => $data['adresse'] ?? null,
        ]);

       
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès',
            'access_token' => $token,
            'user' => $user,
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

        return response()->json([
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'user' => $user,
        ]);
    }
}
