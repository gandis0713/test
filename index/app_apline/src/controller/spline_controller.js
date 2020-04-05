
function SplineController(spline) {
  
  // view
  this.splineScreen = null;
  this.splinePanel = null;

  // model
  this.splines = null;

  // init
  this.setScreen = function(screen) {
    this.splineScreen = screen;
    this.splineScreen.setMouseMoveEventListener(this.mouseMoveEventListener.bind(this));
    this.splineScreen.setMouseDownEventListener(this.mouseDownEventListener.bind(this));
    this.splineScreen.setMouseUpEventListener(this.mouseUpEventListener.bind(this));
  }

  this.setPanel = function(panel) {
    this.splinePanel = panel;
    this.splinePanel.setCloseCheckBoxEventListener(this.closeCheckBoxEventListener.bind(this));
    this.splinePanel.setTensionSliderEventListener(this.tensionSliderEventListener.bind(this));
    this.splinePanel.setBiasSliderEventListener(this.biasSliderEventListener.bind(this));
    this.splinePanel.setContinuitySliderEventListener(this.continuitySliderEventListener.bind(this));
    this.splinePanel.setResolutionSliderEventListener(this.resolutionSliderEventListener.bind(this));
    
    this.splinePanel.setNaturalCheckBoxEventListener(this.naturalCheckBoxEventListener.bind(this));    
    this.splinePanel.setKochanekCheckBoxEventListener(this.kochanekCheckBoxEventListener.bind(this));
  }

  this.setSplines = function(splines) {
    this.splines = splines;
  }

  this.drawSpline = function() {    

    if(!this.splines || !this.splineScreen || !this.splinePanel) {
      return;
    }
    
    this.splines.build();
    this.splineScreen.draw(spline);
  }

  // event
    // Spec
  this.closeCheckBoxEventListener = function(checked) { 
    spline.spec.close = checked;
    
    this.splines.build();
    this.splineScreen.draw(spline);  
  }

  this.tensionSliderEventListener = function(value) {
    spline.spec.tension[spline.state.selectedPointIndex] = value;
    
    this.splines.build();
    this.splineScreen.draw(spline);
  }

  this.biasSliderEventListener = function(value) { 
    spline.spec.bias[spline.state.selectedPointIndex] = value;
    
    this.splines.build();
    this.splineScreen.draw(spline);
  }

  this.continuitySliderEventListener = function(value) {
    spline.spec.continuity[spline.state.selectedPointIndex] = value;
    
    this.splines.build();
    this.splineScreen.draw(spline);
  }

  this.resolutionSliderEventListener = function(value) {
    spline.spec.resolution = value;
    
    this.splines.build();
    this.splineScreen.draw(spline);
  }

    // Type
  this.naturalCheckBoxEventListener = function(checked) { 
    spline.state.show[0] = checked;
    
    this.splines.build();
    this.splineScreen.draw(spline);  
  }

  this.kochanekCheckBoxEventListener = function(checked) { 
    spline.state.show[1] = checked;
    
    this.splines.build();
    this.splineScreen.draw(spline);  
  }

  this.mouseMoveEventListener = function(pos) {
    if(spline.state.isDragging) {
      spline.input.data[0][spline.state.selectedPointIndex] = pos[0];
      spline.input.data[1][spline.state.selectedPointIndex] = pos[1];

      this.splines.build();
      
      this.splineScreen.draw(spline);
    }
  }

  this.mouseDownEventListener = function(pos) {
    const index = this.IsCollision(spline.input.data, pos);
    if(index >= 0) {
      spline.state.selectedPointIndex = index;
      spline.state.isDragging = true;
    }
  }

  this.mouseUpEventListener = function(pos) {
    spline.state.isDragging = false;
  }

  // logic
  this.IsCollision = function(points, pos) {
    for(let i = 0; i < points[0].length; i++) {
      const dist = Math.sqrt(Math.pow(points[0][i] - pos[0], 2) + Math.pow(points[1][i] - pos[1], 2));
      if(dist < ((spline.visual.pointSize + (spline.visual.pointStroke / 2)) * 1.3)) 
        return i;
    }
    return -1;
  }
}