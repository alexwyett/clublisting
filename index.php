<?php

require_once 'vendor/autoload.php';
require_once 'connect.php';

// Define routes
$app->get(
    '/', 
    function () use ($app) {        
        // Render index view
        $app->render(
            'index.html',
            array()
        );
    }
);

$app->get(
    '/clubs.json', 
    function () use ($app) {
    
        $clubs = new \aw\clubapiclient\collection\Club();
        $clubs->setLimit(500)->fetch();

        $venueData = array();
        foreach ($clubs as $club) {
            
            $tags = array();
            foreach ($club->getTags() as $tag) {
                $tags[] = $tag->getSlug();
            }
            
            $contacts = array();
            foreach ($club->getContacts() as $contact) {
                if (!$contact->isPrivate()) {
                    $contacts[] = array(
                        'name' => implode(
                            ' ',
                            array(
                                $contact->getTitle(),
                                $contact->getFirstName(),
                                $contact->getSurname()
                            )
                        ),
                        'address' => (string) $contact->getAddress(),
                        'role' => $contact->getRole()
                    );
                }
            }
            
            $clubData = array(
                'name' => $club->getName(),
                'description' => $club->getName(),
                'playTimes' => array(),
                'contacts' => $contacts,
                'tags' => $tags
            );
            foreach ($club->getClubVenues() as $clubVenue) {

                $timeslots = array();
                foreach ($clubVenue->getTimeslots() as $ts) {
                    $timeslots[] = (string) $ts;
                }
                $clubData['playTimes'] = $timeslots;
                
                if (isset($venueData[$clubVenue->getVenue()->getName()])) {
                    $venueData[$clubVenue->getVenue()->getName()]['properties']['clubs'][] = $clubData;
                } else {
                    $venueData[$clubVenue->getVenue()->getName()] = array(
                        'type' => 'Feature',
                        'geometry' => array(
                            'type' => 'Point',
                            'coordinates' => array(
                                $clubVenue->getVenue()->getAddress()->getLongitude(),
                                $clubVenue->getVenue()->getAddress()->getLatitude()
                            )
                        ),
                        'properties' => array(
                            'venue' => array(
                                'name'=> $clubVenue->getVenue()->getName(),
                                'address' => (string) $clubVenue->getVenue()->getAddress()
                            ),
                            'clubs' => array(
                                $clubData
                            )
                        )
                    );
                }
            }
        }

        sort($venueData);
        header('ClubsFound: ' . $clubs->getTotal());
        header('ClubsPageSize: ' . $clubs->getPagination()->getLimit());
        header('ClubsPage: ' . $clubs->getPagination()->getPage());
        header('Content-Type: application/json');
        die(json_encode(array(
            'type' => 'FeatureCollection',
            'features' => $venueData
        )));
    }
);


// Run app
$app->run();