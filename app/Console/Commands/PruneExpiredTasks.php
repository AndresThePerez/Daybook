<?php

namespace App\Console\Commands;

use App\Models\Task;
use Illuminate\Console\Command;

class PruneExpiredTasks extends Command
{
    protected $signature = 'tasks:prune';

    protected $description = 'Permanently delete tasks whose TTL has expired';

    public function handle(): int
    {
        $deleted = Task::withoutGlobalScopes()
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->forceDelete();

        $this->info("Pruned {$deleted} expired task(s).");

        return self::SUCCESS;
    }
}
