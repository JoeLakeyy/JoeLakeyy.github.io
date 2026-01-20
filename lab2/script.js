// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9lbGFrZXkiLCJhIjoiY21rY2xxdWsyMDFvMDNlczhqNTZycGZ6dyJ9.Li-XmDB7wAtxdsiD_NF4lQ";

function getSIMDColor(percent) {
  if (percent <= 10) return "#67001f"; // most deprived
  if (percent <= 20) return "#b2182b";
  if (percent <= 30) return "#d6604d";
  if (percent <= 40) return "#f4a582";
  if (percent <= 50) return "#fddbc7";
  if (percent <= 60) return "#ffffbf";
  if (percent <= 70) return "#92c5de";
  if (percent <= 80) return "#4393c3";
  if (percent <= 90) return "#2166ac";
  if (percent <= 100) return "#053061";
  return "#1a9641"; // least deprived
}

// Define a map object by initialising a Map from Mapbox
const map = new mapboxgl.Map({
  container: "map",
  // Replace YOUR_STYLE_URL with your style URL.
  style: "mapbox://styles/joelakey/cmkmn6zjr002u01qpfckockb8",
  center: [-4.2518, 55.8642],
  zoom: 10
});

//map.on("mousemove", (event) => {
// const dzone = map.queryRenderedFeatures(event.point, {
//    layers: ["glasgow_simd_layer"]
//  });
//  document.getElementById("pd").innerHTML = dzone.length
//    ? `<h3>${dzone[0].properties.DZName}</h3><p>Rank:
//<strong>${dzone[0].properties.Percentv2}</strong> %</p>`
//    : `<p>Hover over a data zone!</p>`;
//});

map.on("load", () => {
  map.on("mousemove", (event) => {
    const dzone = map.queryRenderedFeatures(event.point, {
      layers: ["glasgow_simd_layer"]
    });

    const featuresBox = document.getElementById("features");

    if (dzone.length) {
      const f = dzone[0];

      // 1. Get the SIMD percentage
      const percent = Number(f.properties.Percentv2);

      // 2. Compute the colour for the background
      const color = getSIMDColor(percent);
      featuresBox.style.backgroundColor = color;

      // ⭐ 3. PUT YOUR WHITE-TEXT LOGIC RIGHT HERE ⭐
      if (percent < 20 || percent > 80) {
        featuresBox.classList.add("white-text");
      } else {
        featuresBox.classList.remove("white-text");
      }

      // 4. Update the text content
      document.getElementById("pd").innerHTML = `
        <h3>${f.properties.DZName}</h3>
        <p>Rank: <strong>${percent}</strong> %</p>
      `;
    } else {
      // Reset when not hovering
      featuresBox.style.backgroundColor = "#fff";
      featuresBox.classList.remove("white-text");
      document.getElementById(
        "pd"
      ).innerHTML = `<p>Hover over a data zone!</p>`;
    }
    map.getSource("hover").setData({
      type: "FeatureCollection",
      features: dzone.map(function (f) {
        return { type: "Feature", geometry: f.geometry };
      })
    });
  });
});

map.on("load", () => {
  const layers = [
    "<10",
    "20 ",
    "30 ",
    "40 ",
    "50 ",
    "60 ",
    "70 ",
    "80 ",
    "90 ",
    "100"
  ];
  const colors = [
    "#67001f",
    "#b2182b",
    "#d6604d",
    "#f4a582",
    "#fddbc7",
    "#d1e5f0",
    "#92c5de",
    "#4393c3",
    "#2166ac",
    "#053061"
  ];
  // create legend
  const legend = document.getElementById("legend");
  layers.forEach((layer, i) => {
    const color = colors[i];
    const key = document.createElement("div");
    if (i <= 1 || i >= 8) {
      key.style.color = "white";
    }

    key.className = "legend-key";
    key.style.backgroundColor = color;
    key.innerHTML = `${layer}`;
    legend.appendChild(key);
  });

  map.addSource("hover", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });
  map.addLayer({
    id: "dz-hover",
    type: "line",
    source: "hover",
    layout: {},
    paint: {
      "line-color": "black",
      "line-width": 4
    }
  });
});

const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for places in Glasgow", // Placeholder text for the search bar
  proximity: {
    longitude: 55.8642,
    latitude: 4.2518
  } // Coordinates of Glasgow center
});

map.addControl(geocoder, "top-left");

map.addControl(new mapboxgl.NavigationControl(), "top-left");

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-left"
);