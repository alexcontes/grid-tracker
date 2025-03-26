# grid-tracker

Steps to install:

1. Generate an .env file (use .env.example as base)
2. Create a MySQL Database
3. Add your Google API Key and MySQL DB connection in .env
4. Execute migration command to build the database: **php artisan migrate**
5. Execute command to run the application: **php artisan serve**
6. Copy the outputted URL in your browser to open the application
7. In another terminal run command to process queued jobs: **php artisan queue:work --queue=process_grid_tracker**

Environment:

- MySQL **5.6**
- PHP **7.3**

Going Live:

When publishing on a live server, i suggest using supervisor to run queued jobs without having to manually process them like shown above at step #7.

More information about superisor here: https://laravel.com/docs/12.x/queues#supervisor-configuration
