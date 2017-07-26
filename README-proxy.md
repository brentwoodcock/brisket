# Zomato Proxy #

Included is a simple node server that will pass requests to it through to the zomato api.  If an OPTIONS request is received, it will just respond with a 200 response.  It also adds some basic CORS headers to the responses from the Zomato api

## Setup ##
To setup the server, run ```npm install``` from this directory

## Run ##
To run the server, run ```node index.js``` from this directory.  By default, the server will run on port 3000.  In your web app, instead of pointing at the zomato domain (developers.zomato.com), just point to localhost:3000 and keep the rest of the url path for the Zomato api the same
