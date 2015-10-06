document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'complete') {
  	  init();
  }
}