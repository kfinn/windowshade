jQuery(function($) {
  // set default starting position
  var position = {coords:{
    latitude: 40.7121681,
    longitude: -73.96068679999999
  }};
  
  navigator.geolocation.getCurrentPosition(updatePosition);
  updateTime();
  window.setInterval(updateTime, 500);
    
  function updatePosition(newPosition) {
    position = newPosition;
    console.log(position);
    updateTime();
  }
  
  function noaaHere(d) {
    return noaa.calculate(d, position.coords.latitude, position.coords.longitude);
  }
  
  function getBackground(light, elapsed) {
    return '-webkit-linear-gradient(bottom, #8c3631, #ee9e52 10%, #eee 18%, #91add0 20%, #415e97 28%, #24253e)';
  }

  function updateTime() {
    $('#time').text(moment().format('LT'));
    
    var now = moment();
    var todaySunData = noaaHere(now);
    var light = true;
    var timeSpanStart, timeSpanEnd;
    if (now.isBefore(todaySunData.sunrise)) {
      light = false;
      var yesterday = moment(now).subtract(1, 'day');
      var yesterdaySunData = noaaHere(yesterday);
      timeSpanStart = yesterdaySunData.sunset;
      timeSpanEnd = todaySunData.sunrise;
    } else if (now.isAfter(todaySunData.sunset)) {
      light = false;
      var tomorrow = moment(now).add(1, 'day');
      var tomorrowSunData = noaaHere(tomorrow);
      timeSpanStart = todaySunData.sunset;
      timeSpanEnd = tomorrowSunData.sunrise;
    } else {
      timeSpanStart = todaySunData.sunrise;
      timeSpanEnd = todaySunData.sunset;
    }
    
    var elapsed = now.diff(timeSpanStart, 'milliseconds');
    var total = timeSpanEnd.diff(timeSpanStart, 'milliseconds');
    
    var completed = elapsed/total;
    $('body').css('background-image', getBackground(light, elapsed));
  }
});