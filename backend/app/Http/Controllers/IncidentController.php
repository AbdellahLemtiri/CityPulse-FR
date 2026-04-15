<?php

namespace App\Http\Controllers;

use App\Notifications\IncidentUpdatedNotification;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIncidentRequest;
use Illuminate\Http\Request;
use App\Models\Incident;
use Illuminate\Support\Facades\Auth;
use App\Services\IncidentService;
use App\Http\Resources\incident\getIncidentResourse;
use App\Http\Requests\UpdateIncidentRequest;
use App\Mail\PartnerIncidentMail;
use Illuminate\Support\Facades\DB;
use App\Models\CategoryIncident;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;

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
    public function index(Request $request)
    {
        $user = Auth::user();
        $roleId = $user->role_id;

        if ($user->hasRole('manager')) {
            $incidents = Incident::where('sector_id', $user->sector_id)
                ->with(['category:id,name',])
                ->latest()
                ->paginate(10);

            return getIncidentResourse::collection($incidents);
        } elseif ($user->hasRole('citoyen')) {
            $incidents = $user->incidents()
                ->with('category:id,name')
                ->latest()
                ->paginate(10);

            return getIncidentResourse::collection($incidents);
        }
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreIncidentRequest $request)
    {
        Gate::authorize('create');
        $user = Auth::user();
        $data = $request->validated();
        $images = $request->file('images', []);
        $audio = $request->file('audio');
        $incident = $this->incidentService->createIncident($data, $user, $images, $audio);
        $incident->load(['media', 'category']);
        return response()->json([
            'message' => 'Incident signalé avec succès',
            'data'    => getIncidentResourse::make($incident)
        ], 201);
    }


    public function qualifyIncident(Request $request, $id, IncidentService $incidentService)
    {
        Gate::authorize('qualifyIncident');
        $manager = Auth::guard('sanctum')->user();

        $request->validate([
            'category_id' => 'required|exists:category_incidents,id'
        ]);

        try {
             $incident = $incidentService->qualify($id, $request->category_id, $manager);
            return response()->json([
                'message' => 'Incident qualifié et partenaire notifié avec succès !',
                'incident' => $incident
            ], 200);
        } catch (\Exception $e) {
             return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    
    public function rejectIncident(Request $request, $id)
    {
        $manager = Auth::guard('sanctum')->user();

        $request->validate([
            'rejection_reason' => 'required|string'
        ]);

        $incident = Incident::findOrFail($id);
        $incident->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'rejected_at' => now(),
        ]);

        return response()->json([
            'message' => 'Incident rejetté avec succès !',
            'incident' => $incident->load(['category', 'partner'])
        ], 200);
    }


    /**
     * show the specified resource in storage.
     */


    public function show(Incident $incident)
    {

        $incident->load([
            'category:id,name',
            'partner:id,name,email,phone_fix,whatsapp,sla_hours',
            'user:id,first_name,last_name,email,phone',
            'media:id,model_id,file_path'
        ]);
        return response()->json($incident, 200);
    }



    public function update($request, string $id) {}

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
