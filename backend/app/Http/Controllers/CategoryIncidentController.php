<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
 use App\Models\CategoryIncident;
use App\Http\Requests\stroeCatgoryIncident;
use App\Http\Requests\storeWorkflowRequest;
class CategoryIncidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $categories = CategoryIncident::all();
        return response()->json($categories, 200);
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


    public function storeWorkflows(storeWorkflowRequest $request)
    {
        //
        $data = $request->validated();
       $cat = CategoryIncident::findOrFail($data['category_id']);
       $cat->update(['parent_id' => $data['parent_id']]);
         return response()->json([
            'message' => 'le workflow a bien été créee',
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
