async function registerHandler(event) {
  event.preventDefault();
  alert(document.querySelector("#address-register").value.trim());
  const address = document.querySelector("#address-register").value.trim();
  const suburb = document.querySelector("#suburb-register").value.trim();
  const city = document.querySelector("#city-register").value.trim();
  const postcode = document.querySelector("#postcode-register").value.trim();

  if (address && suburb && city && postcode) {
    const response = await fetch("/api/properties/register", {
      method: "post",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert(
        "Login credentials do not exist, please sign up or check your username or password"
      );
      //alert(response.statusText);
    }
  }
}

document
  .querySelector(".register-form")
  .addEventListener("submit", registerHandler);
