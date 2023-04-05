// let map;
let markers = []
const lat = document.querySelector(".lat");
const lng = document.querySelector(".lng");

const refreshBtn = document.getElementById("refresh-btn");
const stationNameEl = document.getElementById("station-name");
const stationAddressEl = document.getElementById("station-address");
const stationImageEl = document.getElementById("station-image");
const spotlightContentEl = document.getElementById("spotlight-content");


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

    map.addListener("drag", function () {
      lat.textContent = `Lat: ${map.getCenter().lat()}`;
      lng.textContent = `Lng: ${map.getCenter().lng()}`;
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


    // add event listener to the refresh button
    refreshBtn.addEventListener("click", async () => {
      try {
        // fetch data from the API
        const response = await fetch("/api/stations/random");
        const data = await response.json();


        // update the station name, address, and image on the page
        stationNameEl.innerText = data.name;
        stationAddressEl.innerText = data.address;
        stationImageEl.src = `/assets/logos/${data.owner.toLowerCase().replace(/[" "]/g, "-")}.png`;

        const latRandom = parseFloat(data.latitude) 
        const lngRandom = parseFloat(data.longitude) 
        stationNameEl.addEventListener(`click`, async () => {
          await map.setCenter({lng: lngRandom, lat: latRandom})
          
          const [north, east, south, west] = getBounds();
          fetchBoundStations(north, south, east, west).then((stations) => {
            deleteMarker();
            stations.forEach((station) => {
              loadIcon(station);
            });
          });
        })

      } catch (error) {
        console.error(error);
      }
    });



        // show a random station when the page is loaded
    (async () => {
      try {
        // fetch data from the API
        const response = await fetch("/api/stations/random");
        const data = await response.json();

        // update the station name, address, and image on the page
        stationNameEl.innerText = data.name;
        stationAddressEl.innerText = data.address;
        stationImageEl.src = `/assets/logos/${data.owner.toLowerCase().replace(/[" "]/g, "-")}.png`;
        
        const latRandom = parseFloat(data.latitude) 
        const lngRandom = parseFloat(data.longitude) 
        stationNameEl.addEventListener(`click`, async () => {
          await map.setCenter({lng: lngRandom, lat: latRandom})
          
          const [north, east, south, west] = getBounds();
          fetchBoundStations(north, south, east, west).then((stations) => {
            deleteMarker();
            stations.forEach((station) => {
              loadIcon(station);
            });
          });
        })
      } catch (error) {
        console.error(error);
      }
    })()



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
    }

    function deleteMarker() {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }
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






