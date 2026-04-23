<?php

use Illuminate\Support\Facades\Broadcast;

 
Broadcast::channel('App.Models.User.{id}', function ($user,int $id) {
     return  $user->id == $id;
}, ['middleware' => ['auth:sanctum']]);