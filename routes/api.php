<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('jobs', 'JobPostController@index');
Route::get('jobs/{id}', 'JobPostController@show');
Route::post('jobs', 'JobPostController@store');
Route::put('jobs/{job}', 'JobPostController@update');
Route::post('jobs/{id}/stateTransition', 'JobPostController@stateTransition');
//Route::delete('jobs/{job}', 'JobPostController@delete');
