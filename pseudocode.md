## WhichWine Project Pseudocode ##

This is certainly not set in stone but something to start working from.

Sections marked **SECOND** usually involve **GreenSock.js** animations and should wait until the main structure of the site is in place (everything not marked SECOND).

There is only one html page.  All transformations happen on the same page without reloading.

### Sign-in ###

Landing page view is an overlay over just the background image (no other page elements yet) with a *header paragraph*; and *two options* presented side-by-side in desktop and in single file for mobile.  

Header paragraph says **WhichWine can help you find wines for any occasion, pin them for safekeeping, and purchase them online**.  

First option says **Sign in to Pinterest to pin your selections**, followed by a Pinterest-red button with the **Pinterest Logo** that says **Sign In** and another button of indeterminate color underneath, that says **Sign Up**.

Second option says **Continue without signing in (you will not be able to save your selections)**, followed by a grey button that says **Continue**.

Do we need to persist sign in with firebase or does Pinterest take care of that?

### Default sidebar appearance and links ###

I've written this assuming we will use a sidebar for main links and header info.  It should obviously convert somehow for mobile, possibly collapsing into a hamburger and expanding to the same sidebar as desktop on touch.

Sidebar contents: Site title and logo, an onclick div that says **Find Wines**, and an onclick div with the **Pinterest Logo** to view Pinterest Boards **View and Create Boards**.  

**SECOND** Once a search has been performed, search parameters become sidebar links with checkboxes to manipulate search results showing by adding and subtracting parameters from the API call and calling it again.


### Page configured for initial search ###

**SECOND** animate the transition from the sign-in overlay to the initial search page using slide in of one of the following: all content at once; some elements individually; bounce; etc (something cool and consistent with what we do elsewhere in the site).

Onload of page configured for initial search is basic search div already showing centered horizontally and vertically by setting subrow padding with calc((100viewport dimensions - element dimensions)/2) in the main body of the page, with media queries for smaller screens.  Basic search div includes: text field for string search term, dropdown for type of wine per types on wine.com, and price option with min and max fields to create range.  Basic search div also includes a link to advanced search and a **Find Wines** or **Search** button.  A condition of using wine.com's api is including their logo, name, and link in the search div and output(will address output later).  They have a small one that should work for us [wine.com logo](http://cache.wine.com/images/logos/80x20_winecom_logo.png).

Throughout the user experience, every time the basic search form shows, the Find Wines onclick div shows that it is activated through color change in the Find Wines onclick div to match the main site background (instead of the sidebar).  

**SECOND** The basic search form show animates whenever it is opened.

Advanced search div replaces everything on page like basic search div.  Fields include all relevant options that the API can pull, including name, price min and max, suggested retail price, year, appellation (string: region, area, endeca identifier), varietal (string: endeca, name, wine type), vineyard (numeric id, name string), ratings(numeric highest score), community review (we can only pull one review without paying).  Lots of these results include urls to more info on wine.com, which we could open in a new window so users can come back to pinning wines after reading more on wine.com.  Also includes a button to submit search and a link to toggle back to basic search div.

### About View and Create Boards with Search toggle ###

Onclick div to view & create boards: onclick it animates and shows selection in sidebar like basic search div, loading first a board selection dropdown and board creation field and then appending board contents once board is selected.  Once board contents are appended they stay appended even when navigating to other features of the site.  When the user returns to the view and create boards onclick the board selection dropdown, board creation field, and last appended board contents greet them.  Pin edit options open in Pinterest-styled popups like the login.  This is dependent on being able to create embedded display of boards.

ajax call?  [of Pinterest API with parameters](https://developers.pinterest.com/tools/api-explorer/) exploring the Pinterest API is beyond the scope of the inital broad brush pseudocoding.

Search results stay loaded in JS/firebase until another search is performed.  This allows the user to toggle back and forth from search results to their board, pinning and editing pins and pinning again.

Explore attaching metadata when pinning wines so that some of the accompanying data makes it into the Pinterest object.

###  wine.com search API parameters ###

in basic search only one parameter is required, if we can get away with that.
type is always wine
what is endeca -- [oracle data management product](http://blog.performancearchitects.com/wp/2013/08/07/so-what-is-endeca-anyway/)

### Search Results ###

ajax call of wine.com api onclick submit, JSON result

create thumbnails from JSON result. set html of col -- subrow (sidebar)  to transparent colored col-xs-3 divs with .5em padding and .25em margins, set to width calc(25% - padding and margins).  change percentages in calc to show 3, 2, and 1 col-xs-3 per row with media queries.  display the following: centered label up to 150px in height if the images are that big at source, otherwise set max at min result dimensions; name of wine; type of wine; and wine price.  include two buttons: pin this wine, which pops up Pinterest board selection, and buy at wine.com, which includes the link and logo in the search div description above.  Explore pin this wine options in Pinterest API, whether we can use our boards page or we have to use a pop-up template.  Open buy at wine.com in a new tab.

**SECOND** animate transition to boards

### Search Details ###

Sadly the wine description is a partner feature.  We could provide the URL to the product detail in a new window.

Otherwise, return all details we can for free, and offer the same buttons for Pin this Wine and Buy at wine.com.  If possible, create links/buttons to show other wines with the same characteristics.  This presents the problem of logging search history to return to a previous search, perhaps by creating buttons in the sidebar to repeat the API call?

**SECOND** animate to show context amongst the search results.  animate return to search results from detail div.



