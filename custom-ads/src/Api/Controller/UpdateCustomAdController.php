<?php

namespace Knowz\CustomAds\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Knowz\CustomAds\Api\Serializer\CustomAdSerializer;
use Knowz\CustomAds\Model\CustomAd;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UpdateCustomAdController extends AbstractShowController
{
    public $serializer = CustomAdSerializer::class;

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');
        $ad = CustomAd::findOrFail($id);

        $data = Arr::get($request->getParsedBody(), 'data.attributes', []);

        $ad->update([
            'title' => Arr::get($data, 'title', $ad->title),
            'description' => Arr::get($data, 'description', $ad->description),
            'image_url' => Arr::get($data, 'imageUrl', $ad->image_url),
            'url' => Arr::get($data, 'url', $ad->url),
            'position' => Arr::get($data, 'position', $ad->position),
            'is_active' => Arr::get($data, 'isActive', $ad->is_active),
        ]);

        return $ad;
    }
}