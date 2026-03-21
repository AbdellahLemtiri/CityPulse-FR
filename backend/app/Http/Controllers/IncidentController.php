<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIncidentRequest;
use Illuminate\Http\Request;
use App\Models\Incident;
use Illuminate\Support\Facades\Auth;
use App\Services\IncidentService;

class IncidentController extends Controller
{



    protected $incidentService;

    // Injection de dépendance (DI) dial l-Service
    public function __construct(IncidentService $incidentService)
    {
        $this->incidentService = $incidentService;
    }
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
        $user = Auth::user();
        $data = $request->validated();

        // N-frezou les fichiers 3la d-data
        $images = $request->file('images', []);
        $audio = $request->file('audio');

        // N-ssiftou kolchi l-Service y-t-kellef
        $incident = $this->incidentService->createIncident($data, $user, $images, $audio);

        return response()->json([
            'message' => 'Incident signalé avec succès',
            'data'    => $incident->load('media') // Kan-rj3ou l-incident m3a tsawer dialo l-React bach y-t2afficha nishan
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
