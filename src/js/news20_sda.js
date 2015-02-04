

var classes_txt = [
  "comp.graphics",
  "comp.os.ms-windows.misc",
  "comp.sys.ibm.pc.hardware",
  "comp.sys.mac.hardware",
  "comp.windows.x",
  "rec.autos",
  "rec.motorcycles",
  "rec.sport.baseball",
  "rec.sport.hockey",
  "sci.crypt",
  "sci.electronics",
  "sci.med",
  "sci.space",
  "misc.forsale",
  "talk.politics.misc",
  "talk.politics.guns",
  "talk.politics.mideast	",
  "talk.religion.misc",
  "alt.atheism",
  "soc.religion.christian"
]

$(window).load(function() {
  load_json("data/dummy_small.json");
  start_fun();
});


var data = null
var finish_loading = false
var load_json = function(filename) {
  $.getJSON(filename, function(json) {
    console.log(json);
     data = json;
     finish_loading = true
  });
}

var start_fun = function() {
  if (finish_loading) {
    console.log('finish loading json!');
    setInterval(step, 100);  
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
  next_epoch = next_epoch_data()
  if (next_epoch) {
    process_data(next_epoch)
  } else {
    next_doc = next_document()
    if (next_doc) {
      change_document(next_doc)
    } else {
      paused = true;
      return;
    }
  }
}

var doc_index = 0
var next_document = function() {
  next = null;
  if (doc_index < data.error_rate.length) {
    next = {};
    next.document = data['document'][doc_index]
    next.error_rate = data['error_rate'][doc_index]
    next.predict = data['predict'][doc_index]
    next.answer = data['answer'][doc_index]
    next.rgb = data['rgb'][doc_index]
    doc_index += 1;
  }
  return next
}

var split_doc = null;
var predict_doc = null;
var rgb_doc = null;
var lossGraph = new cnnvis.Graph({step_horizon:20});
var step_num = 0;
var change_document = function(doc) {
  $('#documents').text(doc.document);
  split_doc = doc.document.replace(/\W+/g, ' ').split(' ');
  
  lossGraph.add(step_num, doc.error_rate);
  lossGraph.drawSelf($("#lossgraph")[0]);
  
  $("#answer").text(classes_txt[doc.answer]);
  
  predict_doc = doc.predict;
  rgb_doc = doc.rgb;
}

var epoch_num = 0;
var next_epoch_data = function() {
  if (!predict_doc || !rgb_doc) {
    return null;
  }
  data = {};
  data.predict = predict_doc[epoch_num];
  data.rgb = rgb_doc[epoch_num];
  epoch_num++;
  return data;
}

var colors = null;
var process_data = function(data) {
  $("#prediction").text(classes_txt[data.predict]);
  
  scale = 255  // convert interval [0.0, 1.0] to [0, 255]
  len = split_doc.length;
  for (var i = 0; i < len; i++) {
    r = Math.ceil(data.rgb[0] * scale);
    g = Math.ceil(data.rgb[1] * scale);
    b = Math.ceil(data.rgb[2] * scale);
    $("#documents").css("background-color", "rgb("+r.toString()+","+g.toString()+","+b.toString()+")");
  }
  step_num++;
}


