<?php

namespace App\Http\Controllers;

use App\Models\DutyPharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreDutyPharmacyRequest;
use App\Http\Requests\UpdateDutyPharmacyRequest;
use Illuminate\Support\Facades\Gate;

class DutyPharmacyController extends Controller
{
    public function index(Request $request)
    {
        $cityId =  Auth::user()->city_id;
        $pharmacies = DutyPharmacy::where('city_id', $cityId)
            ->where('end_date', '>=', now())
            ->orderBy('name', 'asc')
            ->get();

        return response()->json($pharmacies);
    }


    public function journalistIndex(Request $request)
    {
        Gate::authorize('journalistIndex', DutyPharmacy::class);
        $user = Auth::user();
        $search = $request->query('search');

        $pharmacies = DutyPharmacy::where('city_id', $user->city_id)
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name', 'asc')
            ->paginate(10);

        return response()->json($pharmacies);
    }

    public function store(StoreDutyPharmacyRequest $request)
    {
        Gate::authorize('create', DutyPharmacy::class);
        $data = $request->validated();
        $user = Auth::user();
        $data['city_id'] = $user->city_id;
        $data['user_id'] = $user->id;
        $pharmacy = DutyPharmacy::create($data);
        return response()->json(['message' => 'Pharmacie programmée avec succès', 'data' => $pharmacy], 201);
    }


    public function show(DutyPharmacy $dutyPharmacy)
    {
        return response()->json($dutyPharmacy);
    }




    public function update(UpdateDutyPharmacyRequest $request, DutyPharmacy $dutyPharmacy)
    {
        Gate::authorize('update', $dutyPharmacy);
        $user = Auth::user();
        $data = $request->validated();
        $dutyPharmacy->update($data);
        return response()->json(['message' => 'Pharmacie mise à jour avec succès', 'data' => $dutyPharmacy]);
    }



    public function destroy(DutyPharmacy $dutyPharmacy)
    {
        Gate::authorize('delete', $dutyPharmacy);
        $user = Auth::user();
        if ($dutyPharmacy->city_id !== $user->city_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        $dutyPharmacy->delete();
        return response()->json(['message' => 'Pharmacie supprimée avec succès']);
    }
}
