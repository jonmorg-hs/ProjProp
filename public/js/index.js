var wpid = false;
var z,
  op,
  prev_lat,
  prev_lng,
  min_speed = 0,
  max_speed = 0,
  min_altitude = 0,
  max_altitude = 0,
  distance_travelled = 0,
  min_accuracy = 150,
  date_pos_updated = "",
  info_string = "";
var currentposmarker = [];
var currentpos;
var currentPositionMarker;
var infowindow;

var map;

var markers = [
  { address: "35 Otterington Grove, Ivanhoe", lat: -37.77669, lng: 145.05574 },
  { address: "150 The Boulevard, Ivanhoe", lat: -37.77347, lng: 145.05055 },
  { address: "158 The Boulevard, Ivanhoe", lat: -37.77385, lng: 145.05109 },
  { address: "170 The Boulevard, Ivanhoe", lat: -37.77461, lng: 145.05202 },
  { address: "180 The Boulevard, Ivanhoe", lat: -37.77503, lng: 145.05265 },
  { address: "144 The Boulevard, Ivanhoe", lat: -37.77278, lng: 145.04945 },
  { address: "197 The Boulevard, Ivanhoe", lat: -37.7765, lng: 145.05475 },
  { address: "205 The Boulevard, Ivanhoe", lat: -37.77705, lng: 145.05542 },
  { address: "223 The Boulevard, Ivanhoe", lat: -37.777759, lng: 145.05661 },
];
var route_pts = [];

var menubtn = document.getElementById("menubtn");
var menuclosebtn = document.getElementById("menuclosebtn");
var menudata = document.getElementById("menudata");

menubtn.addEventListener("click", function () {
  document.getElementById("menu").style.display = "block";
});

menuclosebtn.addEventListener("click", function () {
  document.getElementById("menu").style.display = "none";
});

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(-37.77669, 145.05574),
    zoom: 15,
    panControl: false,
    scaleControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  });

  if (!!navigator.geolocation) {
    wpid = navigator.geolocation.getCurrentPosition(displayAndWatch, locError, {
      maximumAge: 0,
      timeout: 1000,
      enableHighAccuracy: true,
    });
  } else {
    alert("Your browser does not support the Geolocation API");
  }

  infowindow = new google.maps.InfoWindow();

  var marker, i;
  for (i = 0; i < markers.length; i++) {
    const propertyDiv = document.createElement("div");
    propertyDiv.classList.add("propertyCard");
    var elem = document.createElement("img");
    elem.setAttribute("src", "/images/house.png");
    elem.setAttribute("margin-left", "10");
    elem.setAttribute("margin-top", "5");
    elem.setAttribute("height", "90");
    elem.setAttribute("width", "90");
    propertyDiv.appendChild(elem);
    var label = document.createElement("label");
    label.innerText = markers[i]["address"];
    propertyDiv.appendChild(label);
    //menudata.append(propertyDiv);

    var point = new google.maps.LatLng(markers[i]["lat"], markers[i]["lng"]);
    route_pts.push(point);
    marker = new google.maps.Marker({
      position: point,
      map: map,
      title: markers[i]["address"],
      icon: {
        url: "/images/tree.png",
        scaledSize: new google.maps.Size(30, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 50),
      },
    });
    google.maps.event.addListener(
      marker,
      "click",
      (function (marker, i) {
        return function () {
          var html = markers[i]["address"] + "<br/>REVIEW:";
          infowindow.setContent(html);
          infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -20) });
          infowindow.setPosition(marker.position);
          infowindow.open(map);
        };
      })(marker, i)
    );
  }
}

function registerProperty() {
  var data = {};
  data.street = $("#street").val();
  data.suburb = $("#suburb").val();
  data.postcode = $("#postcode").val();
  var address = "176 The Boulevard, Ivanhoe";
  $.getJSON(
    "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAjyk6thum-ylKNZU0QCa2ZnuS4uoNY4hM&address=" +
      address +
      "&sensor=false",
    null,
    function (data) {
      console.log(data);
      var p = data.results[0].geometry.location;
      var lat = p.lat;
      var lng = p.lng;
    }
  );
}

function displayAndWatch(position) {
  setCurrentPosition(position);
  watchCurrentPosition();
}

function locError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("permission denied");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("position unavailable");
      wpid = navigator.geolocation.getCurrentPosition(
        displayAndWatch,
        locError,
        { maximumAge: 0, timeout: 1000, enableHighAccuracy: true }
      );
      break;
    case error.TIMEOUT:
      console.log("timeout");
      wpid = navigator.geolocation.getCurrentPosition(
        displayAndWatch,
        locError,
        { maximumAge: 0, timeout: 1000, enableHighAccuracy: true }
      );
      break;
    case error.UNKNOWN_ERROR:
      console.log("unknown error");
      wpid = navigator.geolocation.getCurrentPosition(
        displayAndWatch,
        locError,
        { maximumAge: 0, timeout: 1000, enableHighAccuracy: true }
      );
      break;
  }
}

function setCurrentPosition(pos) {
  for (i in currentposmarker) {
    currentposmarker[i].setMap(null);
  }
  currentposmarker.length = 0;
  currentPositionMarker = new google.maps.Marker({
    icon: new google.maps.MarkerImage(
      "//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png",
      new google.maps.Size(22, 22),
      new google.maps.Point(0, 18),
      new google.maps.Point(11, 11)
    ),
    position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
    title: "Current Position",
    map: map,
    zIndex: 6,
  });
  currentposmarker.push(currentPositionMarker);
}

function watchCurrentPosition(position) {
  var positionTimer = navigator.geolocation.watchPosition(function (position) {
    setMarkerPosition(currentPositionMarker, position);
  });
}

function setMarkerPosition(marker, position) {
  marker.setPosition(
    new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
  );
}

function saveMapState() {
  var mapZoom = map.getZoom();
  var mapCentre = map.getCenter();
  var mapLat = mapCentre.lat();
  var mapLng = mapCentre.lng();
  var cookiestring = mapLat + "_" + mapLng + "_" + mapZoom;
  setCookie("myMapCookie", cookiestring, 30);
}

function loadMapState() {
  var gotCookieString = getCookie("myMapCookie");
  var splitStr = gotCookieString.split("_");
  var savedMapLat = parseFloat(splitStr[0]);
  var savedMapLng = parseFloat(splitStr[1]);
  var savedMapZoom = parseFloat(splitStr[2]);
  if (!isNaN(savedMapLat) && !isNaN(savedMapLng) && !isNaN(savedMapZoom)) {
    map.setCenter(new google.maps.LatLng(savedMapLat, savedMapLng));
    map.setZoom(savedMapZoom);
  }
}

function setCookie(c_name, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value =
    escape(value) +
    (exdays == null ? "" : "; expires = " + exdate.toUTCString());
  document.cookie = c_name + " = " + c_value;
}

function getCookie(c_name) {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
  return "";
}
