
function SplineController(app) {
  
  // member
  this.splineScreen = null;
  this.splinePanel = null;
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
  }

  this.setSplines = function(splines) {
    this.splines = splines;
  }

  this.drawSpline = function() {    

    if(!this.splines || !this.splineScreen || !this.splinePanel) {
      return;
    }
    
    this.splines.build();
    this.splineScreen.draw(app.spline.input.data, app.spline.output, app.spline.visual);
  }

  // event
  this.closeCheckBoxEventListener = function(checked) { 
    app.spline.spec.close = checked;
    
    this.splines.build();
    this.splineScreen.draw(app.spline.input.data, app.spline.output, app.spline.visual);  
  }

  this.tensionSliderEventListener = function(value) {
    app.spline.spec.tension[app.spline.state.selectedPointIndex] = value;
    
    this.splines.build();
    this.splineScreen.draw(app.spline.input.data, app.spline.output, app.spline.visual);
  }

  this.biasSliderEventListener = function(value) { 
    app.spline.spec.bias[app.spline.state.selectedPointIndex] = value;
    
    this.splines.build();
    this.splineScreen.draw(app.spline.input.data, app.spline.output, app.spline.visual);
  }

  this.continuitySliderEventListener = function(value) {
    app.spline.spec.continuity[app.spline.state.selectedPointIndex] = value;
    
    this.splines.build();
    this.splineScreen.draw(app.spline.input.data, app.spline.output, app.spline.visual);
  }

  this.resolutionSliderEventListener = function(value) {
    app.spline.spec.resolution = value;
    
    this.splines.build();
    this.splineScreen.draw(app.spline.input.data, app.spline.output, app.spline.visual);
  }

  this.mouseMoveEventListener = function(pos) {
    if(app.spline.state.isDragging) {
      app.spline.input.data[0][app.spline.state.selectedPointIndex] = pos[0];
      app.spline.input.data[1][app.spline.state.selectedPointIndex] = pos[1];

      this.splines.build();
      
      this.splineScreen.draw(app.spline.input.data, app.spline.output, app.spline.visual);
    }
  }

  this.mouseDownEventListener = function(pos) {
    const index = this.IsCollision(app.spline.input.data, pos);
    if(index >= 0) {
      app.spline.state.selectedPointIndex = index;
      app.spline.state.isDragging = true;
    }
  }

  this.mouseUpEventListener = function(pos) {
    app.spline.state.isDragging = false;
  }

  // logic
  this.IsCollision = function(points, pos) {
    for(let i = 0; i < points[0].length; i++) {
      const dist = Math.sqrt(Math.pow(points[0][i] - pos[0], 2) + Math.pow(points[1][i] - pos[1], 2));
      if(dist < ((app.spline.visual.pointSize + (app.spline.visual.pointStroke / 2)) * 1.3)) 
        return i;
    }
    return -1;
  }
}