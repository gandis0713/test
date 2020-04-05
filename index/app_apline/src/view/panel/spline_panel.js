function SplinePanel() {

  this.parent = null;
  this.body = null;

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

  this.lb_natural_name = null;
  this.lb_kochanek_name = null;

  this.tableSpec = null;
  this.tableType = null;
  
  this.tbSpecBody = null;  
  this.tbTypeBody = null;

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

  this.setNatural = function(color, checked) {
    this.lb_natural_name.style.color = color;
    this.cb_type_natural.checked = checked;
  }

  this.setKochanek = function(color, checked) {
    this.lb_kochanek_name.style.color = color;
    this.cb_type_kochanek.checked = checked;
  }

  // UI
  this.create = function() {
    this.parent = document.body;

    this.body = document.createElement('div');
    this.body.style.position = "absolute";
    this.body.style.left = 600 + 'px';
    this.body.style.top = 0 + 'px';
    this.body.style.width = 400 + 'px';
    this.body.style.height = 600 + 'px';
    this.body.style.border = "1px solid black" 
    this.body.style.marginLeft = 15 + 'px';
    this.body.style.marginTop = 10 + 'px';


    this.createSpecification();
    this.body.appendChild(this.tableSpec);

    this.createType();
    this.body.appendChild(this.tableType);
    
    this.parent.appendChild(this.body);
  }



  // Spec
  
  this.createSpecification = function(){
    
    this.tableSpec = document.createElement('table');
    this.tableSpec.style.width = "100%";
    this.tableSpec.style.borderCollapse  = "collapse";

    const thead = document.createElement('thead');
    const th = document.createElement('th');
    th.innerText = "Specifications";
    
    this.tbSpecBody = document.createElement('tbody');
    this.tbSpecBody.align = 'center';

    thead.appendChild(th);
    this.tableSpec.appendChild(thead);
    this.tableSpec.appendChild(this.tbSpecBody);
    
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

    const row = this.tbSpecBody.insertRow(this.tbSpecBody.rows.length);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1); 
    const cell3 = row.insertCell(2);   
    cell1.appendChild(lb_close_name);
    cell1.style.border = "1px solid black";
    cell1.style.width = "25%";
    cell2.appendChild(this.cb_spec_close);
    cell2.style.border = "1px solid black";
    cell2.style.width = "50%";
    cell3.appendChild(this.lb_close_value);
    cell3.style.border = "1px solid black";
    cell3.style.width = "25%";

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
    
    const row = this.tbSpecBody.insertRow(this.tbSpecBody.rows.length);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1); 
    const cell3 = row.insertCell(2); 

    cell1.appendChild(lb_tension_name);
    cell1.style.border = "1px solid black";
    cell1.style.width = "25%";
    cell2.appendChild(this.sl_tension);
    cell2.style.border = "1px solid black";
    cell2.style.width = "50%";
    cell3.appendChild(this.lb_tension_value);
    cell3.style.border = "1px solid black";
    cell3.style.width = "25%";
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
    
    const row = this.tbSpecBody.insertRow(this.tbSpecBody.rows.length);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1); 
    const cell3 = row.insertCell(2); 

    cell1.appendChild(lb_bias_name);
    cell1.style.border = "1px solid black";
    cell1.style.width = "25%";
    cell2.appendChild(this.sl_bias);
    cell2.style.border = "1px solid black";
    cell2.style.width = "50%";
    cell3.appendChild(this.lb_bias_value);
    cell3.style.border = "1px solid black";
    cell3.style.width = "25%";
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
    
    const row = this.tbSpecBody.insertRow(this.tbSpecBody.rows.length);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1); 
    const cell3 = row.insertCell(2); 

    cell1.appendChild(lb_continuity_name);
    cell1.style.border = "1px solid black";
    cell1.style.width = "25%";
    cell2.appendChild(this.sl_continuity);
    cell2.style.border = "1px solid black";
    cell2.style.width = "50%";
    cell3.appendChild(this.lb_continuity_value);
    cell3.style.border = "1px solid black";
    cell3.style.width = "25%";
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
    
    const row = this.tbSpecBody.insertRow(this.tbSpecBody.rows.length);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1); 
    const cell3 = row.insertCell(2); 

    cell1.appendChild(lb_resolution_name);
    cell1.style.border = "1px solid black";
    cell1.style.width = "25%";
    cell2.appendChild(this.sl_resolution);
    cell2.style.border = "1px solid black";
    cell2.style.width = "50%";
    cell3.appendChild(this.lb_resolution_value);
    cell3.style.border = "1px solid black";
    cell3.style.width = "25%";
  }




  // Type

  this.createType = function() {
    
    this.tableType = document.createElement('table');
    this.tableType.style.width = "100%";
    this.tableType.style.borderCollapse  = "collapse";

    const theadType = document.createElement('thead');
    const thType = document.createElement('th');
    thType.align = 'left'
    thType.innerText = "Type";
    theadType.appendChild(thType);
    
    const theadName = document.createElement('thead');
    const thName = document.createElement('th');
    thName.style.border = "1px solid black" 
    thName.innerText = "Name";
    const thShow = document.createElement('th');
    thShow.style.border = "1px solid black" 
    thShow.innerText = "Show";
    theadName.appendChild(thName);
    theadName.appendChild(thShow);
    
    this.tbTypeBody = document.createElement('tbody');
    this.tbTypeBody.align = 'center';

    this.tableType.appendChild(theadType);
    this.tableType.appendChild(theadName);
    this.tableType.appendChild(this.tbTypeBody);

    this.createTypeNatural();
    this.createTypeKochanek();
  }
  
  this.createTypeNatural = function() {

    this.lb_natural_name = document.createElement('label');
    this.lb_natural_name.innerText = 'Natural';

    this.cb_type_natural = document.createElement('input');
    this.cb_type_natural.type = 'checkbox';
    this.cb_type_natural.checked = false;
    this.cb_type_natural.addEventListener('change', this.naturalCheckBoxChangeEventListener.bind(this), false);

    const row = this.tbTypeBody.insertRow(this.tbTypeBody.rows.length);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1); 
    cell1.appendChild(this.lb_natural_name);
    cell1.style.border = "1px solid black";
    cell1.style.width = "40%";
    cell2.appendChild(this.cb_type_natural);
    cell2.style.border = "1px solid black";
    cell2.style.width = "60%";

  }

  this.createTypeKochanek = function() {

    this.lb_kochanek_name = document.createElement('label');
    this.lb_kochanek_name.innerText = 'kochanek';

    this.cb_type_kochanek = document.createElement('input');
    this.cb_type_kochanek.type = 'checkbox';
    this.cb_type_kochanek.checked = false;
    this.cb_type_kochanek.addEventListener('change', this.kochanekCheckBoxChangeEventListener.bind(this), false);

    const row = this.tbTypeBody.insertRow(this.tbTypeBody.rows.length);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1); 
    cell1.appendChild(this.lb_kochanek_name);
    cell1.style.border = "1px solid black";
    cell1.style.width = "40%";
    cell2.appendChild(this.cb_type_kochanek);
    cell2.style.border = "1px solid black";
    cell2.style.width = "60%";

  }



  // event
    // Spec
  this.closeCheckBoxChangeEventListener = function(event) {
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


    // Type
  this.naturalCheckBoxChangeEventListener = function(event) {
    this.lb_close_value.innerText = event.target.checked;
    this.naturalCheckBoxEventListener(event.target.checked);
  }

  this.setNaturalCheckBoxEventListener = function(eventListener) {
    this.naturalCheckBoxEventListener = eventListener;
  }

  this.kochanekCheckBoxChangeEventListener = function(event) {
    this.lb_close_value.innerText = event.target.checked;
    this.kochanekCheckBoxEventListener(event.target.checked);
  }

  this.setKochanekCheckBoxEventListener = function(eventListener) {
    this.kochanekCheckBoxEventListener = eventListener;
  }  

  

  this.create();
}