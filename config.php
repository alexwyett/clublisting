<?php

define('APIURL', 'http://localhost');
define('APIKEY', 'alex');
define('APISECRET', 'badminton');
define(
    'APIOPTIONS',
    serialize(
        array(
            'prefix' => 'clubdirectory/web/app_dev.php'
        )
    )
);