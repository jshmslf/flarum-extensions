<?php

namespace Knowz\CustomAds\Model;

use Flarum\Database\AbstractModel;

class CustomAd extends AbstractModel
{
    protected $table = 'custom_ads';

    protected $fillable = ['title', 'description', 'image_url', 'url', 'position', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
        'position' => 'integer',
    ];
}