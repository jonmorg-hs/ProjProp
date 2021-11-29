$('.datepicker').datepicker({dateFormat: 'd/m/yy',firstDay: 1,changeMonth: true,changeYear: true});
$('.timepicker').timepicker({timeFormat:'H:i'});

async function registereventHandler(event) {
  event.preventDefault();

  const type = document.querySelector("#type-event").value;
  const start_date = document.querySelector("#startdate-event").value;
  const end_date = document.querySelector("#enddate-event").value;
  const start_time = document.querySelector("#starttime-event").value;
  const end_time = document.querySelector("#endtime-event").value;

  if (type && start_date && end_date && start_time && end_time) {
    const response = fetch("/api/events", {
      method: "post",
      body: JSON.stringify({
        type,
        start_date,
        end_date,
        start_time,
        end_time
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert('Event registered');
    } else {
      alert(response.statusText);
    }
  }
}

document
  .querySelector(".event-form")
  .addEventListener("submit", registereventHandler);
