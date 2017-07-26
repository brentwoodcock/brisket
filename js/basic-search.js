function basicSearch() {
    q = $('#input-cuisine').val();
    radius = $('#input-radius').val();
        $.ajax({
            crossDomain: true,
            method: 'GET',
            beforeSend: function(XMLHttpRequest, zomato1) {
                XMLHttpRequest.setRequestHeader('Access-Control-Allow-Headers', '*');
                XMLHttpRequest.setRequestHeader('X-Zomato-API-Key', api_key);
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            headers: {
                'content-type': 'application/json',
                'X-Zomato-API-Key': api_key
            },
            url: zomatoQueryUrl,
            data: {
                q: q,
                lat: lat,
                long: long,
                radius: radius
            }
        }).done(function(response) {
            console.log(response);
            resultHeightArr = [];
            $('.row-basic-search').slideUp();
            var resultsArray = response.restaurants;
            for(i = 0; i < resultsArray.length; i++) {
                var resultsCell = $('<div class="col col-xs-4 col-results">'); //define results cell
                var subResultsCell = $('<div class="inside">');
                
                subResultsCell.append('<div><img alt="' + resultsArray[i]restaurant.name + '" src="' + resultsArray[i].restaurant.featured_image + '"></div>');

                subResultsCell.append('<h3>' + resultsArray[i].restaurant.name + '</h3>'); //append restaurant name
                subResultsCell.append('<p>' + resultsArray[i].restaurant.cuisines + '</p>'); //append cuisine
                subResultsCell.append('<p>' + resultsArray[i].restaurant.address + '</p>'); //append address
                subResultsCell.append('<p>' + resultsArray[i].restaurant.locality + '</p>'); //append locality
                subResultsCell.append('<p><a href="' + resultsArray[i].restaurant.menu_url + '" target="_blank">Menu</a></p>'); //append menu link
                subResultsCell.append('<p>Rating: ' + resultsArray[i].restaurant.user_rating.rating_text + '</p>'); // append rating
              subResultsCell.append('<p>For Two: about $' + resultsArray[i].restaurant.average_cost_for_two + '</p>');  // append price estimate
                saveBtn = $('<button class="btn">Save</button><br />');
                goBtn = $('<button class="btn">Go</button><br />');
                subResultsCell.append(saveBtn);
                subResultsCell.append(goBtn);
                resultsCell.append(subResultsCell);
                $('.row-results').show();
                $('.col-result-target').append(resultsCell); // append results cells to row
            }
             setTimeout(resultHeight, 500);
        });
}