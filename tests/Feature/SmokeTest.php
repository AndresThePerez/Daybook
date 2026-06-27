<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SmokeTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeded_notes_endpoint_returns_data(): void
    {
        $this->seed();

        $response = $this->getJson('/api/notes/showAll');

        $response->assertOk();
        $this->assertGreaterThan(0, count($response->json()));
    }
}
