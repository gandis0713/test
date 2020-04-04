function SplineScreen(parentElementName, splines) {

  this.canvas = null;
  this.ctx = null;

  this.width = 600;
  this.height = 600;

  this.pointFillSize = 7;
  this.pointStrokeSize = 2;

  this.GetMousePos = function(event) {
    var rect = event.target.getBoundingClientRect();
    var pos =
    [
      event.clientX - rect.left,
      event.clientY - rect.top
    ];
    return pos;
  }

  this.IsCollision = function(points, pos) {
    for(let i = 0; i < points[0].length; i++) {
      const dist = Math.sqrt(Math.pow(points[0][i] - pos[0], 2) + Math.pow(points[1][i] - pos[1], 2));
      if(dist < ((this.pointFillSize + (this.pointStrokeSize / 2)) * 1.3)) 
        return i;
    }
    return -1;
  }

  this.onMouseMove = function(event) {
    if(app.state.isDragging) {
      const pos = this.GetMousePos(event);
      app.spline.data.input[0][app.state.selectedIndex] = pos[0];
      app.spline.data.input[1][app.state.selectedIndex] = pos[1];
      
      this.draw();
    }
  }

  this.onMouseDown = function(event) {
    const index = this.IsCollision(app.spline.data.input, this.GetMousePos(event));
    if(index >= 0) {
      app.state.selectedIndex = index;
      app.state.isDragging = true;    
    }
  }

  this.onMouseUp = function(event) {
    app.state.isDragging = false;
  }

  this.draw = function() {

    const numberOfSpline = 2;
    const dimensionOfSpline = 2;
    app.spline.output = new Array();


    for(let i = 0; i < numberOfSpline; i++) {
      app.spline.output[i] = new Array();
      for(let j = 0; j < dimensionOfSpline; j++) {
        app.spline.output[i][j] = new Array();
      }
    }
    
    splines = new Splines();
    splines.setSpline(0, new NaturalCubicSpline2D(app.spline.data.input, app.spline.output[0], app.spline.spec));
    splines.setSpline(1, new KochanekSpline2D(app.spline.data.input, app.spline.output[1], app.spline.spec));

    this.ctx.fillStyle   = "#000000";
    this.ctx.fillRect(0, 0, 960, 720);
    
    for(let i = 0; i < numberOfSpline; i++) {
      
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      for(let j = 0; j < app.spline.output[0][0].length; j++) {
        
        const x = app.spline.output[i][0][j];
        const y = app.spline.output[i][1][j];

        this.ctx.lineTo(x, y);
      }
      this.ctx.strokeStyle = splineType[i][1];
      this.ctx.stroke();
    }

    for(let i = 0; i < app.spline.data.input[0].length; i++) {
      this.ctx.beginPath();
      this.ctx.arc(app.spline.data.input[0][i], app.spline.data.input[1][i], this.pointFillSize, 0, 2 * Math.PI);
      
      this.ctx.fillStyle = '#FF8888';
      this.ctx.fill();
      this.ctx.lineWidth = this.pointStrokeSize;
      this.ctx.strokeStyle = '#888888';
      this.ctx.stroke();
    }
  }

  this.create = function() {
    const body = document.getElementById(parentElementName);
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    if (this.canvas.getContext){
      this.ctx = this.canvas.getContext('2d');
      
      this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
      this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
      this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    }

    body.appendChild(this.canvas);
  }

  this.create();

}