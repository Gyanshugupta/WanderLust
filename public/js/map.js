maptilersdk.config.apiKey = mapToken; 

const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 14 // starting zoom
});

const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url(${listing.image.url})`;
      el.style.width = '40px';
      el.style.height = '40px';

      el.style.backgroundSize = 'cover';
el.style.borderRadius = '50%'; 
el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

new maptilersdk.Marker({ element:el })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
     new maptilersdk.Popup({ offset: 25 })
     .setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking.</p>`)
  )
  .addTo(map);
  map.setStyle(maptilersdk.MapStyle.HYBRID);