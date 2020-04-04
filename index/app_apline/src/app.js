const splineType = [[0, '#ff0000', 'kochanek'], [1, '#0000ff', 'natural']];

function App() {

  var app = {
    spline: {
      input: {    
        data: [[100, 200, 200, 100], [100, 100, 200, 200]]     
      },
      output: {
      },
      spec: {
        close: true,
        resolution: 32,
        intervals: [0, 0.25, 0.5, 0.75, 1],
      
        tension: [0, 0, 0, 0],
        bias: [0, 0, 0, 0],
        continuity: [0, 0, 0, 0]
      },
      state: {
        isDragging: false,
        selectedPointIndex: 1,
        selectedLineIndex: 1
      },
      visual: {
        pointSize: 7,
        pointStroke: 2
      }
    }
  }

  this.start = function() {
    
    const splineController = new SplineController(app);
    
    // create model
    const splines = new Splines(app.spline);
    splines.create(0, new NaturalCubicSpline2D());
    splines.create(1, new KochanekSpline2D());
    
    splineController.setSplines(splines);

    // create view
    const splineScreen = new SplineScreen();
    splineController.setScreen(splineScreen);

    const splinePanel = new SplinePanel();
    splinePanel.setClose(app.spline.spec.close);
    splinePanel.setTension(app.spline.spec.tension[app.spline.state.selectedPointIndex]);
    splinePanel.setBias(app.spline.spec.bias[app.spline.state.selectedPointIndex]);
    splinePanel.setContinuity(app.spline.spec.continuity[app.spline.state.selectedPointIndex]);
    splinePanel.setResolution(app.spline.spec.resolution);

    splineController.setPanel(splinePanel);

    // draw spline
    splineController.drawSpline();
    
  }

}