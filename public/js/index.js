let wpid = false;
let currentpos;
let currentPositionMarker;
let currentlat, currentlng;

let markerscales = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 18, 22, 25, 28, 32, 35, 38, 40, 42, 44, 46,
  48, 50,
];

let currentposmarker = new L.LayerGroup();
let mapmarkers = new L.LayerGroup();
let savedmapmarkers = new L.LayerGroup();

function getIcon(image, iconSize, iconAnchor, popupAnchor) {
  return L.icon({
    id: "",
    event_id: "",
    iconUrl: `/images/${image}`,
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor,
  });
}

let myposIcon = getIcon("pos.png", [10, 10], [5, 5], [0, -15]);
let xmasIcon = getIcon("xmas_tree.png", [50, 50], [25, 50], [0, -55]);
let halloweenIcon = getIcon("halloween.png", [50, 50], [25, 50], [0, -55]);
let garagesaleIcon = getIcon("garagesale.png", [50, 50], [25, 50], [0, -55]);

let route_pts = [];

$("#radius-search").val(localStorage.getItem("radius"));
let menubtn = document.getElementById("menubtn");
let menuclosebtn = document.getElementById("menuclosebtn");
let menudata = document.getElementById("menudata");

menubtn.addEventListener("click", function () {
  toggleMenu("show");
});

menuclosebtn.addEventListener("click", function () {
  toggleMenu("hide");
});

let map = L.map("map", { minZoom: 3, maxZoom: 22 }).setView(
  [-37.77669, 145.05574],
  18
);

map.locate({ setView: true, maxZoom: 16 });

map.zoomControl.setPosition("bottomright");
let baselayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 22,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
).addTo(map);

function getIconForEvent(layer, event_id, image, newSize, newmidoffset, newoffset) {
  return new L.Icon({
    id: layer.options.event_id,
    event_id: event_id,
    iconUrl: `/images/${image}`,
    iconSize: [newSize, newSize],
    iconAnchor: [newmidoffset, newSize],
    popupAnchor: [0, newoffset],
  });
}

map.on("zoomend", function () {
  let currentZoom = map.getZoom();
  let newSize = markerscales[currentZoom];
  let newoffset = -1 * newSize - 5;
  let newmidoffset = newSize / 2;
  savedmapmarkers.eachLayer(function (layer) {
    if (layer.options.event_id == 1) {
      xmasIcon = getIconForEvent(
        layer,
        1,
        "xmas_tree.png",
        newSize,
        newmidoffset,
        newoffset
      );
      layer.setIcon(xmasIcon);
    }
    if (layer.options.event_id == 2) {
      halloweenIcon = getIconForEvent(
        layer,
        2,
        "halloween.png",
        newSize,
        newmidoffset,
        newoffset
      );
      layer.setIcon(halloweenIcon);
    }
    if (layer.options.event_id == 3) {
      garagesaleIcon = getIconForEvent(
        layer,
        3,
        "garagesale.png",
        newSize,
        newmidoffset,
        newoffset
      );
      layer.setIcon(garagesaleIcon);
    }
  });
  mapmarkers.eachLayer(function (layer) {
    if (layer.options.event_id == 1) {
      xmasIcon = getIconForEvent(
        layer,
        1,
        "xmas_tree.png",
        newSize,
        newmidoffset,
        newoffset
      );
      layer.setIcon(xmasIcon);
    }
    if (layer.options.event_id == 2) {
      halloweenIcon = getIconForEvent(
        layer,
        2,
        "halloween.png",
        newSize,
        newmidoffset,
        newoffset
      );
      layer.setIcon(halloweenIcon);
    }
    if (layer.options.event_id == 3) {
      garagesaleIcon = getIconForEvent(
        layer,
        3,
        "garagesale.png",
        newSize,
        newmidoffset,
        newoffset
      );
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
  savedmapmarkers.clearLayers();
  let searchmarkers = [];
  let marker, i;
  for (i = 0; i < markers.length; i++) {
    let html = `<div style='font:normal 16px arial; border-radius:20px;'><b>${
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
      .on("click", onClick)
      .bindPopup(html);
    savedmapmarkers.addLayer(marker);
    searchmarkers.push(marker);
  }
  let search = new L.featureGroup(searchmarkers);
  map.fitBounds(search.getBounds().pad(0.3));
}

function getmarkers(markers) {
  mapmarkers.clearLayers();
  let searchmarkers = [];
  let marker, i;
  for (i = 0; i < markers.length; i++) {
    let html = `<div style='font:normal 16px arial;border-radius:20px;'><b>${
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
      .on("click", onClick)
      .bindPopup(html);
    mapmarkers.addLayer(marker);
    searchmarkers.push(marker);
  }
  let search = new L.featureGroup(searchmarkers);
  map.fitBounds(search.getBounds().pad(0.3));
  if ($("#event-search").val() == 1) {
    xmas_sound.play();
  } else if ($("#event-search").val() == 2) {
    halloweend_sound.play();
  }
  if ($(window).width() < 600) {
    toggleMenu("hide");
  }
}

function onClick() {
  if ($(window).width() < 600) {
    toggleMenu("hide");
  }
}

function toggleMenu(display) {
  document.getElementById("menu").style.display =
    display === "hide" ? "none" : "block";
  document.getElementById("menubtn").style.display =
    display === "hide" ? "block" : "none";
}

function saveProperty(id) {
  if ($("#fav_" + id).attr("save") * 1 === 1) {
    showMessage("Property already a favorite");
  } else {
    $("#fav_" + id).attr({ save: 1, src: "/images/saved.png" });
    fetch("/api/properties/save/", {
      method: "post",
      body: JSON.stringify({
        id,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => showMessage("Property added to favorites."));
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
    let likes = $("#like_" + property_id).text() * 1;
    let newlikes = likes + 1;
    $("#like_" + property_id).html(newlikes);
    $("#like_" + property_id).attr("like", "liked");
    $("#likeimage_" + property_id).attr("src", "/images/liked.png");
    let dashlikes = $("#dlike_" + property_id).text() * 1;
    let dashnewlikes = dashlikes + 1;
    $("#dlike_" + property_id).html(dashnewlikes);
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
  let check = confirm(
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
  if ($(window).width() < 600) {
    toggleMenu("hide");
  }
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
      showMessage("location services permission denied");
      break;
    case error.POSITION_UNAVAILABLE:
      showMessage("gps position unavailable");
      wpid = navigator.geolocation.getCurrentPosition(
        displayAndWatch,
        locError,
        { maximumAge: 0, timeout: 1000, enableHighAccuracy: true }
      );
      break;
    case error.TIMEOUT:
      showMessage("gps timeout");
      wpid = navigator.geolocation.getCurrentPosition(
        displayAndWatch,
        locError,
        { maximumAge: 0, timeout: 1000, enableHighAccuracy: true }
      );
      break;
    case error.UNKNOWN_ERROR:
      showMessage("unknown gps error");
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

let xmas_sound = new Howl({
  src: ["/audio/xmas_sound.mp3"],
  autoplay: false,
  volume: 0.6,
});

let halloweend_sound = new Howl({
  src: ["/audio/halloween_sound.mp3"],
  autoplay: false,
  volume: 0.6,
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("../serviceworker.js").then(
      function (registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}
