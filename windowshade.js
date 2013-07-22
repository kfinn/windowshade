var gradients = [
  {type: '-webkit-radial-gradient(bottom center, circle, ', start: '255, 215, 165', end: '41, 41, 221'},
  {type: '-webkit-radial-gradient(top center, circle, ', start: '187, 187, 255', end: '87, 134, 255'},
  {type: '-webkit-radial-gradient(top center, circle, ', start: '140, 140, 255', end: '87, 14, 255'},
  {type: '-webkit-radial-gradient(top center, circle, ', start: '93, 93, 255', end: '30, 30, 220'},  
  {type: '-webkit-radial-gradient(bottom center, circle, ', start: '165, 73, 0', end: '0, 29, 105'},
  {type: '-webkit-linear-gradient(bottom, ', start: '24, 0, 48', end: '20, 20, 20'},
  {type: '-webkit-linear-gradient(bottom, ', start: '0, 0, 52', end: '20, 20, 20'},
  {type: '-webkit-linear-gradient(bottom, ', start: '0, 12, 48', end: '20, 20, 20'}
]

jQuery(function($) {
  // set default starting position
  var position = {coords:{
    latitude: 40.7121681,
    longitude: -73.96068679999999
  }};
  var timeDiv = $('#time');
  var container = $('#container');
  var dark = false;
  
  navigator.geolocation.getCurrentPosition(updatePosition);
  updateTime();
  window.setInterval(updateTime, 500);
    
  function updatePosition(newPosition) {
    position = newPosition;
    updateTime();
  }
  
  function noaaHere(d) {
    return noaa.calculate(d, position.coords.latitude, position.coords.longitude);
  }
  
  function getBackground(elapsed) {
    var usableGradients = gradients.length / 2;
    var lowerIndex = Math.floor(elapsed * usableGradients) + (dark ? usableGradients : 0);
    var upperIndex = (lowerIndex + 1) % gradients.length;
    var weight = elapsed * usableGradients - Math.floor(elapsed * usableGradients);
    return gradients[upperIndex].type +
      'rgba(' + gradients[upperIndex].start + ', ' + weight + '), ' +
      'rgba(' + gradients[upperIndex].end + ', ' + weight + ')), ' +
      gradients[lowerIndex].type +
      'rgb(' + gradients[lowerIndex].start + '), rgb(' + gradients[lowerIndex].end + '))';
  }

  function updateTime() {  
    var now = window.now; //|| moment();
    var todaySunData = noaaHere(now);
    var timeSpanStart, timeSpanEnd;
    if (now.isBefore(todaySunData.sunrise)) {
      var yesterday = moment(now).subtract(1, 'day');
      var yesterdaySunData = noaaHere(yesterday);
      timeSpanStart = yesterdaySunData.sunset;
      timeSpanEnd = todaySunData.sunrise;
      setDark(true);
    } else if (now.isBefore(todaySunData.sunset)) {
      timeSpanStart = todaySunData.sunrise;
      timeSpanEnd = todaySunData.sunset;
      setDark(false);
    } else {
      var tomorrow = moment(now).add(1, 'day');
      var tomorrowSunData = noaaHere(tomorrow);
      timeSpanStart = todaySunData.sunset;
      timeSpanEnd = tomorrowSunData.sunrise;
      setDark(true);
    }
  
    var elapsed = now.diff(timeSpanStart, 'milliseconds');
    var total = timeSpanEnd.diff(timeSpanStart, 'milliseconds');
  
    var completed = elapsed/total;
    container.css('background-image', getBackground(completed));
    timeDiv.text(now.format('LT'));
  }
  
  function setDark(newDark) {
    if (newDark != dark) {
      dark = newDark;
      if (dark) {
        timeDiv.addClass('dark');
      } else {
        timeDiv.removeClass('dark');
      }
    }
  }
});