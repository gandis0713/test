function SplinePanel() {

  this.parent = null;
  this.body = null;
  this.tbody = null;

  this.closeCheckBoxEventListener = null;
  this.tensionSliderEventListener = null;
  this.biasSliderEventListener = null;
  this.continuitySliderEventListener = null;

  this.cb_spec_close = null;
  this.sl_tension = null;
  this.sl_bias = null;
  this.sl_continuity = null;
  this.sl_resolution = null;

  this.lb_close_value = null;
  this.lb_tension_value = null;
  this.lb_bias_value = null;
  this.lb_continuity_value = null;
  this.lb_resolution_value = null;

  // set function
  this.setClose = function(checked) {
    this.lb_close_value.innerText = checked;
    this.cb_spec_close.checked = checked;
  }

  this.setTension = function(value) {
    this.lb_tension_value.innerText = value;
    this.sl_tension.value = value;
  }

  this.setBias = function(value) {
    this.lb_bias_value.innerText = value;
    this.sl_bias.value = value;
  }

  this.setContinuity = function(value) {
    this.lb_continuity_value.innerText = value;
    this.sl_continuity.value = value;
  }

  this.setResolution = function(value) {
    this.lb_resolution_value.innerText = value;
    this.sl_resolution.value = value;
  }

  // UI
  this.create = function() {
    this.parent = document.body;

    this.body = document.createElement('div');
    this.body.style.position = "absolute";
    this.body.style.left = 600 + 'px';
    this.body.style.top = 0 + 'px';
    this.body.style.width = 300 + 'px';
    this.body.style.height = 600 + 'px';
    this.body.style.border = "1px solid black" 
    this.body.style.marginLeft = 20 + 'px';
    this.body.style.marginTop = 10 + 'px';

    
    const table = document.createElement('table');
    table.style.width = "100%";
    table.style.borderCollapse  = "collapse";
    const thead = document.createElement('thead');
    const th = document.createElement('th');
    th.innerText = "Specifications";
    
    this.tbody = document.createElement('tbody');

    thead.appendChild(th);
    table.appendChild(thead);
    table.appendChild(this.tbody);

    this.body.appendChild(table);
    this.parent.appendChild(this.body);

    this.createSpecClose();
    this.createSpecTension();
    this.createSpecBias();
    this.createSpecContinuity();
    this.createSpecResolution();
  }

  this.createSpecClose = function() {

    this.cb_spec_close = document.createElement('input');
    this.cb_spec_close.type = 'checkbox';
    this.cb_spec_close.checked = false;
    this.cb_spec_close.addEventListener('change', this.closeCheckBoxChangeEventListener.bind(this), false);

    const lb_close_name = document.createElement('label');
    lb_close_name.innerText = 'Close';
    
    this.lb_close_value = document.createElement('label');
    this.lb_close_value.innerText = false;

    const row = this.tbody.insertRow(this.tbody.rows.length);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1); 
    const cell3 = row.insertCell(2);   
    cell1.appendChild(lb_close_name);
    cell1.style.border = "1px solid black";
    cell1.style.width = "10%";
    cell2.appendChild(this.cb_spec_close);
    cell2.style.border = "1px solid black";
    cell2.style.width = "90%";
    cell3.appendChild(this.lb_close_value);
    cell3.style.border = "1px solid black";
    cell3.style.width = "10%";

  }

  this.createSpecTension = function() {
    this.sl_tension = document.createElement('input');
    this.sl_tension.type = "range";
    this.sl_tension.min = -1;
    this.sl_tension.max = 1;
    this.sl_tension.step = 0.01;
    this.sl_tension.value = 0;
    this.sl_tension.addEventListener('input', this.tensionSliderChangeEventListener.bind(this), false);

    const lb_tension_name = document.createElement('label');
    lb_tension_name.innerText = 'Tension';

    this.lb_tension_value = document.createElement('label');
    this.lb_tension_value.innerText = 0;    
    
    const row = this.tbody.insertRow(this.tbody.rows.length);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1); 
    const cell3 = row.insertCell(2); 

    cell1.appendChild(lb_tension_name);
    cell1.style.border = "1px solid black";
    cell1.style.width = "10%";
    cell2.appendChild(this.sl_tension);
    cell2.style.border = "1px solid black";
    cell2.style.width = "90%";
    cell3.appendChild(this.lb_tension_value);
    cell3.style.border = "1px solid black";
    cell3.style.width = "10%";
  }

  this.createSpecBias = function() {
    this.sl_bias = document.createElement('input');
    this.sl_bias.type = "range";
    this.sl_bias.min = -1;
    this.sl_bias.max = 1;
    this.sl_bias.step = 0.01;
    this.sl_bias.value = 0;
    this.sl_bias.addEventListener('input', this.biasSliderChangeEventListener.bind(this), false);

    const lb_bias_name = document.createElement('label');
    lb_bias_name.innerText = 'Bias';

    this.lb_bias_value = document.createElement('label');
    this.lb_bias_value.innerText = 0;    
    
    const row = this.tbody.insertRow(this.tbody.rows.length);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1); 
    const cell3 = row.insertCell(2); 

    cell1.appendChild(lb_bias_name);
    cell1.style.border = "1px solid black";
    cell1.style.width = "10%";
    cell2.appendChild(this.sl_bias);
    cell2.style.border = "1px solid black";
    cell2.style.width = "90%";
    cell3.appendChild(this.lb_bias_value);
    cell3.style.border = "1px solid black";
    cell3.style.width = "10%";
  }

  this.createSpecContinuity = function() {
    this.sl_continuity = document.createElement('input');
    this.sl_continuity.type = "range";
    this.sl_continuity.min = -1;
    this.sl_continuity.max = 1;
    this.sl_continuity.step = 0.01;
    this.sl_continuity.value = 0;
    this.sl_continuity.addEventListener('input', this.continuitySliderChangeEventListener.bind(this), false);

    const lb_continuity_name = document.createElement('label');
    lb_continuity_name.innerText = 'Continuity';

    this.lb_continuity_value = document.createElement('label');
    this.lb_continuity_value.innerText = 0;    
    
    const row = this.tbody.insertRow(this.tbody.rows.length);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1); 
    const cell3 = row.insertCell(2); 

    cell1.appendChild(lb_continuity_name);
    cell1.style.border = "1px solid black";
    cell1.style.width = "10%";
    cell2.appendChild(this.sl_continuity);
    cell2.style.border = "1px solid black";
    cell2.style.width = "90%";
    cell3.appendChild(this.lb_continuity_value);
    cell3.style.border = "1px solid black";
    cell3.style.width = "10%";
  }

  this.createSpecResolution = function() {
    this.sl_resolution = document.createElement('input');
    this.sl_resolution.type = "range";
    this.sl_resolution.min = 2;
    this.sl_resolution.max = 50;
    this.sl_resolution.step = 1;
    this.sl_resolution.value = 32;
    this.sl_resolution.addEventListener('input', this.resolutionSliderChangeEventListener.bind(this), false);

    const lb_resolution_name = document.createElement('label');
    lb_resolution_name.innerText = 'Resolution';

    this.lb_resolution_value = document.createElement('label');
    this.lb_resolution_value.innerText = 32;    
    
    const row = this.tbody.insertRow(this.tbody.rows.length);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1); 
    const cell3 = row.insertCell(2); 

    cell1.appendChild(lb_resolution_name);
    cell1.style.border = "1px solid black";
    cell1.style.width = "10%";
    cell2.appendChild(this.sl_resolution);
    cell2.style.border = "1px solid black";
    cell2.style.width = "90%";
    cell3.appendChild(this.lb_resolution_value);
    cell3.style.border = "1px solid black";
    cell3.style.width = "10%";
  }




  // event

  this.closeCheckBoxChangeEventListener = function(event) {
    console.log(event.target.checked);
    this.lb_close_value.innerText = event.target.checked;
    this.closeCheckBoxEventListener(event.target.checked);
  }

  this.setCloseCheckBoxEventListener = function(eventListener) {
    this.closeCheckBoxEventListener = eventListener;
  }  

  this.tensionSliderChangeEventListener = function(event) {
    this.lb_tension_value.innerText = event.target.value;
    this.tensionSliderEventListener(parseFloat(event.target.value));
  }

  this.setTensionSliderEventListener = function(eventListener) {
    this.tensionSliderEventListener = eventListener;
  }

  this.biasSliderChangeEventListener = function(event) {
    this.lb_bias_value.innerText = event.target.value;
    this.biasSliderEventListener(parseFloat(event.target.value));
  }

  this.setBiasSliderEventListener = function(eventListener) {
    this.biasSliderEventListener = eventListener;
  }
  
  this.continuitySliderChangeEventListener = function(event) {
    this.lb_continuity_value.innerText = event.target.value;
    this.continuitySliderEventListener(parseFloat(event.target.value));
  }

  this.setContinuitySliderEventListener = function(eventListener) {
    this.continuitySliderEventListener = eventListener;
  }

  this.resolutionSliderChangeEventListener = function(event) {
    this.lb_resolution_value.innerText = event.target.value;
    this.resolutionSliderEventListener(parseFloat(event.target.value));
  }

  this.setResolutionSliderEventListener = function(eventListener) {
    this.resolutionSliderEventListener = eventListener;
  }

  

  this.create();
}