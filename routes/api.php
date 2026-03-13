<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\NotesController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes here are prefixed with /api and have the 'throttle:api'
| middleware (60 req/min) applied by default via RouteServiceProvider.
| Write operations get an additional stricter limit (15 req/min).
|
*/

Route::controller(NotesController::class)->group(function () {

    Route::get('/notes/showAll', 'showAll');
    Route::get('/notes/history', 'history');
    Route::get('/notes/{id}', 'show');
    Route::get('/{id}', 'show');

    Route::middleware('throttle:api-write')->group(function () {
        Route::post('/notes/create', 'store');
        Route::put('/notes/edit/{id}', 'update');
        Route::delete('/notes/delete/{id}', 'delete');
        Route::delete('/notes/deleteAll', 'deleteAll');
    });
});

Route::controller(CategoriesController::class)->group(function () {

    Route::get('/categories/showAll', 'showAll');
    Route::get('/categories/history', 'history');
    Route::get('/categories/{id}', 'show');

    Route::middleware('throttle:api-write')->group(function () {
        Route::post('/categories/create', 'store');
        Route::put('/categories/edit/{id}', 'update');
        Route::delete('/categories/delete/{id}', 'delete');
        Route::delete('/categories/deleteAll', 'deleteAll');
    });
});
