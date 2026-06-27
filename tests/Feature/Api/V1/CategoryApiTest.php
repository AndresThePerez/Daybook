<?php

namespace Tests\Feature\Api\V1;

use App\Models\Category;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_categories(): void
    {
        Category::factory()->count(3)->create();

        $this->getJson('/api/v1/categories')
            ->assertOk()
            ->assertJsonStructure(['data', 'links', 'meta'])
            ->assertJsonCount(3, 'data');
    }

    public function test_store_creates_category(): void
    {
        $this->postJson('/api/v1/categories', ['name' => 'Errands'])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Errands');

        $this->assertDatabaseHas('categories', ['name' => 'Errands']);
    }

    public function test_store_requires_unique_name(): void
    {
        Category::factory()->create(['name' => 'Work']);

        $this->postJson('/api/v1/categories', ['name' => 'Work'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_show_missing_returns_404(): void
    {
        $this->getJson('/api/v1/categories/999')->assertNotFound();
    }

    public function test_update_changes_name(): void
    {
        $category = Category::factory()->create();

        $this->putJson("/api/v1/categories/{$category->id}", ['name' => 'Renamed'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Renamed');
    }

    public function test_destroy_soft_deletes_and_returns_204(): void
    {
        $category = Category::factory()->create();

        $this->deleteJson("/api/v1/categories/{$category->id}")->assertNoContent();
        $this->assertSoftDeleted('categories', ['id' => $category->id]);
    }

    public function test_index_includes_active_task_count(): void
    {
        $category = Category::factory()->create();
        Task::factory()->count(2)->for($category)->create();
        $trashed = Task::factory()->for($category)->create();
        $trashed->delete();

        $this->getJson('/api/v1/categories')
            ->assertOk()
            ->assertJsonPath('data.0.tasks_count', 2);
    }
}
