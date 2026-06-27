<?php

namespace Tests\Unit;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PruneExpiredTasksTest extends TestCase
{
    use RefreshDatabase;

    public function test_prune_removes_only_expired_rows(): void
    {
        $keep = Task::factory()->create(['expires_at' => null]);
        $expired = Task::factory()->expired()->create();
        $future = Task::factory()->create(['expires_at' => now()->addDay()]);

        $this->artisan('tasks:prune')->assertExitCode(0);

        // Query raw table to bypass the global scope.
        $remaining = DB::table('tasks')->pluck('id');
        $this->assertTrue($remaining->contains($keep->id));
        $this->assertFalse($remaining->contains($expired->id));
        $this->assertTrue($remaining->contains($future->id));
    }
}
