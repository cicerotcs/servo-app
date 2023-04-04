const lat = document.querySelector(".lat");
const lng = document.querySelector(".lng");

async function initMap() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    let coordinates = pos.coords;
    let myLatLng = {
      lat: parseFloat(coordinates.latitude),
      lng: parseFloat(coordinates.longitude),
    };

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
      stations.forEach((station) => {
        const myLatLng = {
          lat: Number(station[`latitude`]),
          lng: Number(station[`longitude`]),
        };

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
