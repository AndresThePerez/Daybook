<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Base\BaseController;
use App\Http\Requests\NotesRequest;

use App\Models\Notes;

class NotesController extends BaseController
{
    public function __construct()
    {
        $this->setModel(new Notes);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @param  NotesRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(NotesRequest $request)
    {
        // dd($request);
        if (!$this->validateRequest($request)) {
            return response('An internal error occured');
            // return response($request->errors(), 500);
        }

        if (!$this->getModel()::create($request->all())) {
            return response('Error creating request', 500);
        }

        return response("Successfully created Resource", 200);
    }

    /**
     * Update a resource in the database
     *
     * @param  NotesRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(NotesRequest $request, $id)
    {

        if (!$this->validateRequest($request)) {
            return response($request->errors(), 500);
        }

        if (!$entity = $this->getModel()::find($id)) {
            return response('Could not find resource', 404);
        }

        if (!$entity->update($request->all())) {
            return response('Error updating request', 500);
        };

        return response('Success', 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @param  NotesRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function validateRequest(NotesRequest $request)
    {
        return $request->validated();
    }
}
