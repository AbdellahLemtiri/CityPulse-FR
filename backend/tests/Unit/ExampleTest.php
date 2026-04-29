<?php

namespace Tests\Unit;
 
use App\Models\User;
 $users = User::getUsersByRole('citoyen');
    echo $users;



    use App\Models\Article;

$articles = Article::with(['comments'=>function($q){
    $q->whereNull('parent_id')->with('replies');
}])->findOrFail(1);

