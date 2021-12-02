function registerHandler(event) {
  event.preventDefault();
  const street_address = document.querySelector("#address-register").value;
  const suburb = document.querySelector("#suburb-register").value;
  const city = document.querySelector("#city-register").value;
  const postcode = document.querySelector("#postcode-register").value;

  if (street_address && suburb && city && postcode) {
    let latitude = 0;
    let longitude = 0;
    let lookupaddress = street_address + " " + suburb;
    $.getJSON(
      "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAjyk6thum-ylKNZU0QCa2ZnuS4uoNY4hM&address=" +
        lookupaddress +
        "&sensor=false",
      null,
      function (data) {
        console.log(data);
        let p = data.results[0].geometry.location;
        latitude = p.lat;
        longitude = p.lng;
        let address = data.results[0].formatted_address;
        fetch("/api/properties", {
          method: "post",
          body: JSON.stringify({
            address,
            latitude,
            longitude,
          }),
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((response) => showMessage("Your property has been registered"));
      }
    );
  }
}

document
  .querySelector(".register-form")
  .addEventListener("submit", registerHandler);
