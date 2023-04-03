let map;

async function initMap() {

  const myLatLng = { lat: -25.363, lng: 131.044 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: myLatLng,
  });

  fetchPetrolStations()
    .then(stations => {
      stations.forEach(station => {
        const myLatLng = { lat: Number(station[`latitude`]), lng: Number(station[`longitude`]) };
    
        new google.maps.Marker({
          position: myLatLng,
          map,
          // title: "Hello World!",
        });
      });
    })


}



function fetchPetrolStations() {
  return axios.get(`/api/stations/all`).then(res => res.data)   
}