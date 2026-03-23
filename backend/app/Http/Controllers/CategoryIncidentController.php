<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CategoryIncident;
use App\Http\Requests\stroeCatgoryIncident;
class CategoryIncidentController extends Controller
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
    public function store(stroeCatgoryIncident $request)
    {
        //
        $data = $request->validated();
        $category = CategoryIncident::create($data);
        return response()->json([
            'message' => 'Catégorie créée avec succès',
            'category' => $category
        ], 201 );

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
