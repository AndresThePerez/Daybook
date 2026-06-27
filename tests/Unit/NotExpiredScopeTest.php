<?php

namespace Tests\Unit;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotExpiredScopeTest extends TestCase
{
    use RefreshDatabase;

    public function test_permanent_and_future_tasks_are_visible_expired_are_hidden(): void
    {
        $permanent = Task::factory()->create(['expires_at' => null]);
        $future = Task::factory()->create(['expires_at' => now()->addHour()]);
        $expired = Task::factory()->expired()->create();

        $ids = Task::query()->pluck('id');

        $this->assertTrue($ids->contains($permanent->id));
        $this->assertTrue($ids->contains($future->id));
        $this->assertFalse($ids->contains($expired->id));
    }
}
