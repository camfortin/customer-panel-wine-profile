
  
/*
$( "#hide_filters" ).click(function() {
  $( "#filters" ).slideToggle( "slow" );
  if ($(this).html() == "Hide Filters") {
    $("#hide_filters").html("Show Filters");
    }
    else {
    $("#hide_filters").html("Hide Filters");
    }
  });
  */

function substringFormat(text) {
if ( text.length > 70) {
return text.substring(0,70) + "...";
}
else
{
return text;
}
}


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
d3.csv("products_customer_internal.csv", function (data) {
 
//getting the product count for just the customer selected and insertign into DOM
 //customer_name_chosen = loadSelected("customer_choice","value"),
 //customerProductCount = data.filter(function(d) {return d.customer === customer_name_chosen;}).length;
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "Cam F" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


/*
$('#hide_bad_ratings').click(function () {
  if ($('#hide_bad_ratings').html() == 'Show 4 &amp; 5 Star Only') {
    $("#hide_bad_ratings").html("Show All Ratings");
    ratingDimension.filterFunction(function(d) { return d > 3; });
      dc.redrawAll();
    }
    else {
    $("#hide_bad_ratings").html("Show 4 &amp; 5 Star Only");
    ratingDimension.filterAll();
    dc.redrawAll();
    }
})
*/

$('#hide_bad_ratings').click(function () {
  if (document.getElementById('hide_bad_ratings').checked) {
      ratingDimension.filterFunction(function(d) { return d > 3; });
        dc.redrawAll();
    }
    else {
      ratingDimension.filterAll();
      dc.redrawAll();
    }
})

/*
$('#hide_oos').click(function () {
  if ($('#hide_oos').html() == 'Exclude Out Of Stock') {
    $("#hide_oos").html("Include Out Of Stock");
    stockDimension.filterFunction(function(d) { return d > 0; });
      dc.redrawAll();
    }
    else {
    $("#hide_oos").html("Exclude Out Of Stock");
    stockDimension.filterAll();
    dc.redrawAll();
    }
})
*/

$('#hide_oos_check').click(function () {
  if (document.getElementById('hide_oos_check').checked) {
        console.log('false');
      stockDimension.filterAll();
      dc.redrawAll();

    }
    else {
      console.log('true');
      stockDimension.filterFunction(function(d) { return d > 0; });
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
});

var customerSelected = getParameterByName('customer');
console.log(customerSelected);


//Filter for a name before loading into crossfilter
var data2 = data.filter(function(d, i) { return d.customer == customerSelected; });
//var priceFilter = data.filter(function(d, i) { return d.price < 20; });
//var regionVarietalCombo = data.filter(function(d, i) { return d.varietal + ' ' + d.appellation == 'Cabernet Sauvignon Argentina' ; });

//////////// 2015-10-13 ML
//populate dropdowns with only available slices for the current customer
document.getElementById('customerName').innerHTML = customerSelected + "'s ";
populateDropdown(data2,'MostRecentPurchaseYear','mostRecentPurchaseYear','','All',1,'All Time');
populateDropdown(data2,'giftstatus','gift_personal',' Purchases','Personal',0,'');

//remove hide_bad_ratings checkbox if the customer doesn't have any 4 or 5 star ratings on file
(function() {
  var distinctRatings = getDistinctFromData(data2,'rating');
  if(distinctRatings.indexOf('4') === -1 && distinctRatings.indexOf('5') === -1) {
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
    gift_personal_choice = loadSelected("gift_personal", "value");
  //customerDimension.filter(customer_name_chosen); 
  //customerProductCount = data.filter(function(d) {return d.customer === customer_name_chosen;}).length; 
  customerProductCount = data2.length; 
  document.getElementById("all_count").innerHTML = customerProductCount;
  giftPersonalDimension.filter(gift_personal_choice)
  show_product_list();
    dc.redrawAll();
  });


  d3.selectAll(".main_count_link").on("click", function() { 
  purchaseYearDimension.filterAll();
  $('#mostRecentPurchaseYear').val('All');
    dc.renderAll();
  });

  d3.selectAll("#mostRecentPurchaseYear").on("change", function() {
    year_chosen = loadSelected("mostRecentPurchaseYear","value");
  if (year_chosen == 'All') 
  {
    purchaseYearDimension.filterAll();
    dc.redrawAll();
  }
  else
  {
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
    d.description   = d.description; 
    d.productid  = +d.productid;
  d.price = +d.price;
  d.customer_name = d.customer;
  d.score = +d.score;
  d.sort_order = +d.sort_order;
  d.highestrating = +d.highestrating;
  d.purchases_in = +d.purchases_in;
  d.bottles = +d.bottles;
  d.giftStatus = d.giftstatus;
  d.stock = +d.stock;
  d.purchase_date = +d.lastPurchaseDate;
  });


// Calculate CUstomer Specific Metrics
var prices = [];
 data2.forEach(function(d) { 
  prices.push(d.price);
  });

 var total_price = prices.reduce(function(a, b) {
  return a + b;
  });

 var average_price = moneyFormat(d3.sum(prices)/prices.length), 
  max_price = moneyFormat(d3.max(prices));
  min_price = moneyFormat(d3.min(prices));


 console.log("Average price:" + average_price + " Max Price: " + max_price + " Min Price: " + min_price);



/******************************************************
* Step1: Create the dc.js chart objects & ling to div *
******************************************************/
  var varietalChart = dc.pieChart("#varietalChart");
  var regionChart = dc.pieChart("#regionChart");
  var appellationChart = dc.pieChart("#appellationChart");
  var priceChart = dc.pieChart("#priceChart");
  var styleChart = dc.pieChart("#styleChart");
  var typeChart = dc.pieChart("#typeChart");

  // var dataTable = dc.dataTable("#product-table-graph");

console.log(data.length);
console.log(data2.length);

//console.log(data2.length);
/****************************************
*   Run the data through crossfilter    *
****************************************/

  var facts = crossfilter(data2);  // Gets our 'facts' into crossfilter

/******************************************************
* Create the Dimensions                               *
* A dimension is something to group or filter by.     *
* Crossfilter can filter by exact value, or by range. *
******************************************************/


  // For datatable

  var typeDimension = facts.dimension(function (d) {
  return d.class  ;
  }); 
  var typeGroup = typeDimension.group();

  var stockDimension = facts.dimension(function (d) {
  return d.stock;
  });

  var ratingDimension = facts.dimension(function (d) {
  return d.rating ;
  }); 
  var ratingGroup = ratingDimension.group();

  var varietalDimension = facts.dimension(function (d) {
  return d.varietal;
  });
  var varietalGroup = varietalDimension.group();

  var appellationDimension = facts.dimension(function (d) {
  return d.appellation;
  });
  var appellationGroup = appellationDimension.group();

  var regionDimension = facts.dimension(function (d) {
  return d.region;
  });
  var regionGroup = regionDimension.group();

  var purchaseYearDimension = facts.dimension(function (d) {
  return d.MostRecentPurchaseYear;
  });

    var giftPersonalDimension = facts.dimension(function (d) {
  return d.giftstatus;
  });
  var giftPersonalGroup = regionDimension.group();

  var styleDimension = facts.dimension(function (d) {
  return d.winestyle;
  });
  var styleGroup = styleDimension.group();

  var priceBucketDimension = facts.dimension(function (d) {
    if (d.price < 15) {return "<$15";}
    else if (d.price < 30) {return "$15-$30";}
    else if (d.price < 50) {return "$30-$50";}
    else if (d.price < 75) {return "$50-$75";}
    else if (d.price < 100) {return "$75-$100";}
    else {return "$100+";}
  });

  var priceBucketGroup = priceBucketDimension.group();
    
  function loadSelected(domID,valueOrText) {
    if(valueOrText == "value") {
      return document.getElementById(domID).options[document.getElementById(domID).selectedIndex].value;
    }
    else {
      return document.getElementById(domID).options[document.getElementById(domID).selectedIndex].innerHTML;
    }
  }

/*
original_name_chosen = loadSelected("customer_choice","value");
customerDimension.filter(original_name_chosen); 
*/

gift_personal = loadSelected("gift_personal","value");
giftPersonalDimension.filter(gift_personal); 


/****************************************
*   Data Count Widget JS   *
****************************************/

  var all = facts.groupAll();

  dc.dataCount(".dc-data-count")
   .dimension(facts)
   .group(all);


var chartWidth = 245;
var chartHeight = 245;
var chartRadius = 120;
var minAngleLabels = .3;
var chartSlicesCap = 7;


regionChart
        .width(chartWidth) // (optional) define chart width, :default = 200
        .height(chartHeight) // (optional) define chart height, :default = 200
        .radius(chartRadius) // define pie radius
        .dimension(regionDimension) // set dimension
        .group(regionGroup) // set group
        /* (optional) by default pie chart will use group.key as its label
         * but you can overwrite it with a closure */
        .ordering(function(d){return -d.value;})
        /*
        .label(function (d) {
            if (regionChart.hasFilter() && !regionChart.hasFilter(d.key)) {
                return d.key + '(0%)';
            }
            var label = d.key;
            if (all.value()) {
                label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
            }
            return label;
        }) 
*/
    .label(function (d) {
            return d.key ;
        })
  .renderLabel(true)
  .minAngleForLabel([minAngleLabels])
  .slicesCap([chartSlicesCap])
  .on('postRedraw', function(regionChart) {
   // runAjax();
  })
  ;

varietalChart
        .width(chartWidth) // (optional) define chart width, :default = 200
        .height(chartHeight) // (optional) define chart height, :default = 200
        .radius(chartRadius) // define pie radius
        .dimension(varietalDimension) // set dimension
        .group(varietalGroup) // set group
        
        .ordering(function(d){return -d.value;})
    .label(function (d) {
            return d.key ;
        })
  .minAngleForLabel([minAngleLabels])
  .slicesCap([chartSlicesCap]);

priceChart
        .width(chartWidth) // (optional) define chart width, :default = 200
        .height(chartHeight) // (optional) define chart height, :default = 200
        .radius(chartRadius) // define pie radius
        .dimension(priceBucketDimension) // set dimension
        .group(priceBucketGroup) // set group
        .ordering(function(d){return -d.value;})
    .label(function (d) {
            return d.key ;
        })
  .minAngleForLabel([minAngleLabels])
  .slicesCap([chartSlicesCap]);

appellationChart
        .width(chartWidth) // (optional) define chart width, :default = 200
        .height(chartHeight) // (optional) define chart height, :default = 200
        .radius(chartRadius) // define pie radius
    .dimension(appellationDimension) // set dimension
    .group(appellationGroup) // set group
        .ordering(function(d){return -d.value;})
        .label(function (d) {
            return d.key ;
        })
  .renderLabel(true)  
  .minAngleForLabel([minAngleLabels])
  .slicesCap([chartSlicesCap]);


styleChart
        .width(chartWidth) // (optional) define chart width, :default = 200
        .height(chartHeight) // (optional) define chart height, :default = 200
        .radius(chartRadius) // define pie radius
    .dimension(styleDimension) // set dimension
    .group(styleGroup) // set group
        .ordering(function(d){return -d.value;})
       .label(function (d) {
            return d.key ;
        })
  .renderLabel(true)
    .minAngleForLabel([minAngleLabels])
  .slicesCap([chartSlicesCap]);

typeChart
        .width(chartWidth) // (optional) define chart width, :default = 200
        .height(chartHeight) // (optional) define chart height, :default = 200
        .radius(chartRadius) // define pie radius
    .dimension(typeDimension) // set dimension
    .group(typeGroup) // set group
        .ordering(function(d){return -d.value;})
    .label(function (d) {
            return d.key ;
        })
  .renderLabel(true)
    .minAngleForLabel([minAngleLabels])
  .slicesCap([chartSlicesCap])
  .on('postRender',function(typeChart){
    // smooth the rendering through event throttling
    dc.events.trigger(function(){
        $(".loader").fadeOut("slow");
    });
  })
  ;

//sortable column headers by user 
  function sort_by_user(sortOrderChosen) {
  dataTable 
  .sortBy(function(d){ return d[sortOrderChosen]; })
    .order(d3.descending);
  dc.renderAll();
} 


$( ".table_metric" ).click(function() {
    var sortValueChosen = $(this).attr("data-title");
    var sortOrderChosen = $(this).attr("value");
  console.log(sortValueChosen + " " + sortOrderChosen);
  dataTable 
  .sortBy(function(d){ return d[sortValueChosen]; })
    .order(d3[sortOrderChosen]);
  if (sortOrderChosen == "descending") {
     $(this).attr("value","ascending");
    }
    else {
     $(this).attr("value","descending");
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
   if (max_rating != -1) {sort_metric = "rating";}
   console.log(sort_metric);

  show_correct_buttons = function(d) { 

    if (d.stock === 0) {
          return    "<div class='item_stats' style='margin-top:10px;'><div class='item_bottles'>Bottles Purchased: " + d.bottles + "</div><div class='item_purchases'>Purchases: "  + d.purchases_in + "</div></div>";} 
          else {
          return "<div class='item_bottles'>Bottles Purchased: " + d.bottles + "</div><div class='item_purchases'>Purchases: "  + d.purchases_in + "</div><a href='http://www.wine.com/checkout/default.aspx?mode=add&state=CA&product_id=" + d.product_id + "&s=wine_profile_past_purchases&cid=wine_profile_past_purchases' target='blank'><button type='button' style='margin-left: 10px' class='add_to_cart btn btn-primary list_buttons'" + d.product_id + "'>Add to Cart</button></a>";}
        };
  
  show_stars = function(d) {
        var stars = [];
        for (i=0; i<d.rating ; i++) {
        stars.push('<img height="20px" width="20px" src="star_red.png">');
        }
        var empty_stars = 5-stars.length;
        for (i=0; i<empty_stars ; i++) {
        stars.push('<img height="20px" width="20px" src="star_empty.png">');
        }
        return "<div class='item_stars'>" + stars.join('') + "</div>";

      }

var show_product_list = function() {



var 

    sort_value = loadSelected("sort_choice", "value");
  console.log("Sort = " + sort_value);

if (sort_value === "bottles" || sort_value === "rating" || sort_value === "purchases_in" || sort_value === "purchase_date") 
{

  var allProducts = typeDimension.top(Infinity).sort(function(a,b) {
      return b[sort_value] - a[sort_value];
    });
}

else if (sort_value  === "purchase_date_asc")
{
    var allProducts = typeDimension.top(Infinity).sort(function(a,b) {
      return a[sort_value] - b[sort_value];
    });
}

else if (sort_value === "price_ascending")
{
  var allProducts = typeDimension.top(Infinity).sort(function(a,b) {
    return a.price - b.price;
  });
}

else
{

  var allProducts = typeDimension.top(Infinity).sort(function(a, b){
      if(a.description < b.description) return -1;
      if(a.description > b.description) return 1;
      return 0;
  })
}

var topProducts = [];
for (i = 0 ; i < 10 ; i++) {
  topProducts.push(allProducts[i]);
}

// console.log("Top Products: " + topProducts);

  $("#product_list").html("");

    topProducts.forEach(function(d) { 

  $('#product_list').append("<div class='row rec_row' data='" + d.product_id + "' data-title='" + d.descriptionWithVintage +"' style='border-bottom: 1px solid gray;'><div class='col-sm-4 product-list-item'><h4>You Purchased</h4><a href='http://www.wine.com/v6/wine/" + d.product_id + "/Detail.aspx?s=wine_profile_past_purchases&cid=wine_profile_past_purchases' target='_blank'><image class='list_image' src='http://cache2.wine.com/labels/" + d.product_id + "l.jpg' padding-right='10px'></a><div class='item_title'><a href='http://www.wine.com/v6/wine/" + d.product_id + "/Detail.aspx?s=wine_profile_past_purchases&cid=wine_profile_past_purchases' target='_blank'>" + d.descriptionWithVintage + "</a></div><div class='item_region'>" + d.appellation + ", " + d.region + "</div><div class='item_price'>" + moneyFormatDecimal(d.price) + "</div><div>" + show_stars(d) + "</div><div>" + show_correct_buttons(d) + " </div></div><div class='col-sm-8 recs_container' data='" + d.product_id + "' data-title='" + d.descriptionWithVintage +"'><h4>Similar Products to " + d.descriptionWithVintage + "</h4><div class='rec_container_" + d.product_id + "' data='" + d.product_id + "' data-title='" + d.descriptionWithVintage + "'></div></div></div><div class='row' style='padding-top: 10px;'><ul class='nav nav-list'><li class='divider'></li></ul></div>");

      var returnedProducts = [];
      var this_product_id = d.product_id;
      var this_product_name = d.descriptionWithVintage;
      var attach_div = '.rec_container_' + this_product_id;
    //  console.log("Attach div: " + attach_div + "product name = " + this_product_name);


    //var this_strategy_description = 'ProductBoughtBought';  
    var this_strategy_description = 'SimilarProducts3';

    var myApiKey = encodeURIComponent('fd89fba2959239b2'); 
    var myClientKey = encodeURIComponent('983968841cc325da');

     //console.log(this_product_description + " " + this_product_id);
     //console.log(this_strategy_description);

    $.ajax('https://recs.richrelevance.com/rrserver/api/rrPlatform/recsUsingStrategy', {
        data: {
            apiClientKey: myClientKey,
            apiKey: myApiKey,
            userId: '1841734',
            sessionId: '74ea5182-47e1-47e5-a305-238e2c4df806',
            resultCount: 24,
            // strategyName: 'SimilarProducts3',
            //strategyName: "RecentlyPurchased3",
            strategyName: "SimilarProducts3",
            seed: this_product_id,
            jsonp: true,
            jcb: '?'
        }, dataType: 'jsonp'
     }).then(function(data) {
        var items = data.recommendedProducts.map(function(item) {
            item.regional_sku = 'REGIONAL_SKU';
            item.highest_rating_publications_ini = "XX";
            item.price = (''+item.priceCents).replace(/(.*)([0-9]{2}$)/, '$$$1.$2');
            item.sale_price = item.salePriceCents ? (''+item.salePriceCents).replace(/(.*)([0-9]{2}$)/, '$$$1.$2') : item.salePriceCents;
            return item;
        });


    for (i=0 ; i<items.length ; i++)
    {

    var titleone = items[i].name;

    // WHY DOESNT THIS WORK!!!  $('#recs_container_105748') or
    // WHY DOESNT THIS WORK!!!  $('#' + attach_div) 
       
    attach_div_test = '.rec_container_' + '105748';
    attach_div_fake = '.recs_container_105748';

       //$(attach_div).append("<div class='rec_product'><a href='http://www.wine.com/v6/wine/" + items[i].id + "/Detail.aspx?s=wine_profile_recs&cid=wine_profile_recs' ><img class='rec_image' src='http://cache.wine.com/labels/" + items[i].id + "l.jpg'><span class='rec_title'>" + items[i].name + "</span></a><span class='rec_price'>" + items[i].sale_price + "</span><a class='more_info' style='font-size: 1.2em; margin-right: 10px; top:20px;' data='" + items[i].id +"' href='javascript:void(0);'>more info</a><a href='http://www.wine.com/checkout/default.aspx?mode=add&state=CA&product_id=" + items[i].id +"&s=wine_profile_rec_modal&cid=wine_profile_rec_modal' target='blank'><button class='add_to_cart btn btn-primary' style='margin-top: 10px;' data='" + items[i].id + "'>Add to Cart</button></div>");
       $(attach_div).append("<div class='rec_product'><a href='http://www.wine.com/v6/wine/" + items[i].id + "/Detail.aspx?s=wine_profile_recs&cid=wine_profile_recs' ><img class='rec_image' src='http://cache.wine.com/labels/" + items[i].id + "l.jpg'><span class='rec_title'>" + items[i].name + "</span></a><span class='rec_price'>" + items[i].sale_price + "</span><button class='more_info btn' style='margin-top: 10px; margin-right: 10px' data='" + items[i].id +"' href='javascript:void(0);'>more...</button><a href='http://www.wine.com/checkout/default.aspx?mode=add&state=CA&product_id=" + items[i].id +"&s=wine_profile_rec_modal&cid=wine_profile_rec_modal' target='blank'><button class='add_to_cart btn btn-primary' style='margin-top: 10px;' data='" + items[i].id + "'>Add to Cart</button></a></div>");

    }
    });
      });

  }

  $(document).on('click', ".more_info", function () {
  var id_for_api = $(this).attr("data");

  var api_url = 'https://services.wine.com/api/beta2/service.svc/json/catalog?apikey=3scale-456a2ca3b0e963b7452bf60672e53361&filter=product(' + id_for_api + ')&state=ca';
    
  $.get(api_url).then(function(response) {
    // use the response here, for example:                                         // Object {Status: Object, Products: Object}

    var product_node = response.Products.List[0];

    var modal_description = product_node.Description;
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

    var product_info = "<h5>" + prod_varietal + " from " + prod_appellation + ", " + prod_region + "</h5>";


    if (Longitude !== -360) {
    
      $('.modal-body').html("<div class='row' style='background-color:white; padding:10px;'>" + small_label + product_info + modal_description + "</div><div class='row' style='background-color:white; padding:10px';'><iframe width='250' height='250' frameborder='0' style='border:0; float: right; display: inline-block;' src='https://www.google.com/maps/embed/v1/place?q=" + Latitude + "%20" + Longitude + "&key=AIzaSyAEy8PIgWRmTXkKQZKbv8Qg39JoSWFmr2Q&zoom=14&maptype=satellite'></iframe></div>");
  } else {
    $('.modal-body').html("<div>" + small_label + product_info + modal_description + "</div>");
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

  
  $('.filters').on("click", function() {

   show_product_list();
  //runAjax();

   
   });


/****************************
* Step6: Render the Charts  *
****************************/
      
  dc.renderAll();

});
  