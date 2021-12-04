function registereventHandler(event) {
  event.preventDefault();
  const event_id = document.querySelector("#type-event").value;
  const start_date = document.querySelector("#startdate-event").value;
  const start_time = document.querySelector("#starttime-event").value;
  const end_date = document.querySelector("#enddate-event").value;
  const end_time = document.querySelector("#endtime-event").value;

  if (event_id && start_date && end_date && start_time && end_time) {
    fetch("/api/events/", {
      method: "post",
      body: JSON.stringify({
        event_id,
        start_date,
        end_date,
        start_time,
        end_time,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((response) => showMessage("Event registered"));
  }
}

document
  .querySelector(".event-form")
  .addEventListener("submit", registereventHandler);

$(".datepicker").datepicker({
  dateFormat: "yy-mm-dd",
  firstDay: 1,
  changeMonth: true,
  changeYear: true,
});
$(".timepicker").timepicker({ timeFormat: "H:i" });

document
  .querySelector('input[type="file"]')
  .addEventListener("change", function () {
    if (this.files && this.files[0]) {
      var img = document.querySelector("#myImg");
      img.onload = () => {
        URL.revokeObjectURL(img.src); // no longer needed, free memory
      };
      img.src = URL.createObjectURL(this.files[0]); // set src to blob url
    }
  });
