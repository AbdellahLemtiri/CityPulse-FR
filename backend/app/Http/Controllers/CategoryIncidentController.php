<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CategoryIncident;
use App\Http\Requests\stroeCatgoryIncident;
use Illuminate\Http\Request;
use App\Http\Requests\storeWorkflowRequest;
use Illuminate\Support\Facades\Auth;

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
        ], 201);
    }



    public function getCategoriesForManager()
    {

        $city_id = Auth::guard('sanctum')->user()->city_id;
        $categories = CategoryIncident::whereHas('partners', function ($query) use ($city_id) {
            $query->where('city_id', $city_id);
        })->get();

        return response()->json($categories, 200);
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
