<?php

namespace App\services\proposal;

use App\Models\Proposal;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Storeservice
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function store($data, $request)
    {
        $user = Auth::user();
        DB::beginTransaction();

        try {
            $data['user_id'] = $user->id;
            $data['sector_id'] = $user->sector_id;
            $proposal = Proposal::create($data);
            if ($request->hasFile('images')) {
                $images = $request->file('images');
                foreach ($images as $image) {
                    $path = $image->store('proposals', 'public');
                     $proposal->media()->create([
                        'file_path' => $path,
                         'is_public' => true,
                        'file_type' => 'image'
                    ]);
                }
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }
}
