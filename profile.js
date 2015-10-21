function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

var recsObject = {};
recsObject.myApiKey = encodeURIComponent('fd89fba2959239b2');
recsObject.myClientKey = encodeURIComponent('983968841cc325da');

function getRecs(this_strategy_description, this_product_id) {
    //var dataOut;

    $.ajax('https://recs.richrelevance.com/rrserver/api/rrPlatform/recsForPlacements', {
        data: {
            apiClientKey: recsObject.myClientKey,
            apiKey: recsObject.myApiKey,
            userId: '1841734',
            sessionId: '74ea5182-47e1-47e5-a305-238e2c4df806',
            resultCount: 24,
            // strategyName: 'SimilarProducts3',
            //strategyName: "RecentlyPurchased3",
            placements: "item_page.Profile1",
            strategySet: "\|microgenres" + "\|similarproducts" + "\|appellation_varietal_mostpurchased" + "\|PurchaseEV" + "\|productViewedViewed",
            productId: this_product_id
        },
        dataType: 'json'
    }).then(function(data) {
        //console.log(data);
        if (data.placements !== undefined) {
            recsObject.items = data.placements[0].recommendedProducts.map(function(item) {
                item.regional_sku = 'REGIONAL_SKU';
                item.highest_rating_publications_ini = "XX";
                item.price = ('' + item.priceCents).replace(/(.*)([0-9]{2}$)/, '$$$1.$2');
                item.sale_price = item.salePriceCents ? ('' + item.salePriceCents).replace(/(.*)([0-9]{2}$)/, '$$$1.$2') : item.salePriceCents;
                return item;
            });
            data.placements[0].recommendedProducts = recsObject.items;
            recsObject.dataOut = data;
            var strategyMessage = recsObject.dataOut.placements[0].strategyMessage;

            recommendations = recsObject.dataOut.placements[0].recommendedProducts;

            shuffle(recommendations);

            var numberofproducts = recommendations.length;
            var showthismany = Math.min(numberofproducts, 5)

            var topRecs = [];

            for (i = 0; i < showthismany; i++) {
                topRecs.push(recommendations[i]);
            }

            $('#recsModalLabel').html(strategyMessage);
            $('.recsList').html("");

            topRecs.forEach(function(d) {
                $('.recsList').append('<li>' + d.name + '</li>');

            });
        } else {
            $('#recsModalLabel').html("Sorry");
            $('.recsList').html("");
            $('.recsList').append('<li>No recs at this time</li>');
        }

        $('#recsModal').modal();

        //console.log(recommendations);   
        //return recsObject;
    });
}

var customerSelected = getParameterByName('customer');
console.log(customerSelected);

/*
if ($.cookie('modal_shown') == null) {
    $.cookie('modal_shown', 'yes', { expires: 7, path: '/' });
     $('#welcomeModal').modal();
 }
 */

/**********************************
 * Step0: Load data  *
 **********************************/
