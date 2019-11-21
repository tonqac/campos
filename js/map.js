var map;

function initMap() {

    var europeBounds = {
        north: 65,
        south: 35,
        west: -15,
        east: 60
    };

    var zonasBounds = [
        "",
        {
            north: 60.9000,
            south: 42.1000,
            west: -12.9000,
            east: 45.1000
        },
        {
            north: 61.3000,
            south: 42.3000,
            west: -8.5000,
            east: 38.0000
        },
        {
            north: 61.3000,
            south: 42.0000,
            west: -10.0000,
            east: 38.2000
        }
    ];

    map = new google.maps.Map(document.getElementById('mapa'), {
        center: { lat: 48.397, lng: 6.644 },
        restriction: {
            latLngBounds: europeBounds,
            strictBounds: false,
        },
        zoom: 5,
        maxZoom: 10,
        minZoom: 5,
        gestureHandling: 'greedy',
        styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "saturation": 36
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 40
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    },
                    {
                        "weight": 1.2
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 29
                    },
                    {
                        "weight": 0.2
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 18
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 19
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    }
                ]
            }
        ]
    });
    
    // Muestro zonas (si hay alguno seleccionado)
    for(i=1;i<=3;i++){
        if($.inArray(i,zonas)>-1){
            var layer = new google.maps.GroundOverlay('src/images/zonas/'+i+'.png',zonasBounds[i]);
            layer.setMap(map);
        }
    }
}

var setMarkers = function () {
    initMap(); // Reseteo mapa cada vez que muestro resultados

    //var clusters = new Array();
    var items = getResultsFromFilters();

    var closeAudio = document.createElement('audio');
    closeAudio.src = 'audio/close.mp3';

    var openAudio = document.createElement('audio');
    openAudio.src = 'audio/open.mp3';

    var bounds = new google.maps.LatLngBounds();
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    if (items.length > 0) {
        items.forEach(function (item) {
            var id_tipo = item["id_tipo"];
            var description = item["description"];

            if (description == "") {
                var icon_marker = {
                    url: 'src/images/markers/'+id_tipo+'-markerInactive.png',
                    size: new google.maps.Size(20, 20),
                    scaledSize: new google.maps.Size(20, 20),
                    origin: new google.maps.Point(0, 0),
                }

            }
            else {
                /*
                var gifsArray = new Array('src/images/markers/final_1.gif', 'src/images/markers/final_2.gif', 'src/images/markers/final_3.gif', 'src/images/markers/final_4.gif');
                var randomPosition = Math.floor(Math.random() * gifsArray.length);
                var randomImage = gifsArray[randomPosition];

                var icon_marker = {
                    url: randomImage,
                    size: new google.maps.Size(60, 60),
                    scaledSize: new google.maps.Size(60, 60),
                    origin: new google.maps.Point(0, 0),
                };
                */

                var icon_marker = {
                    url: 'src/images/markers/'+id_tipo+'-markerActive.gif',
                    size: new google.maps.Size(20, 20),
                    scaledSize: new google.maps.Size(20, 20),
                    origin: new google.maps.Point(0, 0),
                }

                description = '<div class="cont-info">' + decodeEntities(description) + '</div>';
            }

            var carousel = "";
            var images = Object.entries(item["images"]);


            if (images.length > 0) {
                for (i = 0; i < images.length; i++) {
                    var filename = images[i][1]["img_file"].split('/').pop().split('#')[0].split('?')[0];
                    var caption = images[i][1]["img_description"];
                    carousel += '<a data-toggle="lightbox" data-gallery="campos" data-title="' + caption + '" href="src/images/campos/' + filename + '"><img class="foto-gueto" src="src/images/campos/' + filename + '" alt="Gueto"></a>';
                }

                if (carousel != "") carousel = '<div class="cont-galeria"><div class="galeria-gueto">' + carousel + '</div></div>';
            }


            var content = '<div class="info-gueto"><h3>' + item["name"] + '</h3>' + carousel + description + '</div>';

            var position = new google.maps.LatLng(item["lat"], item["lng"]);
            var marker = new google.maps.Marker({
                map: map,
                title: item["name"],
                position: position,
                icon: icon_marker,
                optimized: false
            });

            //clusters.push(marker);
            bounds.extend(position);

            google.maps.event.addListener(marker, "click", (function (marker, i) {

                return function () {
                    openAudio.play();
                    infoWindow.setContent(content);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            if (items.length == 1) google.maps.event.trigger(marker, "click"); // Si hay un solo resultado, lo muestro.
        });

        //map.fitBounds(bounds);
        //map.panToBounds(bounds);

        google.maps.event.addListener(map, "click", function () {
            infoWindow.close();
        });

        google.maps.event.addListener(infoWindow, "domready", function () {
            $('.galeria-gueto').slick({
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 1,
                fade: true,
                lazyLoad: 'ondemand',
                cssEase: 'linear',
                adaptiveHeight: true
            });
			
			if ($(".info-gueto").find(".cont-info").length > 0) {
                $(".gm-style-iw-c").find("button.gm-ui-hover-effect").addClass("cerrar-info");
            }

            $(".cerrar-info").click(function () {
                closeAudio.play();
            })
			
        });

        /*
        var markerCluster = new MarkerClusterer(map, clusters, {
            gridSize: 50,
            maxZoom: 18,
            styles: [
                {
                    textColor: 'white',
                    url: 'src/images/markers/1.png',
                    height: 60,
                    width: 60
                },
                {
                    textColor: 'white',
                    url: 'src/images/markers/2.png',
                    height: 80,
                    width: 80
                },
                {
                    textColor: 'white',
                    url: 'src/images/markers/3.png',
                    height: 120,
                    width: 120
                }
            ]
        });
        */
    }
    else {
        $("#no_results").fadeIn();
    }
}