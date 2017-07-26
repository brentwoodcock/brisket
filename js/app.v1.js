var config = {
    apiKey: "AIzaSyBR4RRXzXAxwSX0VO6WeT2LkyKyy-s_anc",
    authDomain: "which-wine-14da9.firebaseapp.com",
    databaseURL: "https://which-wine-14da9.firebaseio.com",
    storageBucket: "",
  };
  firebase.initializeApp(config);

var maxHeight;
var height;

var locuQueryUrl = "https://api.locu.com/v1_0/venue/insight/";
var api_key = "d6c64d550455d80438a0ea1f281487c58c8120d4";
var cuisine = 'american';
var dish;
var mealTime = '';
var restaurantName = '';
var long, lat;
var radius = 50000;
var delivers;

var fire = firebase.database();
var data;
var resultHeightArr = [];
var colHeight;


function firebaseLogin() {
    console.log(data);
}

function showBasicSearch() {
    $('.container-login-modal').hide();
    $('.container-main').show();
    $('.row-basic-search').show();
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
    //cuisine = $('#input-cuisine').val();
    //dish = $('#input-dish').val();
    //mealTime = $('#input-time').val();
    //restaurantName = $('#input-restaurant').val();
    //delivers = $('#input-delivers').val();
    //radius = $('#input-radius').val();
// type of cuisine
// price range
// restaurant name
// hours
// delivery
// 
        
        $.ajax({
            // crossDomain: true,
            // beforeSend: function(XMLHttpRequest) {
            //    XMLHttpRequest.setRequestHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8887/');
            // },
            // headers: {
            //    'Access-Control-Allow-Methods': 'POST',
            //    'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin',
            //    'Access-Control-Allow-Origin': 'http://127.0.0.1:8887/'
            // },
            url: locuQueryUrl,
            method: 'GET',
            dataType: 'jsonp',
            data: {
                api_key: api_key,
                cuisine: cuisine,
                // open_hours: mealTime,
                //name: restaurantName,
                //categories: 'restaurant',
                //$in_lat_lng_radius: [lat, long, radius],
                //delivery: delivers
                location: lat + "," + long,
                radius: radius
                }
        }).done(function(response) {
            console.log(response);
            resultHeightArr = [];
            $('.row-basic-search').slideUp();
            //var resultsArray = response.Products.List;
            //for(i = 0; i < resultsArray.length; i++) {
            //    var resultsCell = $('<div class="col col-xs-4 col-results">'); //define results cell
            //    var subResultsCell = $('<div class="inside">');
            //    subResultsCell.append('<div><img alt="' + resultsArray[i].Name + '" src="' + resultsArray[i].Labels[0].Url + '"></div>'); //append label image
            //    subResultsCell.append('<h3>' + resultsArray[i].Name + "</h3>"); //append wine name
            //    subResultsCell.append('<p>' + resultsArray[i].Varietal.WineType.Name + ', ' + resultsArray[i].Varietal.Name + '</p>'); //append type and varietal
            //    subResultsCell.append('<p>Score: ' + resultsArray[i].Ratings.HighestScore + '%</p>'); // append rating
            //    subResultsCell.append('<p>$' + resultsArray[i].PriceMin + ' - $' + resultsArray[i].PriceMax + '</p>');  // append price range
            //    buyBtn = $('<button class="btn">Buy at<img alt="wine.com" src="http://cache.wine.com/images/logos/80x20_winecom_logo.png" /></button><br />');
            //    subResultsCell.append(buyBtn);
            //    resultsCell.append(subResultsCell);
            //    $('.row-results').show().append(resultsCell); // append results cells to row
            //}
            // setTimeout(resultHeight, 500);
        });
}
function getIp() {
    $.ajax({
        url: 'http://www.ip-api.com/json'
    }).done(function(resp) {
        console.log(resp);
        lat = resp.lat;
        long = resp.lon;
    });
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
    $(window).on('resize', resultHeight);

});