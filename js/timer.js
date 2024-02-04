document.addEventListener("DOMContentLoaded", function () {
  function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    return {
      total: t,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function initializeClock(endtime) {
    var hoursSpan = document.querySelector(
      ".highlight_hourtime, .nftartistinfo_hourtime"
    );
    var minutesSpan = document.querySelector(
      ".highlight_mintime, .nftartistinfo_mintime"
    );
    var secondsSpan = document.querySelector(
      ".highlight_sectime, .nftartistinfo_sectime"
    );

    function updateClock() {
      var t = getTimeRemaining(endtime);

      hoursSpan.innerHTML = ("0" + t.hours).slice(-2);
      minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
      secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);

      if (t.total <= 0) {
        clearInterval(timeinterval);
      }
    }

    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
  }

  var initialDate = new Date(
    Date.parse(new Date()) + 13 * 60 * 60 * 1000 + 24 * 60 * 1000 + 52 * 1000
  );
  initializeClock(initialDate);
});
