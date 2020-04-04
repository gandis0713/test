// var app = {
//   spline: {
//     data: {    
//       input: [[100, 200, 200, 100], [100, 100, 200, 200]],
//       output: [[[]]]
//     },
//     spec: {
//       close: true,
//       resolution: 32,
//       intervals: [0, 0.25, 0.5, 0.75, 1],
    
//       tension: [0, 0, 0, 0],
//       bias: [0, 0, 0, 0],
//       continuity: [0, 0, 0, 0]
//     },
//     state: {
//       isDragging: false,
//       selectedPointIndex: -1,
//       selectedLineIndex: -1
//     },
//     visual: {
//       pointSize: 7,
//       pointStroke: 2
//     }
//   }
// }

const splineType = [[0, '#ff0000', 'kochanek'], [1, '#0000ff', 'natural']];

function App(rootElementName) {

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

  this.splineController = null;

  this.start = function() {
    
    this.splineController = new SplineController(app);
    
    const splines = new Splines(app.spline);
    splines.create(0, new NaturalCubicSpline2D());
    splines.create(1, new KochanekSpline2D());
    
    this.splineController.setSplines(splines);

    this.splineController.setScreen(new SplineScreen(rootElementName));
    this.splineController.setPanel(new SplinePanel(rootElementName, app.spline.spec, app.spline.state));

    this.splineController.start();
    
  }

}