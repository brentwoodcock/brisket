var config = {
    apiKey: "AIzaSyBR4RRXzXAxwSX0VO6WeT2LkyKyy-s_anc",
    authDomain: "which-wine-14da9.firebaseapp.com",
    databaseURL: "https://which-wine-14da9.firebaseio.com",
    storageBucket: "",
  };
  firebase.initializeApp(config);
var cuisineArray = ['African American', 'Asian', 'Australian', 'BBQ', 'Bagels', 'Belgian', 'Beverages', 'Brazilian', 'British', 'Bubble Tea', 'Burger', 'Cajun', 'Caribbean', 'Chinese', 'Colombian', 'Creole', 'Cuban', 'Dim Sum', 'Donuts', 'Ethiopian', 'European', 'Filipino', 'French', 'Frozen Yogurt', 'German', 'Greek', 'Hawaiian', 'Ice Cream', 'Indonesian', 'Irish', 'Italian', 'Jamaican', 'Japanese', 'Korean', 'Mediterranean', 'Middle Eastern', 'Mongolian', 'Pizza', 'Ramen', 'Russian', 'Seafood', 'Singaporean', 'Soul Food', 'Steakhouse', 'Sushi', 'Teriyaki', 'Tex-Mex', 'Thai', 'Vegetarian', 'Vietnamese']

var provider = new firebase.auth.GoogleAuthProvider();
var user, saves, previousSaves;

var maxHeight;
var height;

var zomatoQueryUrl = 'https://lit-refuge-17811.herokuapp.com/api/v2.1/search';
var api_key = 'be022f80f221175a3c2f9151cc5b9fa6';
var long, lat, latb, longb, radius, q;

var fire = firebase.database();
var data;
var resultHeightArr = [];
var colHeight;
var map, service, infowindow, gLat1, gLong1, gLat2, gLong2, myLatLng, name;

function firebaseLogin() {
    console.log("firebaseLogin fired");
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        user = result.user;
        writeUserData(user.uid, user.email);
        console.log(user);
        $('.container-login-modal').slideUp();
        $('.container-main').fadeIn();
        inputFocus();
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(errorMessage + ':::' + errorCode);
    });
}

function writeUserData(userId, email) {
    fire.ref('users/' + userId).once("value", function(snapshot) {
        if (snapshot.exists() == false) {
            fire.ref('users/' + userId).set({
                email: email
            })
        }
    });
}

function showBasicSearch() {
    $('.container-login-modal').slideUp();
    $('.container-main').fadeIn();
    $('#view-saves').hide();
    inputFocus();
}
function inputFocus(){
    $('.basic-search-input').focus(function(event) {
        console.log('onfocus ');
        if(($(event.target).val())  == ($(event.target).attr('value'))) {
            $(event.target).val('');
            
        } // name-input focus if
    }); // name-input focus
    $('.basic-search-input').blur(function(event) {
        console.log('onblur ');
        if($(event.target).val()  == '') {
            $(event.target).val($(event.target).attr('value')); 
            
        } //name-input blur if
    }); // name-input blur
} //end nameFocus

