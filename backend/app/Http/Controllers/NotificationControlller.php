<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationControlller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()->limit(20)->get();

        return response()->json($notifications);
    }


    public function markAllAsRead(Request $request)
    {
         $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'message' => 'Toutes les notifications ont été marquées comme lues.'
        ]);
    }
}
