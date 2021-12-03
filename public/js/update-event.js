
$(function () {
  $(".datepicker").datepicker({
    dateFormat: "yy-mm-dd",
    firstDay: 1,
    changeMonth: true,
    changeYear: true,
  });
  $(".timepicker").timepicker({ timeFormat: "H:i" });
});

function updateeventHandler(event) {
  event.preventDefault();
  const id = document.querySelector("#propertyId").getAttribute("data-id");

  const event_id = document.querySelector("#type-event").value;
  const start_date = document.querySelector("#startdate-event").value;
  const start_time = document.querySelector("#starttime-event").value;

  const end_date = document.querySelector("#enddate-event").value;
  const end_time = document.querySelector("#endtime-event").value;

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
      .then((response) => {
        response.json();
        console.log("UPDATED EVENT", response);
       // showMessage("Event updated");
      })
      .then((response) => showMessage("Event updated"));
  }
}

document
  .querySelector(".event-form")
  .addEventListener("submit", updateeventHandler);


