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


    // app/Http/Controllers/Manager/CategoryController.php (Awla l-Controller li kheddam bih l-Manager)

    public function getCategoriesForManager()
    {
         $city_id = Auth::guard('sanctum')->user()->city_id;
         $categories = CategoryIncident::with(['partners' => function ($query) use ($city_id) {
            $query->where('city_id', $city_id);
        }])->get();
         $formattedCategories = $categories->map(function ($category) {
             $partner = $category->partners->first();
            return [
                'id' => $category->id,
                'name' => $category->name,
                'has_partner' => $partner ? true : false,
                'partner_name' => $partner ? $partner->name : null,
            ];
        });

        return response()->json($formattedCategories, 200);
    }
    public function storeWorkflows(storeWorkflowRequest $request)
    {
        //
        $data = $request->validated();
        $cat = CategoryIncident::findOrFail($data['category_id']);
        $cat->update(['partner_id' => $data['partner_id']]);
        return response()->json([
            'message' => 'le workflow a bien été créee',
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
