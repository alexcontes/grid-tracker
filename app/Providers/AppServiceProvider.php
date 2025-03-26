<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;

use Illuminate\Queue\Events\JobProcessed;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
        Event::listen('Illuminate\Database\Events\QueryExecuted', function ($query) {
            // filter oauth ones
            if (!str_contains($query->sql, 'oauth')) {
                Log::debug($query->sql . ' - ' . serialize($query->bindings));
            }
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Queue::after(function (JobProcessed $event) {
        //     var_dump($event->connectionName);
        //     var_dump($event->job);
        //     var_dump($event->job->payload());

        //     file_put_contents(base_path("storage/job_processed.txt"), "asd123");
        // });
    }
}
