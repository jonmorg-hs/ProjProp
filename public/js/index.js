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

var currentpos;
var currentPositionMarker;

let currentlat, currentlng;
var markerid;

var markerscales = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 18, 22, 25, 28, 32, 35, 38, 40, 42, 44, 46,
  48, 50,
];

var currentposmarker = new L.LayerGroup();
var mapmarkers = new L.LayerGroup();
var savedmapmarkers = new L.LayerGroup();

var myposIcon = L.icon({
  iconUrl: "/images/pos.png",
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  popupAnchor: [0, -15],
});

var xmasIcon = L.icon({
  id: "",
  event_id: "",
  iconUrl: "/images/xmas_tree.png",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -55],
});

var halloweenIcon = L.icon({
  id: "",
  event_id: "",
  iconUrl: "/images/halloween.png",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -55],
});

var garagesaleIcon = L.icon({
  id: "",
  event_id: "",
  iconUrl: "/images/garagesale.png",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -55],
});

var route_pts = [];

$("#radius-search").val(localStorage.getItem("radius"));

var menuclosebtn = document.getElementById("menuclosebtn");
var menudata = document.getElementById("menudata");

menuclosebtn.addEventListener("click", function () {
  document.getElementById("menu").style.display = "none";
});

var map = L.map("map", { minZoom: 3, maxZoom: 22 }).setView(
  [-37.77669, 145.05574],
  18
);

map.locate({ setView: true, maxZoom: 16 });

map.zoomControl.setPosition("bottomright");
var baselayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 22,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
).addTo(map);

map.on("zoomend", function () {
  var currentZoom = map.getZoom();
  var newSize = markerscales[currentZoom];
  var newoffset = -1 * newSize - 5;
  var newmidoffset = newSize / 2;
  savedmapmarkers.eachLayer(function (layer) {
    if (layer.options.event_id == 1) {
      xmasIcon = new L.Icon({
        id: layer.options.event_id,
        event_id: 1,
        iconUrl: "/images/xmas_tree.png",
        iconSize: [newSize, newSize],
        iconAnchor: [newmidoffset, newSize],
        popupAnchor: [0, newoffset],
      });
      layer.setIcon(xmasIcon);
    }
    if (layer.options.event_id == 2) {
      halloweenIcon = new L.Icon({
        id: layer.options.event_id,
        event_id: 2,
        iconUrl: "/images/halloween.png",
        iconSize: [newSize, newSize],
        iconAnchor: [newmidoffset, newSize],
        popupAnchor: [0, newoffset],
      });
      layer.setIcon(halloweenIcon);
    }
    if (layer.options.event_id == 3) {
      garagesaleIcon = new L.Icon({
        id: layer.options.event_id,
        event_id: 3,
        iconUrl: "/images/garagesale.png",
        iconSize: [newSize, newSize],
        iconAnchor: [newmidoffset, newSize],
        popupAnchor: [0, newoffset],
      });
      layer.setIcon(garagesaleIcon);
    }
  });
  mapmarkers.eachLayer(function (layer) {
    if (layer.options.event_id == 1) {
      xmasIcon = new L.Icon({
        id: layer.options.event_id,
        event_id: 1,
        iconUrl: "/images/xmas_tree.png",
        iconSize: [newSize, newSize],
        iconAnchor: [newmidoffset, newSize],
        popupAnchor: [0, newoffset],
      });
      layer.setIcon(xmasIcon);
    }
    if (layer.options.event_id == 2) {
      halloweenIcon = new L.Icon({
        id: layer.options.event_id,
        event_id: 2,
        iconUrl: "/images/halloween.png",
        iconSize: [newSize, newSize],
        iconAnchor: [newmidoffset, newSize],
        popupAnchor: [0, newoffset],
      });
      layer.setIcon(halloweenIcon);
    }
    if (layer.options.event_id == 3) {
      garagesaleIcon = new L.Icon({
        id: layer.options.event_id,
        event_id: 3,
        iconUrl: "/images/garagesale.png",
        iconSize: [newSize, newSize],
        iconAnchor: [newmidoffset, newSize],
        popupAnchor: [0, newoffset],
      });
      layer.setIcon(garagesaleIcon);
    }
  });
});

