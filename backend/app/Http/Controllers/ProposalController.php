<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Proposal;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProposalRequest;
use App\Http\Requests\UpdateProposalRequest;
use App\Http\Resources\proposal\getProposalResource;
use App\services\proposal\Storeservice;
use Illuminate\Http\Request;
class ProposalController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public $storeservice;
    public function __construct()
    {
        $this->storeservice = new Storeservice();
    }

 public function index(Request $request)
{
    $user = Auth::user();
    $role = $user->getRoleNames()->first();

     $query = Proposal::with(['user:id,first_name,last_name', 'sector:id,name', 'media'])
        ->withCount('likes');
        

     if ($request->has('my-proposals')) {
        $query->where('user_id', $user->id);
    } else {
         $query->where('sector_id', $user->sector_id)
              ->where('status', 'validated')->withExists(['likes as is_liked' => function ($q) {
            $q->where('user_id', Auth::id());
        }]);
    }

     $proposals = $query->get();

     return response()->json(getProposalResource::collection($proposals), 200);
}



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProposalRequest $request)
    {

        $user = Auth::user();
        $data = $request->validated();
        $success = $this->storeservice->store($data, $request);

        if (!$success) {
            return response()->json(['message' => 'Erreur lors de l\'envoi de la proposition'], 500);
        } else {
            $proposal = getProposalResource::make($success);
            return response()->json(['message' => 'Proposition envoyé avec succès', 'proposal' => $proposal], 201);
        }
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Proposal $proposal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProposalRequest $request, Proposal $proposal)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Proposal $proposal)
    {
        //
    }
}
