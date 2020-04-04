
function SplineController() {  

  // init
  this.setScreen = function(screen) {
    this.splineScreen = screen;
    this.splineScreen.setMouseMoveEventListener(this.mouseMoveEventListener.bind(this));
    this.splineScreen.setMouseDownEventListener(this.mouseDownEventListener.bind(this));
    this.splineScreen.setMouseUpEventListener(this.mouseUpEventListener.bind(this));
    this.splineScreen.draw();
  }

  this.setPanel = function(panel) {
    this.splinePanel = panel;
    this.splinePanel.setCloseCheckBoxEventListener(this.closeCheckBoxEventListener.bind(this));
  }

  // event
  this.closeCheckBoxEventListener = function(checked) {
    app.spline.spec.close = checked;
    this.splineScreen.draw();
  }

  this.mouseMoveEventListener = function(pos) {
    if(app.state.isDragging) {
      app.spline.data.input[0][app.state.selectedIndex] = pos[0];
      app.spline.data.input[1][app.state.selectedIndex] = pos[1];
      
      this.splineScreen.draw();
    }
  }

  this.mouseDownEventListener = function(pos) {
    const index = this.IsCollision(app.spline.data.input, pos);
    if(index >= 0) {
      app.state.selectedIndex = index;
      app.state.isDragging = true;
    }
  }

  this.mouseUpEventListener = function(pos) {
    app.state.isDragging = false;
  }

  // logic
  this.IsCollision = function(points, pos) {
    for(let i = 0; i < points[0].length; i++) {
      const dist = Math.sqrt(Math.pow(points[0][i] - pos[0], 2) + Math.pow(points[1][i] - pos[1], 2));
      if(dist < 10) 
        return i;
    }
    return -1;
  }

  
  // member
  this.splineScreen = null;
  this.splinePanel = null;
  this.splines = null;
}