function SplinePanel(parentElementName) {

  this.create = function() {
    this.parent = document.getElementById(parentElementName);

    this.body = document.createElement('div');
    this.body.style.position = "absolute";
    this.body.style.left = 600 + 'px';
    this.body.style.top = 0 + 'px';
    this.body.style.width = 300 + 'px';
    this.body.style.height = 600 + 'px';
    this.body.style.border = "1px solid black" 
    this.body.style.marginLeft = 20 + 'px';
    this.body.style.marginTop = 10 + 'px';

    this.parent.appendChild(this.body);
    
    this.createSplineModePanel();
  }

  this.createSplineModePanel = function() {

    const div_spline_mode = document.createElement('div');
    div_spline_mode.style.position = "absolute";
    div_spline_mode.style.left = '0%';
    div_spline_mode.style.top = '0%';
    div_spline_mode.style.width = "100%";
    div_spline_mode.style.height = '10%';
    div_spline_mode.style.border = "1px solid black"

    const lb_spline_type = document.createElement('label');
    lb_spline_type.style.position = "absolute";
    lb_spline_type.style.left = '0%';
    lb_spline_type.style.top = '0%';
    lb_spline_type.style.width = "100%";
    lb_spline_type.style.height = '50%';
    lb_spline_type.style.fontWeight = 'bolder';
    lb_spline_type.innerText = "Spline Mode";
    
    const div_spline_close = document.createElement('div');
    div_spline_close.style.position = "absolute";
    div_spline_close.style.left = '0%';
    div_spline_close.style.top = '50%';
    div_spline_close.style.width = "100%";
    div_spline_close.style.height = '50%';

    this.closeCheckBox = document.createElement('input');
    this.closeCheckBox.type = 'checkbox';
    this.closeCheckBox.checked = false;

    const lb_close = document.createElement('label');
    lb_close.style.position = "absolute";
    lb_close.style.left = '0%';
    lb_close.style.top = '50%';
    lb_close.style.width = "100%";
    lb_close.style.height = '50%';
    lb_close.appendChild(this.closeCheckBox);
    lb_close.innerHTML += "close";
    lb_close.addEventListener('change', this.closeCheckBoxChangeEventListener.bind(this), false);

    div_spline_mode.appendChild(lb_spline_type);
    div_spline_mode.appendChild(lb_close);

    this.body.appendChild(div_spline_mode);
  }

  this.createSplineTypePanel = function() {

  }  

  this.closeCheckBoxChangeEventListener = function(event) {
    this.closeCheckBoxEventListener(event.target.checked);
  }

  this.setCloseCheckBoxEventListener = function(eventListener) {
    this.closeCheckBoxEventListener = eventListener;
  }  
  
  this.parent = null;
  this.body = null;

  this.closeCheckBoxEventListener = null;
  this.closeCheckBox = null;

  this.create();
}