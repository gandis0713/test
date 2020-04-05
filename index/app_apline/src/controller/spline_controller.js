
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
    
    this.splinePanel.setClose(spline.spec.close);
    this.splinePanel.setTension(spline.spec.tension[spline.state.selectedPointIndex]);
    this.splinePanel.setBias(spline.spec.bias[spline.state.selectedPointIndex]);
    this.splinePanel.setContinuity(spline.spec.continuity[spline.state.selectedPointIndex]);
    this.splinePanel.setResolution(spline.spec.resolution);

    this.splinePanel.setNatural(spline.visual.color[0][0], spline.visual.show[0]);
    this.splinePanel.setKochanek(spline.visual.color[1][0], spline.visual.show[1]);

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
    
    this.drawSpline(); 
  }

  this.tensionSliderEventListener = function(value) {
    spline.spec.tension[spline.state.selectedPointIndex] = value;
    
    this.drawSpline();
  }

  this.biasSliderEventListener = function(value) { 
    spline.spec.bias[spline.state.selectedPointIndex] = value;
    
    this.drawSpline();
  }

  this.continuitySliderEventListener = function(value) {
    spline.spec.continuity[spline.state.selectedPointIndex] = value;
    
    this.drawSpline();
  }

  this.resolutionSliderEventListener = function(value) {
    spline.spec.resolution = value;
    
    this.drawSpline();
  }

    // Type
  this.naturalCheckBoxEventListener = function(checked) { 
    spline.visual.show[0] = checked;
    
    this.drawSpline();
  }

  this.kochanekCheckBoxEventListener = function(checked) { 
    spline.visual.show[1] = checked;
    
    this.drawSpline();
  }

  this.mouseMoveEventListener = function(pos) {
    if(spline.state.isDragging) {
      spline.input.data[0][spline.state.selectedPointIndex] = pos[0];
      spline.input.data[1][spline.state.selectedPointIndex] = pos[1];

      this.drawSpline();
    }
  }

  this.mouseDownEventListener = function(pos) {
    const indexPoint = this.IsCollisionPoints(spline.input.data, pos);
    if(indexPoint >= 0) {
      spline.state.selectedPointIndex = indexPoint;
      spline.state.selectedLineIndex = -1;
      spline.state.isDragging = true;
      
      this.splinePanel.setTension(spline.spec.tension[spline.state.selectedPointIndex]);
      this.splinePanel.setBias(spline.spec.bias[spline.state.selectedPointIndex]);
      this.splinePanel.setContinuity(spline.spec.continuity[spline.state.selectedPointIndex]);
      this.drawSpline();
      return;
    }

    const indexLine = this.IsCollisionLines(spline.output.data, pos);
    if(indexLine >= 0) {
      spline.state.selectedLineIndex = indexLine;
      spline.state.selectedPointIndex = -1;
      this.drawSpline();
      return;
    }
    
    spline.state.selectedPointIndex = -1;
    spline.state.selectedLineIndex = -1;
    
    this.drawSpline();
  }

  this.mouseUpEventListener = function(pos) {
    spline.state.isDragging = false;
    this.drawSpline();
  }

  // logic
  this.IsCollisionPoints = function(points, pos) {
    for(let i = 0; i < points[0].length; i++) {
      const dist = Math.sqrt(Math.pow(points[0][i] - pos[0], 2) + Math.pow(points[1][i] - pos[1], 2));
      if(dist < ((spline.visual.pointSize + (spline.visual.pointStroke / 2)) * 1.3)) 
        return i;
    }
    return -1;
  }

  this.IsCollisionLines = function(lines, pos) {
    for(let i = 0; i < lines.length; i++) {
      for(let j = 0; j < lines[i][0].length; j++) {
        for(let k = 0; k < lines[i][0][j].length; k++) {
          const dist = Math.sqrt(Math.pow(lines[i][0][j][k] - pos[0], 2) + Math.pow(lines[i][1][j][k] - pos[1], 2));
          if(dist < 5) {            
            return j;
          }
        }
      }
    }
    return -1;
  }
}