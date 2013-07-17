jQuery(function($) {
  function updateTime() {
    $('#time').text(new Date().toString(Date.CultureInfo.formatPatterns.shortTime));    
  }

  updateTime();
  window.setInterval(updateTime, 500);
});