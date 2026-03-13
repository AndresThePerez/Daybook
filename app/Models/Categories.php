<?php

namespace App\Models;

use App\Models\Base\BaseModel;

class Categories extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name'];

    /**
     * Get the notes for the blog post.
     */
    public function notes()
    {
        return $this->hasMany(Notes::class)->withTrashed();
    }
}