currentposmarker.addTo(map);
mapmarkers.addTo(map);
savedmapmarkers.addTo(map);

function savedmarkers() {
  fetch("/api/properties/saved/", {
    method: "get",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((response) => getsavedmarkers(response));
}

function getsavedmarkers(markers) {
  console.log(JSON.stringify(markers));
  savedmapmarkers.clearLayers();
  var searchmarkers = [];
  var marker, i;
  for (i = 0; i < markers.length; i++) {
    var html = `<div style='font:normal 16px arial; border-radius:20px;'><b>${
      markers[i].address
    }</b><br/><br/>${markers[i].event}<br/><br/>Start: ${moment(
      markers[i].start_date
    ).format("MMM Do YY")}  ${markers[i].start_time}</b><br/>End: ${moment(
      markers[i].end_date
    ).format("MMM Do YY")}  ${
      markers[i].end_time
    }</b><br/><br/><img style='width:341px;height:200px;margin-left:-20px' src='/images/house${
      markers[i].id
    }.jpeg' /><br/><br/><i class="fas fa-heart saveBtn" onclick=\"saveProperty(${
      markers[i].id
    })\"></i><i id='likeimage_${
      markers[i].id
    }' class="fas fa-thumbs-up likeBtn" style='margin-left:20px;magin-bottom:20px;' onclick=\"likeProperty(${
      markers[i].id
    },${markers[i].event_id})\")></i><label id='like_${markers[i].id}' like='${
      markers[i].like
    }' style='display:inline-block;margin-left:5px;font:bold 30px arial'>${
      markers[i].reviews
    }</label></div>`;
    if (markers[i]["event_id"] == 1) {
      mapIcon = xmasIcon;
    } else if (markers[i]["event_id"] == 2) {
      mapIcon = halloweenIcon;
    } else if (markers[i]["event_id"] == 3) {
      mapIcon = garagesaleIcon;
    } else {
      mapIcon = xmasIcon;
    }
    marker = L.marker([markers[i]["lat"], markers[i]["lng"]], {
      icon: mapIcon,
      id: markers[i]["id"],
      event_id: markers[i]["event_id"],
    })
      .addTo(map)
      .bindPopup(html);
    savedmapmarkers.addLayer(marker);
    searchmarkers.push(marker);
  }
  console.log(savedmapmarkers);
  var search = new L.featureGroup(searchmarkers);
 // map.fitBounds(search.getBounds().pad(0.3));
}

function getmarkers(markers) {
  console.log(JSON.stringify(markers));
  mapmarkers.clearLayers();
  var searchmarkers = [];
  var marker, i;
  for (i = 0; i < markers.length; i++) {
    var html = `<div style='font:normal 16px arial;border-radius:20px;'><b>${
      markers[i].address
    }</b><br/><br/>${markers[i].event}<br/>Start: ${moment(
      markers[i].start_date
    ).format("MMM Do YY")}  ${markers[i].start_time}</b><br/>End: ${moment(
      markers[i].end_date
    ).format("MMM Do YY")}  ${
      markers[i].end_time
    }</b><br/><br/><img style='width:341px;height:200px;margin-left:-20px' src='/images/house${
      markers[i].id
    }.jpeg' /><br/><br/><i class="fas fa-heart saveBtn" onclick=\"saveProperty(${
      markers[i].id
    })\"></i><i id='likeimage_${
      markers[i].id
    }' class="fas fa-thumbs-up likeBtn" style='margin-left:20px;magin-top:-30px;' onclick=\"likeProperty(${
      markers[i].id
    },${markers[i].event_id})\")></i><label id='like_${markers[i].id}' like='${
      markers[i].like
    }' style='display:inline-block;margin-left:5px;font:bold 30px arial'>${
      markers[i].reviews
    }</label></div>`;
    if (markers[i]["event_id"] == 1) {
      mapIcon = xmasIcon;
    } else if (markers[i]["event_id"] == 2) {
      mapIcon = halloweenIcon;
    } else if (markers[i]["event_id"] == 3) {
      mapIcon = garagesaleIcon;
    } else {
      mapIcon = xmasIcon;
    }
    marker = L.marker([markers[i]["lat"], markers[i]["lng"]], {
      icon: mapIcon,
      id: markers[i]["id"],
      event_id: markers[i]["event_id"],
    })
      .addTo(map)
      .bindPopup(html);
    mapmarkers.addLayer(marker);
    searchmarkers.push(marker);
  }
  $("#menu").css({ height: "250px" });
  var search = new L.featureGroup(searchmarkers);
  map.fitBounds(search.getBounds().pad(0.3));
}

function saveProperty(id) {
  var check = 0;
  savedmapmarkers.eachLayer(function (layer) {
    if (layer.options.id == id) {
      check = 1;
    }
  });
  if (check == 1) {
    showMessage("Property already a favorite");
  } else {
    fetch("/api/properties/save/", {
      method: "post",
      body: JSON.stringify({
        id,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((response) => showMessage("Property Liked"));
  }
}

function showMessage(message) {
  $("#message").html(message);
  setTimeout(function () {
    $("#message").html("");
  }, 3000);
}

function likeProperty(property_id) {
  if (
    $("#like_" + property_id).attr("like") === "liked" ||
    $("#dlike_" + property_id).attr("like") === "liked"
  ) {
    showMessage("You have already liked this property");
  } else {
    var likes = $("#like_" + property_id).text() * 1;
    var newlikes = likes + 1;
    $("#like_" + property_id).html(newlikes);
    $("#like_" + property_id).attr("like", "liked");
    $("#likeimage_" + property_id).attr("src", "/images/liked.png");
    var likes = $("#dlike_" + property_id).text() * 1;
    var newlikes = likes + 1;
    $("#dlike_" + property_id).html(newlikes);
    $("#dlike_" + property_id).attr("like", "liked");
    $("#dlikeimage_" + property_id).attr("src", "/images/liked.png");
    fetch("/api/properties/like/", {
      method: "post",
      body: JSON.stringify({
        property_id,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((response) => showMessage("Property Liked"));
  }
}

function removeProperty(property_id) {
  var check = confirm(
    "Do you wish to remove this property from your favorites"
  );

  if (check) {
    fetch(`/dashboard/${property_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((response) => window.location.reload());
  }
}

function showMarker(id) {
  savedmapmarkers.eachLayer(function (layer) {
    if (layer.options.id == id) {
      layer.bounce();
      layer.openPopup();
      map.setView(layer.getLatLng(), 18);
    } else {
      layer.stopBouncing();
    }
  });
  $("#menu").css({ height: "250px" });
}

function getEventLikes(property_id) {
  fetch("/api/events/likes/", {
    method: "post",
    body: JSON.stringify({
      property_id,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((response) => window.location.reload());
}

function displayAndWatch(position) {
  setCurrentPosition(position);
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
  currentlat = pos.coords.latitude;
  currentlng = pos.coords.longitude;
  currentposmarker.clearLayers();
  currentPositionMarker = L.marker(
    [pos.coords.latitude, pos.coords.longitude],
    {
      icon: myposIcon,
    }
  )
    .addTo(map)
    .bindPopup("current position");
  currentposmarker.addLayer(currentPositionMarker);
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

$(document).ready(function () {
  if (!!navigator.geolocation) {
    wpid = navigator.geolocation.getCurrentPosition(displayAndWatch, locError, {
      maximumAge: 0,
      timeout: 1000,
      enableHighAccuracy: true,
    });
  } else {
    alert("Your browser does not support the Geolocation API");
  }
  savedmarkers();
});

setInterval(function () {
  if (!!navigator.geolocation) {
    wpid = navigator.geolocation.getCurrentPosition(displayAndWatch, locError, {
      maximumAge: 0,
      timeout: 1000,
      enableHighAccuracy: true,
    });
  }
}, 5000);
