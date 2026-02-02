<?php

use Flarum\Extend;
use Knowz\CustomAds\Api\Controller;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    (new Extend\Routes('api'))
        ->get('/custom-ads', 'custom-ads.index', Controller\ListCustomAdsController::class)
        ->post('/custom-ads', 'custom-ads.create', Controller\CreateCustomAdController::class)
        ->patch('/custom-ads/{id}', 'custom-ads.update', Controller\UpdateCustomAdController::class)
        ->delete('/custom-ads/{id}', 'custom-ads.delete', Controller\DeleteCustomAdController::class),
];