document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
      init();
  } else if (state == 'complete') {
  	React.render(init(), document.getElementById('output'));
  }
}