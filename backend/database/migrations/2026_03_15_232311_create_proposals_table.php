<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('proposals', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('location_name');
            $table->enum('status', ['pending', 'validated', 'rejected', 'implemented', 'archived'])->default('pending');
            $table->integer('xp_reward')->default(100);  
            $table->foreignId('user_id')->constrained()->onDelete('cascade');  
            $table->foreignId('sector_id')->constrained()->onDelete('cascade');  
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
