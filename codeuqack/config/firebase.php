<?php

declare(strict_types=1);

return [
    /*
     * ------------------------------------------------------------------------
     * Default Firebase project
     * ------------------------------------------------------------------------
     */

    'default' => env('FIREBASE_PROJECT_ID'),

    /*
     * ------------------------------------------------------------------------
     * Firebase project configurations
     * ------------------------------------------------------------------------
     */

   'projects' => [
    env('FIREBASE_PROJECT_ID') => [
        'credentials' => [
            'file' => env('FIREBASE_CREDENTIALS', env('GOOGLE_APPLICATION_CREDENTIALS')),
        ],
        'database' => [
            'url' => env('FIREBASE_DATABASE_URL'),
        ],
        'storage' => [
            'default_bucket' => env('FIREBASE_STORAGE_DEFAULT_BUCKET'),
        ],
    ],
],

];
