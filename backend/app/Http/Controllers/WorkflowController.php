<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CategoryIncident;
use App\Models\Partner;
use Illuminate\Support\Facades\DB;

class WorkflowController extends Controller
{
     public function getWorkflows()
    { 
        $workflows = DB::table('category_partner')
            ->join('category_incidents', 'category_partner.category_incident_id', '=', 'category_incidents.id')
            ->join('partners', 'category_partner.partner_id', '=', 'partners.id')
            ->select(
                'category_partner.id as pivot_id',  
                'category_incidents.name as category_name',
                'category_incidents.id as category_id',
                'partners.name as partner_name',
                'partners.id as partner_id'
            )
            ->get();

        return response()->json($workflows, 200);
    }

     public function assignPartnerToCategory(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:category_incidents,id',
            'partner_id' => 'required|exists:partners,id',
        ]);

        $category = CategoryIncident::findOrFail($request->category_id);
        $partnerId = $request->partner_id;

         if ($category->partners()->where('partner_id', $partnerId)->exists()) {
            return response()->json(['message' => 'Cette règle existe déjà.'], 400);
        }

         $category->partners()->attach($partnerId);

        return response()->json(['message' => 'Règle d\'affectation créée avec succès.'], 201);
    }

     public function removeWorkflow($category_id, $partner_id)
    {

        $category = CategoryIncident::findOrFail($category_id);
         $category->partners()->detach($partner_id);
        return response()->json(['message' => 'Règle supprimée avec succès.'], 200);

    }


 }