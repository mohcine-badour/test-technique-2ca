<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\User;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user (or create one if none exists)
        $user = User::first();
        
        if (!$user) {
            $this->command->info('No user found. Please create a user first.');
            return;
        }

        $tasks = [
            [
                'title' => 'Complete project documentation',
                'description' => 'Write comprehensive documentation for the API project',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => now()->addDays(7),
            ],
            [
                'title' => 'Review code changes',
                'description' => 'Review pull requests and provide feedback',
                'status' => 'in_progress',
                'priority' => 'medium',
                'due_date' => now()->addDays(2),
            ],
            [
                'title' => 'Setup development environment',
                'description' => 'Configure local development environment for new team members',
                'status' => 'completed',
                'priority' => 'low',
                'due_date' => now()->subDays(1),
            ],
            [
                'title' => 'Plan next sprint',
                'description' => 'Organize and plan tasks for the upcoming sprint',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(5),
            ],
            [
                'title' => 'Fix bug in authentication',
                'description' => 'Investigate and fix the authentication bug reported by users',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(1),
            ],
        ];

        foreach ($tasks as $taskData) {
            $user->tasks()->create($taskData);
        }

        $this->command->info('Tasks seeded successfully!');
    }
}
