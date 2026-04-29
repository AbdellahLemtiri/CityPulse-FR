<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Partner;
use App\Http\Requests\StorePartnerRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class PartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $partners = Partner::with('logo')->get();
        return response()->json($partners, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePartnerRequest $request)
    {
        Gate::authorize('create', Partner::class);
        return DB::transaction(function () use ($request) {

            $data = $request->validated();

            $user = Auth::user();
            $logoFile = $request->file('logo');
            unset($data['logo']);
            $data['city_id'] = $user->city_id;
            $partner = Partner::create($data);

            if ($logoFile) {
                $filename = uniqid() . '.' . $logoFile->getClientOriginalExtension();
                $logoFile->move(public_path('uploads/partners'), $filename);

                $partner->logo()->create([
                    'file_path' => config('app.url') . '/uploads/partners/' . $filename,
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
