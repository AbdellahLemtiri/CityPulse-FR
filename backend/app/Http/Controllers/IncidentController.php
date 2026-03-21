<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIncidentRequest;
use Illuminate\Http\Request;
use App\Models\Incident;
use Illuminate\Support\Facades\Auth;
class IncidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //


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
    public function store(StoreIncidentRequest $request)
    {
        //
        $user = Auth::user();
        $data = $request->validated();
        
        $data['sector_id'] = $user->sector_id;
        $data['user_id'] = $user->id;
        Incident::create($data);
        return response()->json(['message' => 'Incident créé avec succès'], 201);
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
    public function update($request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Incident $incident)

    {
        //
        $incident->softDelete();
        return response()->json(['message' => 'Incident supprimé avec succès'], 200);
    }
}
