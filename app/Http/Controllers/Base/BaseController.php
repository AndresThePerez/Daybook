<?php

namespace App\Http\Controllers\Base;

class BaseController extends Controller
{

    private $model;

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $entity = $this->getModel()::findOrFail($id);
        if (!$entity) {
            return response('Could not find the requested Resource', 404);
        }

        return $entity;
    }

    /**
     * Soft Delete a resource in the database
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete($id)
    {
        $entity = $this->getModel()::where('id', $id);

        if ($entity->count() === 0) {
            return response('Could not find the requested Resource', 404);
        }

        if (!$entity->delete()) {
            return response('Error deleting requested resource', 500);
        };

        return response('Success', 200);
    }

    /**
     * Read all resources in the database
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showAll()
    {
        return $this->getModel()::all();
    }

    /**
     * Soft Delete all resource in the database
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function history()
    {
        return $this->getModel()->history();
    }


    /**
     * Soft Delete all resource in the database
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyAll()
    {
        return $this->getModel()::get()->delete();
    }


    protected function setModel($value)
    {
        $this->model = $value;
    }

    protected function getModel()
    {
        return $this->model;
    }
}
