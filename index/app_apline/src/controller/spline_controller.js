
function SplineController() {
  
  this.splineScreen = null;
  this.splinePanel = null;
  this.splines = null;
  

  this.checkboxcallback = function(checked) {
    app.spline.spec.close = checked;
    this.splineScreen.draw();
  }

  this.setScreen = function(screen) {
    this.splineScreen = screen;
    this.splineScreen.draw();
  }

  this.setPanel = function(panel) {
    this.splinePanel = panel;
    this.splinePanel.addCheckBoxCallback(this.checkboxcallback.bind(this));
  }

  this.IsCollision = function(points, pos) {
    for(let i = 0; i < points[0].length; i++) {
      const dist = Math.sqrt(Math.pow(points[0][i] - pos[0], 2) + Math.pow(points[1][i] - pos[1], 2));
      if(dist < ((this.pointFillSize + (this.pointStrokeSize / 2)) * 1.3)) 
        return i;
    }
    return -1;
  }
}