<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProcessItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('process_items', function (Blueprint $table) {
            $table->id();
            $table->string('process_id');
            $table->bigInteger('scan_id')->unsigned()->index();
            $table->float('lat',18,15);
            $table->float('long',18,15);
            $table->text('results')->nullable();
            $table->integer('rank')->nullable();
            $table->boolean('status')->default(0);
            $table->timestamps();

            $table->foreign('scan_id')->references('id')->on('scan_items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('process_items');
    }
}
