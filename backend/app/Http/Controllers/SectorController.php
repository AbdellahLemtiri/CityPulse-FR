<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Sector\StoreSectorRequest;
use App\Models\Sector;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class SectorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if ($user) {
            $city_id = $user->city_id;
        } else {
            $request->validate([
                'city_id' => 'required|integer|exists:cities,id'
            ]);

            $city_id = $request->input('city_id');
        }
        $sectors = Sector::where('city_id', $city_id)->with('logo')->get();
        return response()->json($sectors, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSectorRequest $request)
    {
        return DB::transaction(function () use ($request) {

            $data = $request->validated();

            $logoFile = $request->file('logo');
            unset($data['logo']);

            $sector = Sector::create($data);

            if ($logoFile) {
                $path = $logoFile->store('sectors/logos', 'public');

                $sector->logo()->create([
                    'file_path' => $path,
                    'file_type' => 'image',
                    'is_public' => true
                ]);
            }

            return response()->json([
                'message' => 'Secteur créé avec succès',
                'sector'  => $sector->load('logo')
            ], 201);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
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
