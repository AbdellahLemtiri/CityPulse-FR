<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreStaffRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Sector;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $admin = Auth::user();
        $staffs = User::where('city_id', $admin->city_id)->whereIn('role_id', [2, 4])->with('role')->get();
        return response()->json($staffs);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStaffRequest $request)
    {
        //  

      
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $sector = Sector::findOrFail($data['sector_id']);
        $data['city_id'] = $sector->city_id;
        $data['uuid'] = Str::uuid();
        User::create($data);
        $user = User::where('email', $data['email'])->with('role')->firstOrFail();
        return response()->json(['message' => 'Staff créé avec succès', 'user' => $user], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
