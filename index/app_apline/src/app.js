
const splineType = {
  natural: 0,
  kochanek: 1
}

const splineNumber = 2;


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
        selectedPointIndex: -1,
        selectedLineIndex: -1
      },
      visual: {
        pointSize: 7,
        pointStroke: 2
      },
      type: {
        show: [true, true],
        color: [['#0000ff', '#0055ff', '#0099ff'], ['#ff0000', '#ff5500', '#ff9900']],
        name: ['Natural', 'Kochanek']
      }
    }
  }

  this.start = function() {
    
    const splineController = new SplineController(app.spline);
    
    // create model
    const splines = new Splines(app.spline);
    splines.create(0, new NaturalCubicSpline2D());
    splines.create(1, new KochanekSpline2D());
    
    splineController.setSplines(splines);

    // create view
    const splineScreen = new SplineScreen();
    splineController.setScreen(splineScreen);

    const splinePanel = new SplinePanel();
    splineController.setPanel(splinePanel);

    // draw spline
    splineController.drawSpline();
    
  }

}