function basicSearch() {
    q = $('#input-cuisine').val();
    radius = ($('#input-radius').val() * 1609.344); //convert input miles to query meters
    $('.row-result-target').empty();
    // Empty results incase saves were viewed
        $.ajax({
            crossDomain: true,
            method: 'GET',
            beforeSend: function(XMLHttpRequest, settings) {
                XMLHttpRequest.setRequestHeader('Access-Control-Allow-Headers', '*');
                XMLHttpRequest.setRequestHeader('X-Zomato-API-Key', api_key);
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
                console.log(settings.url);
            },
            headers: {
                'content-type': 'application/json',
                'X-Zomato-API-Key': api_key
            },
            url: zomatoQueryUrl,
            data: {
                q: q,
                lat: latb,
                lon: longb,
                radius: radius
            }
        }).done(function(response) {
            console.log('latlong' + latb, longb);
            console.log(response);
            resultHeightArr = [];
            $('.row-basic-search').slideUp();
            var resultsArray = response.restaurants;
            console.log('test');
            for(i = 0; i < resultsArray.length; i++) {
                console.log(i);
                console.log(resultsArray[i]);
                var resultsCell = $('<div class="col col-xs-4 col-results">'); //define results cell
                var subResultsCell = $('<div class="inside">');
                subResultsCell.append('<div><img alt="' + resultsArray[i].restaurant.name + '" src="' + resultsArray[i].restaurant.featured_image + '"></div>'); //append featured image
                subResultsCell.append('<h3>' + resultsArray[i].restaurant.name + '</h3>'); //append restaurant name
                subResultsCell.append('<p>' + resultsArray[i].restaurant.cuisines + '</p>'); //append cuisine
                subResultsCell.append('<p>' + resultsArray[i].restaurant.location.address + '</p>'); //append address
                subResultsCell.append('<p>' + resultsArray[i].restaurant.location.locality + '</p>'); //append locality
                subResultsCell.append('<p>Rating: ' + resultsArray[i].restaurant.user_rating.rating_text + '</p>'); // append rating
                subResultsCell.append('<p>For Two: about $' + resultsArray[i].restaurant.average_cost_for_two + '</p>');  // append price estimate
                // Only add save button if signed in
                if (user != undefined){
                    saveBtn = $('<button class="btn btn-large btn-brisket btn-save" data-id="' + resultsArray[i].restaurant.id + '" data-name="' + resultsArray[i].restaurant.name + '" data-featured_image="' + resultsArray[i].restaurant.featured_image + '" data-cuisines="' + resultsArray[i].restaurant.cuisines + '" data-address="' + resultsArray[i].restaurant.location.address + '" data-latitude="' + resultsArray[i].restaurant.location.latitude + '" data-longitude="' + resultsArray[i].restaurant.location.longitude + '" data-locality="' + resultsArray[i].restaurant.location.locality + '" data-user_rating="' + resultsArray[i].restaurant.user_rating.rating_text + '" data-avg_cost="' + resultsArray[i].restaurant.average_cost_for_two + '"" data-menu_url="' + resultsArray[i].restaurant.menu_url + '"">Save</button>');
                }
                menuBtn = $('<button class="btn btn-large btn-brisket btn-menu2"><a href="' + resultsArray[i].restaurant.menu_url + '" target="_blank">Menu</button>');  //resultsArray[i].restaurant.menu_url
                goBtn = $('<button class="btn btn-large btn-brisket btn-go" data-lata="' + resultsArray[i].restaurant.location.latitude + '" data-longa="' + resultsArray[i].restaurant.location.longitude + '" data-name="' + resultsArray[i].restaurant.name + '">Go</button>');
                subResultsCell.append(menuBtn);
                if (user != undefined){
                    subResultsCell.append(saveBtn);
                }
                subResultsCell.append(goBtn);

                resultsCell.append(subResultsCell);
                $('.row-results').show();
                $('.row-result-target').append(resultsCell); // append results cells to row
                $('.btn-go').off().on('click', function(e) {
                    showMap(e);
                });
                $('.btn-save').off().on('click', function(e) {
                    saveRestaurant(e);
                });
            }
            $('.col-navbar').height($('.col-result-target').height() + 'px');
            setTimeout(resultHeight, 1000);
            $('.basic-search-input').val($(this).attr('value'));
            inputFocus();


    });
}

function saveRestaurant(e) {
    $(e.target).closest('.col-results').css('background-color', 'rgba(149, 3, 45, 1)');
    //$(e.target).siblings('.btn-brisket').css('background-color', 'rgba(149, 3, 45, .8)');
    $(e.target).css('background-color', 'rgba(0, 201, 255, .8)').html('<i class="fa fa-star"></i>Saved').addClass('saved');
    resultHeight;
    var restId = $(e.target).data('id');
    var alreadySaved = false;
    // Check that restaurant hasn't already been saved
    fire.ref('users/' + user.uid).once('value', function(snapshot) {
        var saves = snapshot.child('saves').val();
        // Check for first save
        if (saves != null) {
            // Loop over child objects of saves
            for (var key in saves) {
                // Skip loop if property is from prototype
                if (!saves.hasOwnProperty(key)) {
                    continue;
                }
                var childObj = saves[key];
                // Check if restaurant has already been saved
                if (childObj.id == restId){
                    alreadySaved = true;
                }
            }
        }
    })
    // Push restaurant data to user's saves on firebase
    if (alreadySaved == false){
        var dataObj = {
            id: $(e.target).data('id'),
            name: $(e.target).data('name'),
            featured_image: $(e.target).data('featured_image'),
            cuisines: $(e.target).data('cuisines'),
            address: $(e.target).data('address'),
            locality: $(e.target).data('locality'),
            latitude: $(e.target).data('latitude'),
            longitude: $(e.target).data('longitude'),
            user_rating: $(e.target).data('user_rating'),
            avg_cost: $(e.target).data('avg_cost'),
            menu_url: $(e.target).data('menu_url')
        }
        fire.ref('users/' + user.uid + '/saves').push(dataObj);
    }
    $('.saved').off().on('click', function(e) {
        removeRestaurant(e);
    });
}

