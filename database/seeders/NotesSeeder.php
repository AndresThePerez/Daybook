<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $notes = [
            // Work (category_id: 1)
            [
                'category_id' => 1,
                'title' => 'Q2 Sprint Planning',
                'body' => 'Prepare backlog items and estimate story points for the next sprint cycle',
                'created_at' => Carbon::now()->subDays(5),
            ],
            [
                'category_id' => 1,
                'title' => 'Update API Documentation',
                'body' => 'Document the new endpoints for the user management module',
                'created_at' => Carbon::now()->subDays(3),
            ],
            [
                'category_id' => 1,
                'title' => 'Code Review Feedback',
                'body' => 'Address PR comments on the authentication refactor before merging',
                'created_at' => Carbon::now()->subDays(1),
            ],

            // Personal (category_id: 2)
            [
                'category_id' => 2,
                'title' => 'Book Dentist Appointment',
                'body' => 'Schedule a cleaning for sometime next month, morning preferred',
                'created_at' => Carbon::now()->subDays(7),
            ],
            [
                'category_id' => 2,
                'title' => 'Plan Weekend Hike',
                'body' => 'Research trails near Mt. Rainier, pack gear and check weather forecast',
                'created_at' => Carbon::now()->subDays(2),
            ],

            // Shopping (category_id: 3)
            [
                'category_id' => 3,
                'title' => 'Grocery Run',
                'body' => 'Eggs, milk, bread, chicken, spinach, olive oil, and coffee beans',
                'created_at' => Carbon::now()->subDays(1),
            ],
            [
                'category_id' => 3,
                'title' => 'New Monitor Stand',
                'body' => 'Look for an adjustable dual monitor arm that clamps to the desk',
                'created_at' => Carbon::now()->subDays(4),
            ],

            // Health (category_id: 4)
            [
                'category_id' => 4,
                'title' => 'Morning Run Schedule',
                'body' => 'Run 3 miles on Monday, Wednesday, Friday before work',
                'created_at' => Carbon::now()->subDays(6),
            ],
            [
                'category_id' => 4,
                'title' => 'Meal Prep Sunday',
                'body' => 'Prep grilled chicken, brown rice, and roasted vegetables for the week',
                'created_at' => Carbon::now()->subDays(2),
            ],

            // Finance (category_id: 5)
            [
                'category_id' => 5,
                'title' => 'Review Monthly Budget',
                'body' => 'Check spending against budget categories and adjust savings goals',
                'created_at' => Carbon::now()->subDays(8),
            ],
            [
                'category_id' => 5,
                'title' => 'Renew Car Insurance',
                'body' => 'Policy expires next month, compare quotes from at least three providers',
                'created_at' => Carbon::now()->subDays(3),
            ],

            // Education (category_id: 6)
            [
                'category_id' => 6,
                'title' => 'Finish Laravel Course',
                'body' => 'Complete the remaining sections on middleware, events, and queues',
                'created_at' => Carbon::now()->subDays(10),
            ],
            [
                'category_id' => 6,
                'title' => 'Read Clean Code Ch. 5-7',
                'body' => 'Focus on formatting, objects vs data structures, and error handling chapters',
                'created_at' => Carbon::now()->subDays(4),
            ],
        ];

        foreach ($notes as $note) {
            DB::table('notes')->insert([
                'category_id' => $note['category_id'],
                'title' => $note['title'],
                'body' => $note['body'],
                'created_at' => $note['created_at'],
                'updated_at' => $note['created_at'],
            ]);
        }

        // Soft-deleted notes for the History page
        $deletedNotes = [
            [
                'category_id' => 1,
                'title' => 'Old Standup Notes',
                'body' => 'Notes from last month daily standups, no longer relevant',
                'created_at' => Carbon::now()->subDays(30),
                'deleted_at' => Carbon::now()->subDays(10),
            ],
            [
                'category_id' => 2,
                'title' => 'Cancel Gym Membership',
                'body' => 'Switch from downtown gym to the one closer to home',
                'created_at' => Carbon::now()->subDays(20),
                'deleted_at' => Carbon::now()->subDays(5),
            ],
        ];

        foreach ($deletedNotes as $note) {
            DB::table('notes')->insert([
                'category_id' => $note['category_id'],
                'title' => $note['title'],
                'body' => $note['body'],
                'created_at' => $note['created_at'],
                'updated_at' => $note['created_at'],
                'deleted_at' => $note['deleted_at'],
            ]);
        }
    }
}