// load data from a csv file
d3.json("https://api.richrelevance.com/api/v1/datamesh/apis/fd89fba2959239b2/Cust_Purch_API?customerid=" + customerSelected, function(data) {

    //getting the product count for just the customer selected and insertign into DOM
    //customer_name_chosen = loadSelected("customer_choice","value"),
    //customerProductCount = data.filter(function(d) {return d.customer === customer_name_chosen;}).length;

console.log(data);
    $('#hide_bad_ratings').click(function() {
        if (document.getElementById('hide_bad_ratings').checked) {
            ratingDimension.filterFunction(function(d) {
                return d > 2.5;
            });
            dc.redrawAll();
        } else {
            ratingDimension.filterAll();
            dc.redrawAll();
        }
    })

    $('#show_gifts').click(function() {
        if (document.getElementById('show_gifts').checked) {
            giftPersonalDimension.filterAll();
            dc.redrawAll();
        } else {
            giftPersonalDimension.filter("Personal");
            dc.redrawAll();
        }
    })

    $('#hide_oos_check').click(function() {
        if (document.getElementById('hide_oos_check').checked) {
            console.log('false');
            stockDimension.filterAll();
            dc.redrawAll();

        } else {
            console.log('true');
            stockDimension.filterFunction(function(d) {
                return d > 0;
            });
            dc.redrawAll();
        }
    })

    $('.reset_me').click(function() {
        //$("#hide_bad_ratings").html("Show 4 &amp; 5 Star Only");
        //$("#hide_oos").html("Exclude Out Of Stock");
        document.getElementById("hide_oos_check").checked = true;
        document.getElementById("hide_bad_ratings").checked = false;
        ratingDimension.filterAll();
        stockDimension.filterAll();
        dc.filterAll();
        dc.redrawAll();
        runAjax();
        listSlicersForAllElements();
    });

    
    console.log(customerSelected);


    //Filter for a name before loading into crossfilter
    var data2 = data.filter(function (d) {return d.class === 'Red Wines' || d.class === 'White Wines' || d.class === 'Champagne & Sparkling'});
    var customerNameFromData = data2[0].customer;
    //var priceFilter = data.filter(function(d, i) { return d.price < 20; });
    //var regionVarietalCombo = data.filter(function(d, i) { return d.varietal + ' ' + d.appellation == 'Cabernet Sauvignon Argentina' ; });

    //////////// 2015-10-13 ML
    //populate dropdowns with only available slices for the current customer
    document.getElementById('customerName').innerHTML = toTitleCase(customerNameFromData) + "'s ";
    //populateDropdown(data2, 'MostRecentPurchaseYear', 'mostRecentPurchaseYear', '', 'All', 1, 'All Time');
    //populateDropdown(data2, 'giftstatus', 'gift_personal', ' Purchases', 'Personal', 0, '');

    //remove hide_bad_ratings checkbox if the customer doesn't have any 4 or 5 star ratings on file
    (function() {
        var distinctRatings = getDistinctFromData(data2, 'rating');
        if (distinctRatings.indexOf('4') === -1 && distinctRatings.indexOf('5') === -1) {
            //document.getElementById("hide_bad_ratings").disabled = true;
            //$(".hide_bad_ratings_li").css("color", "lightgrey");
            $(".hide_bad_ratings_li").css("display", "none");
        }
    })();
    ////////////

    customerProductCount = data2.length;
    document.getElementById("all_count").innerHTML = customerProductCount;

    //Show Specific customer_name
    d3.selectAll("select").on("change", function() {
        //customer_name_chosen = loadSelected("customer_choice","value");
        //gift_personal_choice = loadSelected("gift_personal", "value");
        //customerDimension.filter(customer_name_chosen); 
        //customerProductCount = data.filter(function(d) {return d.customer === customer_name_chosen;}).length; 
        customerProductCount = data2.length;
        document.getElementById("all_count").innerHTML = customerProductCount;
        //giftPersonalDimension.filter(gift_personal_choice)
        show_product_list();
        dc.redrawAll();
    });


    d3.selectAll(".main_count_link").on("click", function() {
        purchaseYearDimension.filterAll();
        $('#mostRecentPurchaseYear').val('All');
        dc.renderAll();
    });

    d3.selectAll("#mostRecentPurchaseYear").on("change", function() {
        year_chosen = loadSelected("mostRecentPurchaseYear", "value");
        if (year_chosen == 'All') {
            purchaseYearDimension.filterAll();
            dc.redrawAll();
        } else {
            purchaseYearDimension.filter(year_chosen);
            dc.redrawAll();
        }

    });

    // format our data
    var commaFormat = d3.format(",.0f");
    var percentFormat = d3.format("%.0f");
    var moneyFormat = d3.format("$,.0f");
    var moneyFormatDecimal = d3.format("$,.2f");

    data.forEach(function(d) {
        d.description = d.descriptionwithvintage;
        d.descriptionWithVintage = d.description;
        d.productid = +d.product_id;
        d.price = +d.price;
        d.customer_name = d.customer;
        d.score = +d.score;
        d.sort_order = +d.sort_order;
        d.highestrating = +d.highestrating;
        d.purchases_in = +d.purchases_in;
        d.bottles = +d.bottles;
        d.giftStatus = d.giftstatus;
        d.stock = +d.stock;
        d.purchase_date = +d.MostRecentPurchaseDate;
    });


    // Calculate CUstomer Specific Metrics
    var prices = [];
    data2.forEach(function(d) {
        prices.push(d.price);
    });

    console.log(prices);

    var total_price = prices.reduce(function(a, b) {
        return a + b;
    });

    var average_price = moneyFormat(d3.sum(prices) / prices.length),
        max_price = moneyFormat(d3.max(prices));
    min_price = moneyFormat(d3.min(prices));


    console.log("Average price:" + average_price + " Max Price: " + max_price + " Min Price: " + min_price);

    /******************************************************
     * Step1: Create the dc.js chart objects & ling to div *
     ******************************************************/
    window.varietalChart = dc.rowChart("#varietalChart");
    window.regionChart = dc.rowChart("#regionChart");
    window.appellationChart = dc.rowChart("#appellationChart");
    //var priceChart = dc.rowChart("#priceChart");
    //var styleChart = dc.rowChart("#styleChart");
    //var typeChart = dc.rowChart("#typeChart");

    // var dataTable = dc.dataTable("#product-table-graph");

    console.log(data.length);
    console.log(data2.length);

    //console.log(data2.length);
    /****************************************
     *   Run the data through crossfilter    *
     ****************************************/

    var facts = crossfilter(data2); // Gets our 'facts' into crossfilter

    /******************************************************
     * Create the Dimensions                               *
     * A dimension is something to group or filter by.     *
     * Crossfilter can filter by exact value, or by range. *
     ******************************************************/


    // For datatable

    var typeDimension = facts.dimension(function(d) {
        return d.class;
    });
    var typeGroup = typeDimension.group();

    var stockDimension = facts.dimension(function(d) {
        return d.stock;
    });


    var ratingDimension = facts.dimension(function(d) {
        return d.rating;
    });
    var ratingGroup = ratingDimension.group();

    var varietalDimension = facts.dimension(function(d) {
        return d.varietal;
    });
    var varietalGroup = varietalDimension.group();

    var appellationDimension = facts.dimension(function(d) {
        return d.appellation;
    });
    var appellationGroup = appellationDimension.group();

    var regionDimension = facts.dimension(function(d) {
        return d.region;
    });
    var regionGroup = regionDimension.group();

    var purchaseYearDimension = facts.dimension(function(d) {
        return d.MostRecentPurchaseYear;
    });

    var giftPersonalDimension = facts.dimension(function(d) {
        return d.giftstatus;
    });
    var giftPersonalGroup = regionDimension.group();

    var styleDimension = facts.dimension(function(d) {
        return d.winestyle;
    });
    var styleGroup = styleDimension.group();

    var priceBucketDimension = facts.dimension(function(d) {
        if (d.price < 15) {
            return "<$15";
        } else if (d.price < 30) {
            return "$15-$30";
        } else if (d.price < 50) {
            return "$30-$50";
        } else if (d.price < 75) {
            return "$50-$75";
        } else if (d.price < 100) {
            return "$75-$100";
        } else {
            return "$100+";
        }
    });

    var priceBucketGroup = priceBucketDimension.group();

    function loadSelected(domID, valueOrText) {
        if (valueOrText == "value") {
            return document.getElementById(domID).options[document.getElementById(domID).selectedIndex].value;
        } else {
            return document.getElementById(domID).options[document.getElementById(domID).selectedIndex].innerHTML;
        }
    }


    /*
    original_name_chosen = loadSelected("customer_choice","value");
    customerDimension.filter(original_name_chosen); 
    */

    //gift_personal = loadSelected("gift_personal", "value");
    giftPersonalDimension.filter("Personal");

    var chartMargins = {
        top: 0,
        left: 10,
        right: 30,
        bottom: -2
    }
    var chartWidth = 360;
    var chartHeight = 350;
    var chartColor = "#3182BD";
    var chartCap = 7;
    var labelOffset = 23;
    // wine red is #ce2c4b
    /****************************************
     *   Data Count Widget JS   *
     ****************************************/

    var all = facts.groupAll();

    dc.dataCount(".dc-data-count")
        .dimension(facts)
        .group(all);

    //region bar chart
    regionChart.width(chartWidth)
        .margins(chartMargins)
        .height(chartHeight)
        .transitionDuration(1500)
        .dimension(regionDimension)
        .group(regionGroup)
        .ordering(function(d) {
            return -d.value;
        })
        .colors(d3.scale.ordinal().range([chartColor]))
        .elasticX(true)
        .labelOffsetY(labelOffset)
        .xAxis()
        .ticks(0).outerTickSize(0);

    regionChart
        .label(function(d) {
            return d.key + " (" + d3.format('.0f')(d.value) + ")";
        });

    regionChart
        .cap(chartCap);

    var xExtent = d3.extent(data, function(d) {
        return d.price;
    });

    varietalChart.width(chartWidth)
        .margins(chartMargins)
        .height(chartHeight)
        .transitionDuration(1500)
        .dimension(varietalDimension)
        .group(varietalGroup)
        .ordering(function(d) {
            return -d.value;
        })
        .colors(d3.scale.ordinal().range([chartColor]))
        .elasticX(true)
        .labelOffsetY(labelOffset)
        .xAxis().ticks(0).outerTickSize(0);

    varietalChart
        .cap(chartCap);

    varietalChart
        .label(function(d) {
            return d.key + " (" + d3.format('.0f')(d.value) + ")";
        });

    //varietal bar chart
    appellationChart.width(chartWidth)
        .margins(chartMargins)
        .height(chartHeight)
        .transitionDuration(1500)
        .dimension(appellationDimension)
        .group(appellationGroup)
        .ordering(function(d) {
            return -d.value;
        })
        .colors(d3.scale.ordinal().range([chartColor]))
        .elasticX(true)
        .labelOffsetY(labelOffset)
        .xAxis().ticks(0).outerTickSize(0);

    appellationChart
        .cap(chartCap);

    appellationChart
        .label(function(d) {
            return d.key + " (" + d3.format('.0f')(d.value) + ")";
        });

    appellationChart
        .on('postRender', function(typeChart) {
            dc.events.trigger(function() {
                $(".loader").fadeOut("slow");
            });
            listSlicersForAllElements();
        })
        .on('preRedraw',function(appellationChart) {
            listSlicersForAllElements();
        });


    //sortable column headers by user 
    function sort_by_user(sortOrderChosen) {
        dataTable
            .sortBy(function(d) {
                return d[sortOrderChosen];
            })
            .order(d3.descending);
        dc.renderAll();
    }


    $(".table_metric").click(function() {
        var sortValueChosen = $(this).attr("data-title");
        var sortOrderChosen = $(this).attr("value");
        console.log(sortValueChosen + " " + sortOrderChosen);
        dataTable
            .sortBy(function(d) {
                return d[sortValueChosen];
            })
            .order(d3[sortOrderChosen]);
        if (sortOrderChosen == "descending") {
            $(this).attr("value", "ascending");
        } else {
            $(this).attr("value", "descending");
        }
        dc.redrawAll();

    });

    //Any Ratings?
    var ratings = [];
    data2.forEach(function(d) {
        ratings.push(d.rating);
    });
    var max_rating = d3.max(ratings);
    console.log("Customers max rating: " + max_rating);
    var sort_metric = "purchases_in";
    if (max_rating != -1) {
        sort_metric = "rating";
    }
    console.log(sort_metric);

    show_history = function(d) {
        return "<div class='item_bottles'>" + d.bottles +
                " bottle(s) purchased</div>";
    }

    show_add_to_cart = function(d) {

        if (d.stock !== 0) {
            return "<a class='action_link' " + 
                "href='http://www.wine.com/checkout/default.aspx?mode=add&state=CA&product_id=" + 
                d.productid + "&s=wine_profile_past_purchases&cid=wine_profile_past_purchases' target='blank'>" + 
                "Buy Again</a>";
        } else
        {
            return ""
        }
    };

    show_action_buttons = function(d) {

        return "<div class='product_action_links'><a class='more_info' id='get_info_" +
            d.productid + "' data=" + d.productid + ">Quick View</a> | " + 
            "<a class='get_recs_button' id='get_recs_button_" +
            d.productid + "' data-productid=" + d.productid + ">Similar Wine</a></div>"

    };

    show_stars = function(d) {
        var stars = [];
        for (i = 0; i < d.rating; i++) {
            stars.push('<img height="20px" width="20px" src="star_red.png">');
        }
        var empty_stars = 5 - stars.length;
        for (i = 0; i < empty_stars; i++) {
            stars.push('<img height="20px" width="20px" src="star_empty.png">');
        }
        return "<div class='item_stars'>" + stars.join('') + "</div>";

    }

    var show_product_list = function() {

        var
            sort_value = loadSelected("sort_choice", "value");
        console.log("Sort = " + sort_value);

        if (sort_value === "bottles" || sort_value === "rating" || sort_value === "purchases_in" || sort_value === "purchase_date") {

            var allProducts = typeDimension.top(Infinity).sort(function(a, b) {
                return b[sort_value] - a[sort_value];
            });
        } else if (sort_value === "purchase_date_asc") {
            var allProducts = typeDimension.top(Infinity).sort(function(a, b) {
                return a[sort_value] - b[sort_value];
            });
        } else if (sort_value === "price") {
            var allProducts = typeDimension.top(Infinity).sort(function(a, b) {
                return a.price - b.price;
            });
        } else {

            var allProducts = typeDimension.top(Infinity).sort(function(a, b) {
                if (a.description < b.description) return -1;
                if (a.description > b.description) return 1;
                return 0;
            })
        }

        var numberofproducts = allProducts.length;
        var showthismany = Math.min(numberofproducts, 60)

        var topProducts = [];
        for (i = 0; i < showthismany; i++) {
            topProducts.push(allProducts[i]);
        }

        // console.log("Top Products: " + topProducts);

        $("#product_list").html("");

        topProducts.forEach(function(d) {

            $('#product_list').append("<div class='col-sm-4 product-list-item'><a href='http://www.wine.com/v6/wine/" + 
                d.productid + "/Detail.aspx?s=wine_profile_past_purchases&cid=wine_profile_past_purchases' target='_blank'>" +
                "<image class='list_image' src='http://cache2.wine.com/labels/" + d.productid + 
                "l.jpg' padding-right='10px'></a><div class='item_title'><a href='http://www.wine.com/v6/wine/" + 
                d.productid + "/Detail.aspx?s=wine_profile_past_purchases&cid=wine_profile_past_purchases' target='_blank'>" + 
                d.descriptionWithVintage + "</a></div><div class='item_region'>" + d.appellation + ", " + d.region + 
                "</div><div class='item_price'>" + moneyFormatDecimal(d.price) + "</div><div>" 
                + show_stars(d) + "</div><div>" + show_history(d) + show_add_to_cart(d) + show_action_buttons(d) +
                 " </div></div>");

            var returnedProducts = [];
            var this_product_id = d.product_id;
            var this_product_name = d.descriptionWithVintage;
            var attach_div = '.rec_container_' + this_product_id;
            //  console.log("Attach div: " + attach_div + "product name = " + this_product_name);


            //var this_strategy_description = 'ProductBoughtBought';  
            var this_strategy_description = 'SimilarProducts3';

            var myApiKey = encodeURIComponent('fd89fba2959239b2');
            var myClientKey = encodeURIComponent('983968841cc325da');

        });

    }

    $(document).on('click', ".more_info", function() {
        var id_for_api = $(this).attr("data");

        var api_url = 'https://services.wine.com/api/beta2/service.svc/json/catalog?apikey=3scale-456a2ca3b0e963b7452bf60672e53361&filter=product(' + id_for_api + ')&state=ca';

        $.get(api_url).then(function(response) {
            // use the response here, for example:                                         // Object {Status: Object, Products: Object}

            var product_node = response.Products.List[0];

            var winemakernote = product_node.Description;
            var Longitude = response.Products.List[0].GeoLocation.Longitude;
            var Latitude = response.Products.List[0].GeoLocation.Latitude;
            var prod_id = product_node.Id;
            var product_brand = product_node.Vineyard.Name;
            var prod_name = product_node.Name;
            var prod_varietal = product_node.Varietal.Name;
            var prod_appellation = product_node.Appellation.Name;
            var prod_region = product_node.Appellation.Region.Name;
            var prod_high_rating = product_node.Ratings.HighestScore;

            //var map_url = 'https://www.google.com/maps/embed/v1/place?q=' + Longitude + '5%2C%20' + Longitude+ '&key=AIzaSyAEy8PIgWRmTXkKQZKbv8Qg39JoSWFmr2Q';

            var small_label = "<img style='display:inline-block; float:left; clear: none; margin: 10px;' src='http://cache.wine.com/labels/" + prod_id + "m.jpg'>";

            var product_info = "<p>" + prod_varietal + " from " + prod_appellation + ", " + prod_region + "</p>";

            var winemakernote = "<hr><div class='winemakernote'><p>" + winemakernote + "</p></div>"

            if (Longitude !== -360) {

                $('.modal-body-product').html("<div class='row' style='background-color:white; padding:10px;'>" + small_label + product_info + winemakernote + "</div><div class='row' style='background-color:white; padding:10px';'><iframe width='250' height='250' frameborder='0' style='border:0; float: right; display: inline-block;' src='https://www.google.com/maps/embed/v1/place?q=" + Latitude + "%20" + Longitude + "&key=AIzaSyAEy8PIgWRmTXkKQZKbv8Qg39JoSWFmr2Q&zoom=8&maptype=satellite'></iframe></div>");
            } else {
                $('.modal-body-product').html("<div>" + small_label + product_info + winemakernote + "</div>");
            }

            $('.modal-title').html(prod_name);
            //$('.product_info').html(product_info);
            // $('.modal-body').html("<p>" +  map_entry + modal_description + "</p>");


            //$('#more_info_modal').remove();

            $('#more_info_modal').modal();



            console.log(response.Products.List[0].Name);
            return false;
        });
    });

    show_product_list();

    $('body').on('click', '.get_recs_button', function() { 
        recsObject.items = {};
        recsObject.productIdInput = $(this).data('productid');
        getRecs('SimilarProducts3', recsObject.productIdInput);
    });


    $('.filters').on("click", function() {

        show_product_list();
        //runAjax();

    });

    /****************************
     * Step6: Render the Charts  *
     ****************************/

    dc.renderAll();

});