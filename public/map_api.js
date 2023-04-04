<<<<<<< HEAD
=======
let map;
let markers = []
>>>>>>> 05be68f (add drag fetch station events on boundaries)
const lat = document.querySelector(".lat");
const lng = document.querySelector(".lng");

async function initMap() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    let myLatLng
    let coordinates = pos.coords;
    if (coordinates.latitude > -30.227589) {
      myLatLng = {
        lat: -38.227589,
        lng: 146.414618
      }
    } else {
      myLatLng = {
        lat: parseFloat(coordinates.latitude),
        lng: parseFloat(coordinates.longitude),
        }
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

<<<<<<< HEAD
    map.addListener("zoom_changed", function () {
      fetchPetrolStations().then((stations) => {
        markers.forEach((marker) => {
          marker.setMap(null);
        });
        template(stations);
      });
    });
    map.addListener("dragend", function () {
      fetchPetrolStations().then((stations) => {
        markers.forEach((marker) => {
          marker.setMap(null);
        });

        template(stations);
      });
    });

    function template(stations) {
=======


    fetchPetrolStations().then((stations) => {
>>>>>>> 05be68f (add drag fetch station events on boundaries)
      stations.forEach((station) => {

        loadIcon(station)

<<<<<<< HEAD
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
          createMarker(icon);
        };

        image.onerror = function () {
          icon = {
            url: "/assets/logos/default.png",
            scaledSize: new google.maps.Size(32, 32), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0), // anchor
          };
          createMarker(icon);
        };

        function createMarker(icon) {
          const marker = new google.maps.Marker({
            position: myLatLng,
            map,
            animation: google.maps.Animation.DROP,
            icon: icon,
            optimized: true,
          });

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

          markers.push(marker);
        }
      });
=======
      });
    });

    map.addListener(`dragend`, function () {
      const northEast = map.getBounds().getNorthEast()
      const southWest = map.getBounds().getSouthWest()
      const north = northEast.lat()
      const east = northEast.lng()
      const south = southWest.lat()
      const west = southWest.lng()

      fetchBoundStations(north, south, east, west)
        .then(stations => {
          deleteMarker()
          stations.forEach(station => {
            loadIcon(station)
          })
        })

      // console.log(north, east, south, west);
      // console.log(map.getBounds().getNorthEast().lat())
      // console.log(map.getBounds().getSouthWest().lng())
    })

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
      markers.push(marker)

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
>>>>>>> 05be68f (add drag fetch station events on boundaries)
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
  return axios.get(`/api/stations/bounds?n=${n}&s=${s}&e=${e}&w=${w}`).then((res) => res.data)
}