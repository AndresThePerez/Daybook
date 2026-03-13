<?php

namespace App\Models;

use App\Models\Base\BaseModel;

class Notes extends BaseModel
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['title', 'body', 'category_id'];


    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['category'];

    /**
     * Get the category for the blog post.
     */
    public function category()
    {
        return $this->belongsTo(Categories::class)->withTrashed();
    }
}