function showSaves() {
    console.log('showSaves fired');
    fire.ref('users/' + user.uid).once('value', function(snapshot) {
        var previousSaves = snapshot.child('saves').val();
        $('.row-result-target').empty();
        for (var key in previousSaves) {
            console.log(previousSaves);
            // Skip prototype property
            if (!previousSaves.hasOwnProperty(key)) {
                continue;
            }
            var savedRestaurant = previousSaves[key]
            console.log(savedRestaurant);
            // Create saved result cell
            var savedResultsCell = $('<div class="col col-xs-4 col-results">');
            var subSaveCell = $('<div class=inside>');
            subSaveCell.append('<div><img alt="' + savedRestaurant.name + '" src="' + savedRestaurant.featured_image + '"></div>'); //append featured image
            subSaveCell.append('<h3>' + savedRestaurant.name + '</h3>'); //append restaurant name
            subSaveCell.append('<p>' + savedRestaurant.cuisines + '</p>'); //append cuisine
            subSaveCell.append('<p>' + savedRestaurant.address + '</p>'); //append address
            subSaveCell.append('<p>' + savedRestaurant.locality + '</p>'); //append locality
            subSaveCell.append('<p>Rating: ' + savedRestaurant.user_rating + '</p>'); // append rating
            subSaveCell.append('<p>For Two: about $' + savedRestaurant.avg_cost + '</p>');  // append price estimate
            saveBtn = $('<button class="btn btn-large btn-brisket btn-save" data-id="' + savedRestaurant.id + '" data-name="' + savedRestaurant.name + '" data-featured_image="' + savedRestaurant.featured_image + '" data-cuisines="' + savedRestaurant.cuisines + '" data-address="' + savedRestaurant.address + '" data-latitude="' + savedRestaurant.latitude + '" data-longitude="' + savedRestaurant.longitude + '" data-locality="' + savedRestaurant.locality + '" data-user_rating="' + savedRestaurant.user_rating + '" data-avg_cost="' + savedRestaurant.avg_cost + '"  data-menu_url="' + savedRestaurant.menu_url + '"">Save</button>');
            saveBtn.css('background-color', 'rgba(0, 201, 255, .8)').html('<i class="fa fa-star"></i>Saved').addClass('saved saved-shown');
            menuBtn = $('<button class="btn btn-large btn-brisket btn-menu2"><a href="' + savedRestaurant.menu_url + '" target="_blank">Menu</button>');  //savedRestaurant.menu_url
            goBtn = $('<button class="btn btn-large btn-brisket btn-go" data-lata="' + savedRestaurant.latitude + '" data-longa="' + savedRestaurant.longitude + '" data-name="' + savedRestaurant.name + '">Go</button>');
            subSaveCell.append(menuBtn);
            subSaveCell.append(saveBtn);
            subSaveCell.append(goBtn);

            savedResultsCell.append(subSaveCell);
            // $('body').append(savedResultsCell);
            $('.row-results').show();
            $('.row-result-target').append(savedResultsCell); // append results cells to row
            $('.btn-go').off().on('click', function(e) {
                showMap(e);
            });
            $('.btn-save').off().on('click', function(e) {
                saveRestaurant(e);
            });
            $('.saved-shown').off().on('click', function(e) {
                removeRestaurant(e);
                $(e.target).closest('.col-results').fadeOut();
            });
            $('.saved-shown').hover(
                function(e) {
                    $(e.target).html('<i class="fa fa-times"></i>Remove').attr('style', 'background-color: ""');
                }, function(e) {
                    $(e.target).html('<i class="fa fa-star"></i>Saved').attr('style', 'background-color: rgba(0, 201, 255, .8)');
                }
            );
        }
    })
    $('.col-navbar').height($('.col-result-target').height() + 'px');
    setTimeout(resultHeight, 700);
    inputFocus();
}

