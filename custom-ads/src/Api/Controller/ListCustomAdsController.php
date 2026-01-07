<?php

namespace Knowz\CustomAds\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Knowz\CustomAds\Api\Serializer\CustomAdSerializer;
use Knowz\CustomAds\Model\CustomAd;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListCustomAdsController extends AbstractListController
{
    public $serializer = CustomAdSerializer::class;

    protected function data(ServerRequestInterface $request, Document $document)
    {
        return CustomAd::where('is_active', true)
            ->orderBy('position')
            ->get();
    }
}