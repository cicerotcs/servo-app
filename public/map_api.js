let map;
const lat = document.querySelector('.lat')
const lng = document.querySelector('.lng')

async function initMap() {

  const myLatLng = { lat: -38.237589, lng: 146.394618 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    minZoom: 10,
    center: myLatLng,
  });

  map.addListener('drag', function() {
    lat.textContent = `Lat: ${map.getCenter().lat()}`
    lng.textContent = `Lng: ${map.getCenter().lng()}`
  })


  fetchPetrolStations()
    .then(stations => {
      stations.forEach(station => {
        const myLatLng = { lat: Number(station[`latitude`]), lng: Number(station[`longitude`]) };
    
        let marker = new google.maps.Marker({
          position: myLatLng,
          map,
          animation: google.maps.Animation.DROP,
        });

        var label = new google.maps.InfoWindow({
          content: '<div class=marker-label><strong>'+station.name+'</strong>' + '<br/>' + station.address + '</div>', 
        });
        marker.addListener('mouseover', function() {
          label.open(map, this);
        });
        marker.addListener('mouseout', function() {
          label.close();
        });
      });
    })
}



function fetchPetrolStations() {
  return axios.get(`/api/stations/all`).then(res => res.data)   
}