<?php

namespace App\Http\Controllers;

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

    
    public function qualifyIncident(Request $request, $id)
    {
        
       
        $request->validate([
            'category_id' => 'required|exists:category_incidents,id'
        ]);

        return DB::transaction(function () use ($request, $id) {
             $incident = Incident::findOrFail($id);

           
            $category = CategoryIncident::findOrFail($request->category_id);
            $partner = $category->partners()->where('city_id', $incident->city_id)->first();

            if (!$partner) {
                return response()->json(['message' => 'Erreur : Aucun partenaire assigné à cette catégorie dans cette ville.'], 400);
            }

             $incident->update([
                'category_incident_id' => $category->id,
                'partner_id' => $partner->id,
                'status' => 'in_progress',
                'qualified_at' => now(),  
            ]);

           
            Mail::to($partner->email)->send(new PartnerIncidentMail($incident, $partner));

            return response()->json([
                'message' => 'Incident qualifié et partenaire notifié avec succès !',
                'incident' => $incident->load(['category', 'partner'])  
            ], 200);
        });
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
