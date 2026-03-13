<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Base\BaseController;
use App\Http\Requests\CategoriesRequest;
use App\Models\Categories;

class CategoriesController extends BaseController
{
    public function __construct()
    {
        $this->setModel(new Categories);
    }

    /**
     * Storing the resource after validation
     *
     * @param  CategoriesRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(CategoriesRequest $request)
    {
        if (!$this->validateRequest($request)) {
            return response($request->errors(), 500);
        }

        if (!$this->getModel()::create($request->all())) {
            return response('Error creating request', 500);
        }

        return response("Successfully created Resource", 200);
    }

    /**
     * Update a resource in the database
     *
     * @param  CategoriesRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CategoriesRequest $request, $id)
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
     * @param  CategoriesRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function validateRequest(CategoriesRequest $request)
    {
        return $request->validated();
    }
}
