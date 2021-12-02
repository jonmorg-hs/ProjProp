$( function() {
  $(".datepicker").datepicker();
  $(".timepicker").timepicker();
} );

function updateeventHandler(event) {
  event.preventDefault();
  const id = location_id;
  const event_id = document.querySelector("#type-event").value;
  const start_date = document.querySelector("#startdate-event").value;
  const start = document.querySelector("#starttime-event").value;
  const start_time = parseInt(
    new Date(start_date + " " + start).getTime() / 1000
  ).toFixed(0);

  const end_date = document.querySelector("#enddate-event").value;
  const end = document.querySelector("#endtime-event").value;
  const end_time = parseInt(
    new Date(end_date + " " + end).getTime() / 1000
  ).toFixed(0);

  if (event_id && start_date && end_date && start_time && end_time) {
    fetch(`/api/events/${id}`, {
      method: "put",
      body: JSON.stringify({
        event_id,
        start_date,
        end_date,
        start_time,
        end_time,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {response.json()
      console.log("UPDATED EVENT",response)})
      .then((response) => showMessage("Event updated"));
  }
}

document
  .querySelector(".event-form")
  .addEventListener("submit", updateeventHandler);
