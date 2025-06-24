<?php

namespace App\Listeners;

use App\Events\TaskCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendTaskNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TaskCreated $event): void
    {
        // Log the notification for debugging
        Log::info('Task notification sent', [
            'task_id' => $event->task->id,
            'task_title' => $event->task->title,
            'user_id' => $event->task->user_id,
        ]);

        // You can add additional notification logic here
        // For example, sending email notifications, SMS, etc.
    }
}
