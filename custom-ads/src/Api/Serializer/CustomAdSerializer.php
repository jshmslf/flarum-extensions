<?php

namespace Knowz\CustomAds\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Knowz\CustomAds\Model\CustomAd;

class CustomAdSerializer extends AbstractSerializer
{
    protected $type = 'custom-ads';

    protected function getDefaultAttributes($ad)
    {
        return [
            'id' => $ad->id,
            'title' => $ad->title,
            'description' => $ad->description,
            'imageUrl' => $ad->image_url,
            'url' => $ad->url,
            'position' => $ad->position,
            'isActive' => $ad->is_active,
            'createdAt' => $ad->created_at,
            'updatedAt' => $ad->updated_at,
        ];
    }
}