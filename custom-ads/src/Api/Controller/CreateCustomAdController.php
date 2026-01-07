<?php

namespace Knowz\CustomAds\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Knowz\CustomAds\Api\Serializer\CustomAdSerializer;
use Knowz\CustomAds\Model\CustomAd;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class CreateCustomAdController extends AbstractCreateController
{
    public $serializer = CustomAdSerializer::class;

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $data = Arr::get($request->getParsedBody(), 'data.attributes', []);

        return CustomAd::create([
            'title' => Arr::get($data, 'title'),
            'description' => Arr::get($data, 'description'),
            'image_url' => Arr::get($data, 'imageUrl'),
            'url' => Arr::get($data, 'url'),
            'position' => Arr::get($data, 'position', 0),
            'is_active' => Arr::get($data, 'isActive', true),
        ]);
    }
}