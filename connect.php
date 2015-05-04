<?php

require_once 'config.php';
\aw\clubapiclient\client\Client::factory(
    APIURL, // Api Url
    APIKEY, // Api Key
    APISECRET, // Api Secret
    unserialize(APIOPTIONS)
);

$history = new \GuzzleHttp\Subscriber\History();
\aw\clubapiclient\client\Client::getClient()->getEmitter()->attach($history);

$app = new \Slim\Slim(
    array(
        'view' => new \Slim\Views\Twig(),
        'templates.path' => 'templates'
    )
);

$posIndex = strpos($_SERVER['PHP_SELF'], '/index.php');
$baseUrl = substr($_SERVER['PHP_SELF'], 0, $posIndex);
$app->hook('slim.before', function() use ($app, $baseUrl) {
    $app->view->appendData(array('baseUrl' => $baseUrl));
});