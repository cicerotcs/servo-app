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

<<<<<<< HEAD
  map.addListener('drag', function() {
    lat.textContent = `Lat: ${map.getCenter().lat()}`
    lng.textContent = `Lng: ${map.getCenter().lng()}`
  })


=======
  map.addListener(`drag`, () => {
    let center = map.getCenter() 
    console.log(center.lat());
    console.log(center.lng());
  })

>>>>>>> de13ce6 (add grids to css columns)
  fetchPetrolStations()
    .then(stations => {
      stations.forEach(station => {
        const myLatLng = { lat: Number(station[`latitude`]), lng: Number(station[`longitude`]) };
    
        let marker = new google.maps.Marker({
          position: myLatLng,
          map,
          animation: google.maps.Animation.DROP,
        });

        var info = new google.maps.InfoWindow({
          content: '<div class=marker-label><strong>'+station.name+'</strong>' + '<br/>' + station.address + '</div>', 
        });
        marker.addListener('mouseover', function() {
          info.open(map, this)

        });
        marker.addListener('mouseout', function() {
          info.close()
        });
      });
    })
}



function fetchPetrolStations() {
  return axios.get(`/api/stations/all`).then(res => res.data)   
}