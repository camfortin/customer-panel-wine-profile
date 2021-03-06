## Wine Profile Using D3 and Crossfilter

[Live Version](https://dl.dropboxusercontent.com/u/6406525/customer_panel_wine_profile/profile.html?customer=Karthik%20K)

##Research

**Using D3 and crossfilter in meteor**
* D3 and word clouds to filter?
* [DC JS meteor package] (https://atmospherejs.com/mrt/dc.js-package)
* [Hackpad showing how to use dc without mongo in meteor](https://meteor.hackpad.com/Visualize-mongoDb-with-dcJs-Meteor-D0rvgO774Oo#:h=iv)-Issue)

Algorithms
* Which lists to show to which customers
* Predicted product purchase affinity / rating

##Versions

###V1.0: Live

###V1.1

**Front End** 

* ~~Show Loading Spinner until data loaded~~
* ~~Add customer name to UI~~
* ~~Hide elements if not applicable~~
* ~~Change charts from Pie to vertical Row chart~~
	* Make text white and make bar widths consistent
* Recs
	* Update rec population to go through RR Recs for Placement API anduse: Tastes Like, Similar Products, Bought Bought, Popular in Region / Varietal
	* Call for 40, chose 10 randomly and show

**Back End**

* Create Rich Relevance API with customer product information instead of csv file
	* Add purchase date in addition to just purchase year

**Add Commit v1.1**

###V1.2
* Show recommended products on click, not automatically
* Return 50 products for purhased list instead of current 10
* Add all currently selected filters in text above filters title with "x" to remove each

###V1.3
* Show "more info" modal for seed or rec wine showing extra info for wine - including professional reviews - will need to make RR API to do this as it isn't in current wine.com public API


###V1.4
* Create algorithm to surface recommended lists and products to customer

###V1.5
* Add authentication



