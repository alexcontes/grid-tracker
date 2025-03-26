<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScanItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('scan_items', function (Blueprint $table) {
            $table->id();
            $table->string('keyword')->nullable();
            $table->string('business');
            $table->string('autocomplete_search');
            $table->string('autocomplete_place_id');
            $table->float('autocomplete_lat',18,15);
            $table->float('autocomplete_lng',18,15);
            $table->float('distance');
            $table->string('distance_type')->nullable();
            $table->integer('grid_size');
            $table->longText('grid_points');
            $table->boolean('status')->default(0);
            $table->string('search_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('scan_items');
    }
}
