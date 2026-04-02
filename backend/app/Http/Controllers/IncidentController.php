<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIncidentRequest;
use Illuminate\Http\Request;
use App\Models\Incident;
use Illuminate\Support\Facades\Auth;
use App\Services\IncidentService;
use App\Http\Resources\incident\getIncidentResourse;

class IncidentController extends Controller
{



    protected $incidentService;

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

        $user = Auth::user();
        if ($user->role_id === 2) {
            $incidents = Incident::where('sector_id', $user->sector_id)->with(['user:id,first_name,last_name','category:name'])  ->latest()->paginate(10);
            return getIncidentResourse::collection($incidents);
        } elseif ($user->role_id === 3) {
            $incidents = Incident::where('sector_id', $user->sector_id)->latest()->paginate(10);
            return getIncidentResourse::collection($incidents);
        }

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
        $images = $request->file('images', []);
        $audio = $request->file('audio');
        $incident = $this->incidentService->createIncident($data, $user, $images, $audio);
        return response()->json([
            'message' => 'Incident signalé avec succès',
            'data'    => $incident->load('media')
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
