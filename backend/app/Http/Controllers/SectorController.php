<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreSectorRequest;
use App\Models\Sector;
use Illuminate\Support\Facades\DB;

class SectorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $sectors = Sector::with('logo')->get();
        return response()->json([
            'message' => 'Secteurs récupérés avec succès',
            'sectors' => $sectors
        ], 200);
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
