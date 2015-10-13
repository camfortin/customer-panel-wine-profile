## Wine Profile Using D3 and Crossfilter

### Back End To Do
* Update CSV Nightly

###V1.1

* Show Loading Spinner until data loaded
* Add person’s name to top
* Recs
	* Update rec population to go through RR strategies in order and render results for first strategy with results: Tastes Like, Similar Products, Bought Bought, Popular in Region / Varietal
	* Call for 40, chose 10 randomly and show
* Hide elements if not applicable
	* Purchase Time: populate with actual purchase years
	* Sort: populate with applicable values
	* Gift / Personal drop down restricted to actual
	* Hide 4+ star rated if no ratings
* Change product names and attributes to numbers with lookups
* Change date to number with lookup?
* **Commit v1.1**

###V1.2

* Change charts from Pie to vertical Row chart
	* Only show Varietal, Region, Appellation, Price, Style
* Show recommended products on click, not automatically
* Return 50 products for purhased list instead of current 10
* Add all currently selected filters in text above filters title with "x" to remove each

###V1.3

* Show "more info" modal for seed or rec wine showing extra info for wine - including professional reviews - will need to make RR API to do this as it isn't in current wine.com public API

###V1.4
* Drive via API (RR or Meteor? Probably RR)
* Add authentication


