# Petrol station locator app

An app to locate a petrol station on a map based on your geographical location

## Created by team errorMakers:
- Cicero (Gitlord): [https://github.com/cicerotcs](https://github.com/cicerotcs)
- Ak (Gitpeasant): [https://github.com/Akthiha](https://github.com/Akthiha)
- Iffath (Gitpeasant): [https://github.com/iffath02](https://github.com/iffath02)
- Stefanus (Gitpeasant): [https://github.com/Amingman](https://github.com/Amingman)
---
## How to use
### 1. Get your keys

This app uses APIs from multiple sources. To use it, put them in your .env file

APIs used:
- [Google](https://developers.google.com/maps)
    - Google Map
    - Geocoding
    - Places
- [Commodities API](https://commodities-api.com/)

### 2. Database setup
- Using postgreSQL, create a database called petrol_map.
- create a table called petrol_station as per the provided schema.
- Run the readCsv.js file to seed your database

### 3. Run the server and load the page ~ Enjoy

---
## Features
### 1. Spotlight
Currently, this section highlight a random petrol station. Clicking on the ***refresh*** button will highlight a new random petrol station. Clicking on the name of the station will take you to the station location.

### 2. Stats
These are the statistics of petrol stations in the databse we displayed the top-7 corporations with largest number of stations.

### 3. Latest Prices
Shows the current prices for WTI and Brent Oil in USD per barrel and Natural Gas in USD per million British Thermal Unit (MMBtu).

The data is fetched from **Commodities API**

### 4. About
Meet the team!

### 5. Date and Time
This is based on your browser geolocation

### 6. Map Center Location
This section displays your current position in the map using latitude and longitude.
The address of the coordinate is also displayed here using ***Geocoding API***.

### 7. Nearest
Displayed the top-10 nearest petrol station from the center point of the map for all of your petrol-filling needs.

### 8. Hotkeys (case insensitive)

Uses | Hotkey
-------|-------
Hide the sidebars | Ctrl + B
Dark Mode | Ctrl + D

### 9. Markers Manipulation
- Double-click on a marker on the map to recenter the map to its location.
- (to be implemented) Click on a station in the nearest section to recenter the map to its location.

### 10. Search for a place
- Are you located in Jakarta, while the petrol station data is in Australia? You're not gonna use this app if you must scroll for an hour to get there!

    Introducing search bar, powered by Google Places API!

    Simply type in the place/area that you want to go and we will take you there!
- The search feature also works for other items supported by Google Places! Try *"Chinese restaurant"* or *"convenience store"*.

---