async function newFormHandler(event) {
  event.preventDefault();

  const radius = document.querySelector('input[id="radius-search"]').value;
  const suburb = document.querySelector('input[id="suburb-search"]').value;
  const city = document.querySelector('input[id="city-search"]').value;

  const response = await fetch(`/api/properties`, {
    method: "POST",
    body: JSON.stringify({
      radius,
      suburb,
      city,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.replace("/dashboard");
  } else {
    alert(response.statusText);
  }
}

document
  .querySelector(".search-form")
  .addEventListener("submit", newFormHandler);
