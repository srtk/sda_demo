
var data = null
var finish_loading = false
var data_index = 0

var classes_txt = [
  'comp.graphics', 
  'comp.os.ms-windows.misc',
  'comp.sys.ibm.pc.hardware',
]

$(window).load(function() {
  load_json("data/dummy.json");
  start_fun();
});


var load_json = function(filename) {
  $.getJSON(filename, function(json) {
    console.log(json);
     data = json;
     finish_loading = true
  });
}

var next_data = function() {
  next = null;
  if (data_index < data.error_rate.length) {
    next = {}; 
    next.error_rate = data['error_rate'][data_index]
    next.predict = data['predict'][data_index]
    next.answer = data['answer'][data_index]
    next.rgb = data['rgb'][data_index]
    data_index += 1;
  }
  return next
}

var start_fun = function() {
  if (finish_loading) {
    console.log('finish loading json!');
    change_document(data['document'])
    setInterval(step, 1000);  
  } else {
    setTimeout(start_fun, 1000)
  }
}

// loads a training image and trains on it with the network
var paused = false;
var step = function() {
  if (paused) {
    return;
  }
  next = next_data()
  if (next) {
    process_data(next);
    // log progress to graph, (full loss)
  } else {
    paused = true;
    return;
  }
}

var lossGraph = new cnnvis.Graph({step_horizon:20});
var step_num = 0;
var process_data = function(d) {
  console.log('step '+step_num);
  console.log(d);
  lossGraph.add(step_num, d.error_rate);
  lossGraph.drawSelf($("#lossgraph")[0]);

  $("#prediction").text(classes_txt[d.predict]);
  $("#answer").text(classes_txt[d.answer]);
  
  scale = 255  // convert interval [0.0, 1.0] to [0, 255]
  r = d.rgb[0] * scale;
  g = d.rgb[1] * scale;
  b = d.rgb[2] * scale;
  $("#documents").css("background-color", "rgb("+r.toString()+","+g.toString()+","+b.toString()+")");
  
  step_num++;
}


var colors = null;
var change_document = function(doc) {
  $('#documents').text(doc);
}

