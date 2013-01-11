var data = {

  root: node,
  view: view,
  model: model,
  controller: controller

}


var eventMap = func.identity;


function attr (node, key, data) {

  node.setAttribute("data-" + key, data.value);

}


function inner (node, data) {

  node.innerHTML = data.value;

}

function style (node, prop, unit, data) {

  node.style[prop] = data.value + unit;

}


function bindProperty (model, key, update) {

  model.on(key, update);

  update({
    value: model[key],
    model: model
  });

}


function bindController (data) {

  forEach(data.controller, function (controller, bindings) {

    var bindings = bindings.split(":");

    var event = eventMap(bindings[0]);
    var action = bindings[1];

    data.view.on(event, action, controller);

  });

  return data;

}


function getController (data) {

  data.controller = require(data.controller);

  return data;

}



function observeModel (data) {

  forEach(data.view.querySelectorAll("data-attr"), function (node) {

    var key = node.getAttribute("data-attr");
    var update = partial(attr, node, key);

    bindProperty(model, key, update);

  });

  forEach(data.view.querySelectorAll("data-inner"), function (node) {

    var key = node.getAttribute("data-inner");
    var update = partial(inner, node)

    bindProperty(model, key, update);

  });

  forEach(data.view.querySelectorAll("data-style"), function (node) {

    var data = node.getAttribute("data-style").split(":");
    var prop = data[0];
    var unit = data[1];
    var key = data[2];
    var update = partial(style, node, prop, unit);

    bindProperty(model, key, update);

  });

  return data;

}

function getView (data) {

  var div = document.createEement("div");
  div.innerHTML = require(data.template);

  data.view = document.createDocumentFragment();
  data.view.appendChild(div.firstChild);

  return data;

}


renderView = compose([
  renderHasMany
  renderHasOne,
  bindController,
  getController,
  observeModel,
  getView
]);
