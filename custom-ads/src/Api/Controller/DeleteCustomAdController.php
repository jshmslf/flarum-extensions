<?php

namespace Knowz\CustomAds\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Knowz\CustomAds\Model\CustomAd;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class DeleteCustomAdController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');
        $ad = CustomAd::findOrFail($id);
        $ad->delete();
    }
}