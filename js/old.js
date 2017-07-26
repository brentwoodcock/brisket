window.pAsyncInit = function() {
        PDK.init({
            appId: "4856053093575438264", 
            cookie: true
        });
    };
var config = {
    apiKey: "AIzaSyBR4RRXzXAxwSX0VO6WeT2LkyKyy-s_anc",
    authDomain: "which-wine-14da9.firebaseapp.com",
    databaseURL: "https://which-wine-14da9.firebaseio.com",
    storageBucket: "",
  };
  firebase.initializeApp(config);

var maxHeight;
var height;

var wineQueryUrl = "https://services.wine.com/api/beta2/service.svc/JSON/catalog";
var key = "885d3d14df6326792493e1af65191d1d";
var filter = "categories(490+124)+rating(80|90)+price(0|15)";
var search = "merlot";
var size = 15;
var sortBy = "rating|descending";
var state = "TX";

var fire = firebase.database();
var data;
var resultHeightArr = [];
var colHeight;

(function(d, s, id){
        var js, pjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//assets.pinterest.com/sdk/sdk.js";
        pjs.parentNode.insertBefore(js, pjs);
    }(document, 'script', 'pinterest-jssdk'));

function pinterestLogin() {
    PDK.login({
        scope: 'read_public'
    }, callback);
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
    $.ajax({
        url: wineQueryUrl,
        method: 'GET',
        data: {
            apikey: key,
            filter: filter,
            search: search,
            size: size,
            sortBy: sortBy,
            state: state,
            instock: true
            }
        }).done(function(response) {
            console.log(response);
            resultHeightArr = [];
            $('.row-basic-search').slideUp();
            var resultsArray = response.Products.List;
            for(i = 0; i < resultsArray.length; i++) {
                var resultsCell = $('<div class="col col-xs-4 col-results">'); //define results cell
                var subResultsCell = $('<div class="inside">');
                subResultsCell.append('<div><img alt="' + resultsArray[i].Name + '" src="' + resultsArray[i].Labels[0].Url + '"></div>'); //append label image
                subResultsCell.append('<h3>' + resultsArray[i].Name + "</h3>"); //append wine name
                subResultsCell.append('<p>' + resultsArray[i].Varietal.WineType.Name + ', ' + resultsArray[i].Varietal.Name + '</p>'); //append type and varietal
                subResultsCell.append('<p>Score: ' + resultsArray[i].Ratings.HighestScore + '%</p>'); // append rating
                subResultsCell.append('<p>$' + resultsArray[i].PriceMin + ' - $' + resultsArray[i].PriceMax + '</p>');  // append price range
                buyBtn = $('<button class="btn">Buy at<img alt="wine.com" src="http://cache.wine.com/images/logos/80x20_winecom_logo.png" /></button><br />');
                subResultsCell.append(buyBtn);
                resultsCell.append(subResultsCell);
                $('.row-results').show().append(resultsCell); // append results cells to row
            }
                setTimeout(resultHeight, 500);
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
    inputFocus();
    $('.btn-login').click(pinterestLogin);
    $('.btn-nologin').click(showBasicSearch); 
    $('#basic-search-submit').click(basicSearch);
    $(window).resize(resultHeight);

});