function removeRestaurant(e) {
    console.log('removeRestaurant fired');
    $(e.target).closest('.col-results').css('background-color', '');
    $(e.target).css('background-color', '').html('Save').removeClass('saved').addClass('removed');
    var targetId = $(e.target).data('id');
    fire.ref('users/' + user.uid).once('value', function(snapshot) {
        saves = snapshot.child('saves').val();
        for (var key in saves) {
            // Skip prototype property
            if (!saves.hasOwnProperty(key)) {
                continue;
            }
            var currentRestaurant = saves[key];
            if (currentRestaurant.id == targetId) {
                fire.ref('users/' + user.uid + '/saves/' + [key]).remove();
            }
        }
    })
    $('.removed').off().on('click', function(e) {
        saveRestaurant(e);
    });
}

function showMap(e) {
    console.log('showMap fired');
    //gLat1 = $(e.target).data('lat1');
    //gLong1 = $(e.target).data('long1');
    $('.row-result-target').empty();
    $('.row-result-target').append((e.target).closest('.col-results'));
    $('.btn-go').hide();
    $('.col-results').css({'height': 'calc(2em + ' + $('.col-results').children('.inside').height() + 'px)'});
    mapDiv = $('<div class="col col-xs-8 col-map"><div id="map" style="height: calc(1.75em + ' + $('.col-results').height() + 'px); width: 100%"></div></div>');
    //$('.row-result-target').css('padding-top', 'calc((100vh - ' + $('.col-results').height() + ')/2)');
    $('.row-result-target').append(mapDiv);
    // Call Google Maps API just once
    if (document.getElementById('googleMaps') == null) {
        $('body').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDLE5E0WA_LmJRmDFW6mhHfqwUolD5vnE4&amp;libraries=places&amp;callback=initialize" id="googleMaps"></script>');
    }else{
        // Remove previous Google Maps API script call in body
        $('#googleMaps').remove();
        // Remove all scripts/styles in head generated from previous Google Maps API call
        $('head').children('script').remove();
        $('head').children('style').remove();
        // Remove the link element generated from previous Google Maps API call
        $('head').children('link').first().remove();
        if ($('head').children('script').length == 0){
            $('body').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDLE5E0WA_LmJRmDFW6mhHfqwUolD5vnE4&amp;libraries=places&amp;callback=initialize" id="googleMaps"></script>');
        }
    }
    $('.btn-save').click(function(e) {
        saveRestaurant(e);
    });
    $('.saved').on('click', function(e) {
        removeRestaurant(e);
    });
    $('.removed').on('click', function(e) {
        saveRestaurant(e);
    });
    $('.col-navbar').height($('.col-result-target').height() + 'px');
    inputFocus();
}

