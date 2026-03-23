<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Partner;
use App\Http\Requests\StorePartnerRequest;

class PartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePartnerRequest $request)
    {
        return DB::transaction(function () use ($request) {

            $data = $request->validated();

            $logoFile = $request->file('logo');
            unset($data['logo']);

            $partner = Partner::create($data);

            if ($logoFile) {
                $path = $logoFile->store('partners/logos', 'public');

                $partner->logo()->create([
                    'file_path' => $path,
                    'file_type' => 'image',
                    'is_public' => true
                ]);
            }

            return response()->json([
                'message' => 'Partenaire créé avec succès',
                'partner' => $partner->load('logo')
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
