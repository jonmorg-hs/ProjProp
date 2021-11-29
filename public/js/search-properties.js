async function newFormHandler(event) {
  event.preventDefault();

  const radius = document.querySelector('input[id="radius-search"]').value;
  const lat = currentlat;
  const lng = currentlng;
  const response = await fetch("/api/properties/search", {
    method: "post",
    body: JSON.stringify({
      radius,
      lat,
      lng,
    }),
    headers: { "Content-Type": "application/json" },
  }).then(function (res) {
    console.log(JSON.stringify(res));
    getmarkers(res);
  });
}

document
  .querySelector(".search-form")
  .addEventListener("submit", newFormHandler);
