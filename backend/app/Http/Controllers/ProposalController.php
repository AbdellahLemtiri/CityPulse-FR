<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Proposal;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProposalRequest;
use App\Http\Requests\UpdateProposalRequest;

class ProposalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $user = Auth::user();
        $proposals = Proposal::where('sector_id', $user->sector_id)->get();
        return response()->json($proposals, 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProposalRequest $request)
    {
        //

        $user = Auth::user();
        $data = $request->validated();
        $data['user_id'] = $user->id;
        $data['sector_id'] = $user->sector_id;
        $proposal = Proposal::create(
            $data
        );
        if ($request->hasFile('images')) {
            $images = $request->files('images');
            foreach ($images as $image) {
                $path = $image->store('proposals', 'public');
                $name = $image->getClientOriginalName();
                $proposal->media()->create([
                    'file_path' => $path,
                    'file_name' => $name,
                    'is_public' => true,
                    'file_type' => 'image'
                ]);
            }
        }

        return response()->json([
            'message' => 'Proposition envoyée',
            'proposal' => $proposal->load('media')
        ]);
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