function initialize() {
    console.log('initialize');
    gLat2 = eval($('.btn-go').data('lata'));
    gLong2 = eval($('.btn-go').data('longa'));
    name = $('.btn-go').data('name').replace(' ', '+');
    myLatLng = {lat: gLat2, lng: gLong2};  // Location map is centered on
    // mapOptions style wizard: http://googlemaps.github.io/js-samples/styledmaps/wizard/index.html
    var mapOptions = {
      center: myLatLng,
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      draggable: true,
      scrollwheel: false,
      clickableIcons: false,
      styles: [
          {
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var requestText = {
      location: myLatLng,
      radius: '10',  // Search radius in meters
      query: name // Search term
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(requestText, callback);
    infowindow = new google.maps.InfoWindow;
}

function callback(results, status) {
    console.log('callback1resultsstatus');
    console.log(results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var id = results[0].place_id;
        // Search for more details using a getDetails() search with place_id
        var requestDetails = {
          placeId: id
        };
        service = new google.maps.places.PlacesService(map);
        service.getDetails(requestDetails, callback2);
    }
}

function callback2(place, status) {
    console.log('callback2placestatus');
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMarker(place);
    }
}

function createMarker(place) {
    console.log('createMarkerplace');
    console.log(place);
    var marker = new google.maps.Marker({
      map: map,
      position: myLatLng
    });

    google.maps.event.addListener(marker, 'click', function() {
      var contentString;
      if (place.website != undefined){
        if (place.opening_hours != undefined){
            if (place.opening_hours.open_now == false) {
                contentString = "<div id='content'><p id='place-name'><b>" + place.name + "</b></p><p id='place-closed'><b><i>Closed</i></b></p><p id='place-address'>" + place.vicinity + "</p><p id='place-num'>" + place.formatted_phone_number + "</p><p><a href=" + place.website + " id='place-website'>Website</a></p></div>";
            }else{
                contentString = "<div id='content'><p id='place-name'><b>" + place.name + "</b></p><p id='place-open'><b><i>Open Now</i></b></p><p id='place-address'>" + place.vicinity + "</p><p id='place-num'>" + place.formatted_phone_number + "</p><p><a href=" + place.website + " id='place-website'>Website</a></p></div>";
            }
        }else{
            contentString = "<div id='content'><p id='place-name'><b>" + place.name + "</b></p><p id='place-address'>" + place.vicinity + "</p><p id='place-num'>" + place.formatted_phone_number + "</p><p><a href=" + place.website + " id='place-website'>Website</a></p></div>";
        }
      }else{
        if (place.opening_hours != undefined) {
            if (place.opening_hours.open_now == false) {
            contentString = "<div id='content'><p id='place-name'><b>" + place.name + "</b></p><p id='place-closed'><b><i>Closed</i></b></p><p id='place-address'>" + place.vicinity + "</p><p id='place-num'>" + place.formatted_phone_number + "</p></div>";
            }else{
                contentString = "<div id='content'><p id='place-name'><b>" + place.name + "</b></p><p id='place-open'><b><i>Open Now</i></b></p><p id='place-address'>" + place.vicinity + "</p><p id='place-num'>" + place.formatted_phone_number + "</p></div>";
            }
        }else{
            contentString = "<div id='content'><p id='place-name'>" + place.name + "</p><p id='place-address'>" + place.vicinity + "</p><p id='place-num'>" + place.formatted_phone_number + "</p></div>";
        }
      }
      infowindow.setContent(contentString);
      infowindow.open(map, this);
    });
}

function getIp() {
    $.ajax({
        url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBfZKgcnQ_pOWXajoeJF-NE3MegDn8lUAc',
        method: 'POST',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json'
        }
    }).done(function(resp) {
        console.log(resp);
        latb = resp.location.lat;
        longb = resp.location.lng;
        console.log('iplatlong' + latb, longb);
    });
}
function showCuisines() {
    $('.row-result-target').empty();
    cuisineEnvelope = $('<div class="col-xs-12 cuisine-envelope">');
    cuisineTitleCol = $('<div class="col col-xs-12 col-cuisine-title"><h2>Choose a Cuisine</h2></div>')
    cuisineEnvelope.append(cuisineTitleCol);
    $('.row-result-target').append(cuisineEnvelope);
    for(i = 0; i < cuisineArray.length; i++) {
        cuisineListCol = $('<div class="col col-xs-3 col-cuisine-list">')
        cuisineListCol.append('<p>' + cuisineArray[i] + '</p>');
        cuisineEnvelope.append(cuisineListCol);
        $('.col-cuisine-list').click(function(e) {
            $('#input-cuisine').val($(e.target).find('p').html());
            console.log($('#input-cuisine').val());
        });

    }
}


function resultHeight() {
    maxHeight = Math.max.apply(null, $('.inside').map(function() {
        console.log(($(this).height()) / ($(this).width()));
        resultHeightArr.push(($(this).height()) / ($(this).width()));
        console.log(resultHeightArr);
    }).get());
    resultHeightArr.sort(function(a, b) {
        return b - a;
    });
    console.log(resultHeightArr);
    colHeight = ($('.col-results').width() * resultHeightArr[0] * 1.1);
    $('.col-results').css({'height': 'calc(' + colHeight + 'px'});
    resultHeightArr = [];
} // end resultHeight

$(document).ready(function() {
    fire.ref().on('value', function(snapshot) {
        data = snapshot.val();
    });
    getIp();
    inputFocus();
    $('.btn-login').click(firebaseLogin);
    $('.btn-nologin').click(showBasicSearch);
    $('#basic-search-submit').click(basicSearch);
    $('#view-saves').click(showSaves);
    $('#all-cuisines').click(showCuisines);
    $(document).keypress(function(e) {
        if(e.which === 13) {
            basicSearch();
        }
    });
    $(window).on('resize', resultHeight);
});
