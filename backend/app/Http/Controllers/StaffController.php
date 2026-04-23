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
use App\Http\Resources\StaffResource;
class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $admin = Auth::user();
        $staffs = User::role(['manager', 'journaliste'])->where('city_id', $admin->city_id)->get();

        return response()->json(StaffResource::collection($staffs), 200);
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
        $data = $request->validated();

        $roleName = $data['role'];
        unset($data['role']);

        $data['password'] = Hash::make($data['password']);
        $sector = Sector::findOrFail($data['sector_id']);
        $data['city_id'] = $sector->city_id;
        $data['uuid'] = (string) Str::uuid();

        $user = User::create($data);

        $user->assignRole($roleName);

        $user->load(['sector', 'city']);

        return response()->json([
            StaffResource::make($user) , 'message' => 'Staff created successfully'        
        ], 201);
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
