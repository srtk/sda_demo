var data = null;
$(window).load(function() {
  $.getJSON('http://localhost:8080/data/d2.json', function(json) {
    console.log(json);
     data = json;
  });

});
