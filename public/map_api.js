const lat = document.querySelector(".lat");
const lng = document.querySelector(".lng");
const centeredAddress = document.querySelector(`.center-location strong`);

const refreshBtn = document.getElementById("refresh-btn");
const stationNameEl = document.getElementById("station-name");
const stationAddressEl = document.getElementById("station-address");
const stationImageEl = document.getElementById("station-image");
const spotlightContentEl = document.getElementById("spotlight-content");
const nearestSection = document.querySelector(".nearest");

async function initMap() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    let myLatLng;
    let coordinates = pos.coords;
    if (coordinates.latitude > -30.227589) {
      myLatLng = {
        lat: -38.227589,
        lng: 146.414618,
      };
    } else {
      myLatLng = {
        lat: parseFloat(coordinates.latitude),
        lng: parseFloat(coordinates.longitude),
      };
    }

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      minZoom: 10,
      center: myLatLng,
    });

    let markers = [];

    setLocationInfo();

    map.addListener("drag", async function () {
      setLocationInfo();
    });

    function renderStations(station, distance) {
      const box = `
      <div class="box-nearest">
        <img src="/assets/logos/${station.owner
          .toLowerCase()
          .replace(
            /[" "]/g,
            "-"
          )}.png" alt="" onerror="this.src='/assets/logos/default.png';">
            <div>
              <div style="margin-bottom:5px"> 
                <p>${station.name}</p>
                <p>${station.address}</p>
              </div>
              <strong>${Math.abs(distance).toFixed(2)} m</strong>
            </div>
      </div>
      `;

      nearestSection.innerHTML += box;
    }

    let obj = {};

    map.addListener("idle", async function () {
      obj.lat = map.getCenter().lat();
      obj.lng = map.getCenter().lng();

      const { sortedIndices, data, distances } = await fetchNearStations(
        obj.lat,
        obj.lng
      );
      nearestSection.innerHTML = "";
      sortedIndices.forEach((index) => {
        const distance = distances[index];
        const station = data[index];

        renderStations(station, distance);
      });
    });

    map.addListener("dragend", async function () {
      obj.lat = map.getCenter().lat();
      obj.lng = map.getCenter().lng();
      lat.textContent = `Lat: ${obj.lat}`;
      lng.textContent = `Lng: ${obj.lng}`;

      const { sortedIndices, data, distances } = await fetchNearStations(
        obj.lat,
        obj.lng
      );
      nearestSection.innerHTML = "";
      sortedIndices.forEach((index) => {
        const distance = distances[index];
        const station = data[index];

        renderStations(station, distance);
      });
    });

    fetchPetrolStations().then((stations) => {
      stations.forEach((station) => {
        loadIcon(station);
      });
    });

    map.addListener(`dragend`, function () {
      const [north, east, south, west] = getBounds();

      fetchBoundStations(north, south, east, west).then((stations) => {
        deleteMarker();
        stations.forEach((station) => {
          loadIcon(station);
        });
      });
    });

    map.addListener(`zoom_changed`, function () {
      const [north, east, south, west] = getBounds();

      fetchBoundStations(north, south, east, west).then((stations) => {
        deleteMarker();
        stations.forEach((station) => {
          loadIcon(station);
        });
      });
    });

    async function generateRandomStation() {
      try {
        // fetch data from the API
        const response = await fetch("/api/stations/random");
        const data = await response.json();

        // update the station name, address, and image on the page
        stationNameEl.innerText = data.name;
        stationAddressEl.innerText = data.address;
        stationImageEl.src = `/assets/logos/${data.owner
          .toLowerCase()
          .replace(/[" "]/g, "-")}.png`;

        const latRandom = parseFloat(data.latitude);
        const lngRandom = parseFloat(data.longitude);
        stationNameEl.addEventListener(`click`, async () => {
          await map.setCenter({ lng: lngRandom, lat: latRandom });

          const [north, east, south, west] = getBounds();
          fetchBoundStations(north, south, east, west).then((stations) => {
            deleteMarker();
            stations.forEach((station) => {
              loadIcon(station);
            });
          });
          setLocationInfo();
        });
      } catch (err) {
        const message = document.createElement("span");
        message.textContent = err.response.data.msg;
        spotlightContentEl.append(message);
      }
    }

    // add event listener to the refresh button
    refreshBtn.addEventListener("click", async () => {
      await generateRandomStation();
    });
    // generate a random station when page loaded
    generateRandomStation();

    async function setLocationInfo() {
      const center = map.getCenter();
      const currentLat = center.lat();
      const currentLng = center.lng();

      lat.textContent = `Lat: ${currentLat}`;
      lng.textContent = `Lng: ${currentLng}`;

      let key = await fetchMapKey();
      let stringConstructor = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLat},${currentLng}&key=${key.googleMapKey}`;

      let data = await fetchAddressGeocoding(stringConstructor);

      let address;

      if (data.results[0].formatted_address.includes("+")) {
        address = data.results[0].formatted_address
          .split("+")
          .slice(1)
          .join(" ");
      } else {
        address = data.results[0].formatted_address;
      }
      centeredAddress.textContent = address;
    }

    function getBounds() {
      const northEast = map.getBounds().getNorthEast();
      const southWest = map.getBounds().getSouthWest();
      const north = northEast.lat();
      const east = northEast.lng();
      const south = southWest.lat();
      const west = southWest.lng();
      return [north, east, south, west];
    }

    function loadIcon(station) {
      const image = new Image();

      image.src = `/assets/logos/${station.owner
        .toLowerCase()
        .replace(/[" "]/g, "-")}.png`;

      let icon = {};

      image.onload = function () {
        icon = {
          url: image.src,
          scaledSize: new google.maps.Size(32, 32), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0), // anchor
        };
        createMarker(icon, station);
      };

      image.onerror = function () {
        icon = {
          url: "/assets/logos/default.png",
          scaledSize: new google.maps.Size(32, 32), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0), // anchor
        };
        createMarker(icon, station);
      };
    }

    function createMarker(icon, station) {
      const myLatLng = {
        lat: Number(station[`latitude`]),
        lng: Number(station[`longitude`]),
      };

      const marker = new google.maps.Marker({
        position: myLatLng,
        map,
        animation: google.maps.Animation.DROP,
        icon: icon,
      });

      //push marker into markers array
      markers.push(marker);

      var info = new google.maps.InfoWindow({
        content:
          "<div class=marker-label><strong>" +
          station.name +
          "</strong>" +
          "<br/>" +
          station.address +
          "</div>",
      });
      marker.addListener("mouseover", function () {
        info.open(map, this);
      });
      marker.addListener("mouseout", function () {
        info.close();
      });
      marker.addListener(`dblclick`, function () {
        map.setCenter({ lng: myLatLng.lng, lat: myLatLng.lat });

        const [north, east, south, west] = getBounds();
        fetchBoundStations(north, south, east, west).then((stations) => {
          deleteMarker();
          stations.forEach((station) => {
            loadIcon(station);
          });
        });
        setLocationInfo();
      });
    }

    // hide all the markers out of the view port
    markers.forEach((marker) => {
      if (
        map.getBounds().contains(marker.getPosition()) &&
        !marker.getVisible()
      ) {
        marker.setVisible(true);
      } else if (
        !map.getBounds().contains(marker.getPosition()) &&
        marker.getVisible()
      ) {
        marker.setVisible(false);
      }
    });

    function deleteMarker() {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }

    // SEARCH BOX USING PLACES FROM Googlemap API
    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });

    let markersOthers = [];

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markersOthers.
      markersOthers.forEach((marker) => {
        marker.setMap(null);
      });
      markersOthers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        // Create a marker for each place.
        markersOthers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

function fetchPetrolStations() {
  return axios.get(`/api/stations/all`).then((res) => res.data);
}

function fetchBoundStations(n, s, e, w) {
  return axios
    .get(`/api/stations/bounds?n=${n}&s=${s}&e=${e}&w=${w}`)
    .then((res) => res.data);
}

async function fetchMapKey() {
  return await axios.get(`/keys/googleMap`).then((res) => res.data);
}

function fetchAddressGeocoding(address) {
  return axios.get(address).then((res) => res.data);
}
function fetchNearStations(lat, lng) {
  return axios
    .get(`/api/stations/nearest?lat=${lat}&lng=${lng}&radius=${6371}`)
    .then((res) => res.data);
}
