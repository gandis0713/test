function SplineScreen() {

  this.canvas = null;
  this.ctx = null;

  this.width = 600;
  this.height = 600;

  this.mouseMoveEventListener = null;
  this.mouseDownEventListener = null;
  this.mouseUpEventListener = null;

  this.GetMousePos = function(event) {
    var rect = event.target.getBoundingClientRect();
    var pos =
    [
      event.clientX - rect.left,
      event.clientY - rect.top
    ];
    return pos;
  }

  this.onMouseMove = function(event) {
    if(this.mouseMoveEventListener === null) {
      return;
    }
    const pos = this.GetMousePos(event);
    this.mouseMoveEventListener(pos)
  }

  this.onMouseDown = function(event) {
    if(this.mouseDownEventListener === null) {
      return;
    }
    const pos = this.GetMousePos(event);
    this.mouseDownEventListener(pos)
  }

  this.onMouseUp = function(event) {
    if(this.mouseUpEventListener === null) {
      return;
    }
    const pos = this.GetMousePos(event);
    this.mouseUpEventListener(pos)
  }

  this.setMouseMoveEventListener = function(eventListener) {
    this.mouseMoveEventListener = eventListener;
  }
  this.setMouseDownEventListener = function(eventListener) {
    this.mouseDownEventListener = eventListener;
  }
  this.setMouseUpEventListener = function(eventListener) {
    this.mouseUpEventListener = eventListener;
  }

  this.draw = function(spline) {  
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, 600, 600);
    
    for(let i = 0; i < spline.output.data[0].length; i++) {
      
      if(spline.visual.show[i] === false)
      {
        continue;
      }

      for(let j = 0; j < spline.output.data[0][0].length; j++) {
        
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        for(let k = 0; k < spline.output.data[0][0][j].length; k++) {
          const x = spline.output.data[i][0][j][k];
          const y = spline.output.data[i][1][j][k];
          this.ctx.lineTo(x, y);
        }        

        if(spline.state.selectedLineIndex === j) {
          this.ctx.strokeStyle = spline.visual.color[i][2];
        }
        else {
          this.ctx.strokeStyle = spline.visual.color[i][0];
        }

        this.ctx.stroke();
      }



    }

    for(let i = 0; i < spline.input.data[0].length; i++) {
      this.ctx.beginPath();
      this.ctx.arc(spline.input.data[0][i], spline.input.data[1][i], spline.visual.pointSize, 0, 2 * Math.PI);

      this.ctx.fillStyle = spline.state.selectedPointIndex === i ? '#ffffff' : '#00ff00';
      this.ctx.fill();
      this.ctx.lineWidth = spline.visual.pointStroke;
      this.ctx.strokeStyle = '#888888';
      this.ctx.stroke();
    }
  }

  this.create = function() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    if (this.canvas.getContext){
      this.ctx = this.canvas.getContext('2d');
      
      this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
      this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
      this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    }

    document.body.appendChild(this.canvas);
  }

  this.create();

}