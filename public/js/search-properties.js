function newFormHandler(event) {
  event.preventDefault();

  const radius = document.querySelector('input[id="radius-search"]').value;
  const event_id = document.querySelector('select[id="event-search"]').value;
  localStorage.setItem("radius", radius);
  const lat = currentlat;
  const lng = currentlng;
  fetch("/api/properties/search", {
    method: "post",
    body: JSON.stringify({
      radius,
      lat,
      lng,
      event_id,
    }),
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((response) => getmarkers(response));
}

document
  .querySelector(".search-form")
  .addEventListener("submit", newFormHandler);
