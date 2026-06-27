<?php

namespace App\Models;

use App\Models\Scopes\NotExpiredScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ScopedBy([NotExpiredScope::class])]
class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['title', 'body', 'category_id', 'expires_at'];

    protected $with = ['category'];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class)->withTrashed();
    }
}
