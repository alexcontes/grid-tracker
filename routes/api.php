<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\BusinessesApiController;
use App\Http\Controllers\Api\ListingsApiController;
use App\Http\Controllers\Api\GridsApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix("search_place")->group(function () {
    Route::view("/", "api.search_place");
    Route::post("/store", [GridsApiController::class, "store"]);
    Route::get("/index", [GridsApiController::class, "index"]);
    Route::get("/fetchResults/{id}", [
        GridsApiController::class,
        "fetchResults",
    ]);
    Route::post("/autoComplete", [GridsApiController::class, "autoComplete"]);
    Route::post("/searchPlace", [GridsApiController::class, "searchPlace"]);
});
