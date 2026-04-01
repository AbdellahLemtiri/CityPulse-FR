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

    public function index()
    {
        //
        $user = Auth::user();
        $proposals = Proposal::where('sector_id', $user->sector_id)
            ->where('status', 'pending')
            ->with([
                'user:id,first_name,last_name',
                'sector:id,name',
                'media:id,file_path'
            ])
            ->withCount('likes')
            ->withExists([
                'likes as is_liked' => function ($q) {
                    $q->where('user_id', Auth::id());
                }
            ])
            ->get();

        return response()->json(getProposalResource::collection($proposals), 200);
    }

    public function MyProposals()
    {
        //
        $user = Auth::user();
        $proposals = Proposal::where('user_id', $user->id)->get();
        return response()->json($proposals, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProposalRequest $request)
    {

        $user = Auth::user();
        $data = $request->validated();
        $success = $this->storeservice->store($data, $request);
        if ($success) {
            return response()->json(['message' => 'Proposition envoyé avec succès'], 201);
        } else {
            return response()->json(['message' => 'Erreur lors de l\'envoi de la proposition'], 500);
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
