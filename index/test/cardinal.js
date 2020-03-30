var radio = "move";

function Cardinal(canvasId, scale, Px, Py){

var canvas, ctx, w,h,h1, d,d2,  dragId = -1, isMouseDown = false;
var n = Px.length, n1 = n+1, n2 = n+2, Al = 6;
var iColor = ["#090909","#f00000","#00f000","#0000f0","#f0f000","#00f0f0","#f000f0"];
var B0 = new Float64Array(26),  B1 = new Float64Array(26),
    B2 = new Float64Array(26),  B3 = new Float64Array(26);
   canvas = document.getElementById(canvasId);
   ctx = canvas.getContext("2d");
   canvas.addEventListener('mousemove', drag, false);
   canvas.addEventListener('touchmove', drag, false);
   canvas.addEventListener('mousedown', start_drag, false);
//   canvas.addEventListener('mouseup', stop_drag, false);
   canvas.addEventListener('touchstart', start_drag, false);                                    
   canvas.addEventListener('touchend', stop_drag, false);
   window.addEventListener('resize', resize, false);
   document.addEventListener('mouseup', function(){isMouseDown = false;}, false);
   var t = 0;
   for (var i= 0; i< 26; i++){
     var t1 = 1-t, t12 = t1*t1, t2 = t*t;
     B0[i] = t1*t12; B1[i] = 3*t*t12; B2[i] = 3*t2*t1; B3[i] = t*t2;
     t += .04;}
   document.getElementById("alpha").value = Al/3;
   resize();

function drawSpline(){
  var step = 1/w, t = step;
  var scPx = new Float64Array(n2), scPy = new Float64Array(n2);
  var X,Y;
  ctx.clearRect(0,0, w, h);
  ctx.lineWidth = d;
  ctx.strokeStyle = "#0000f0";
  for (var i = 0; i < n; i++){
   X = scPx[i+1] = Px[i]*w;
   Y = scPy[i+1] = Py[i]*h;
   ctx.strokeRect(X - d, h1 - Y - d, d2,d2);
  }
  if ( n > 2 ){
   ctx.beginPath();  ctx.moveTo(scPx[1], h1 - scPy[1]);
   for (var i = 2; i < n1; i++)
    ctx.lineTo(scPx[i], h1 - scPy[i]);
   ctx.stroke();
  }
  ctx.lineWidth = d2;
  ctx.strokeRect(w*.95, h1 - h1*Al/12, w*.03, w*.015);
  ctx.strokeStyle = "#f00000";
  scPx[0] = scPx[1] - (scPx[2] - scPx[1]);  scPy[0] = scPy[1] - (scPy[2] - scPy[1]);
  scPx[n1] = scPx[n] + (scPx[n] - scPx[n-1]);  scPy[n1] = scPy[n] + (scPy[n] - scPy[n-1]);
  ctx.beginPath();  ctx.moveTo(scPx[1], h1 - scPy[1]);
  for (var i = 1; i < n; i++){
   for (var k = 0; k < 26; k++){
    X = (scPx[i]*B0[k] + (scPx[i]+(scPx[i+1]-scPx[i-1])/Al)*B1[k] +
      (scPx[i+1]-(scPx[i+2]-scPx[i])/Al)*B2[k] + scPx[i+1]*B3[k]);
    Y = (scPy[i]*B0[k] + (scPy[i]+(scPy[i+1]-scPy[i-1])/Al)*B1[k] +
      (scPy[i+1]-(scPy[i+2]-scPy[i])/Al)*B2[k] + scPy[i+1]*B3[k]);
    ctx.lineTo(X, h1 - Y);}
  }
  ctx.stroke();
}
function resize(){
  h = w = Math.round(window.innerWidth * scale);
  h1 = h-1;
  d = Math.max(1, Math.round(w / 250));  d2 = d+d;
  canvas.width = w;  canvas.height = h;
  drawSpline();
}
function drag(ev){
  if (!isMouseDown) return;
  var c = getXY(ev);
  if (radio == "alpha"){
   Al = 12.0*c[1];
   document.getElementById("alpha").value = Al/3;}
  else{
   Px[dragId] = c[0];  Py[dragId] = c[1];
  }
  drawSpline();
  ev.preventDefault();
}
function start_drag(ev){
  isMouseDown = true;
  if (radio == "move"){
   var c = getXY(ev);
   dragId = getPointId(c);
   Px[dragId] = c[0];  Py[dragId] = c[1];
   drawSpline();}
  else if ( radio == "delete" ){
   var c = getXY(ev);
   var Id = getPointId(c);
   for (var i = Id; i < n; i++){
    Px[i] = Px[i+1];  Py[i] = Py[i+1];}
   n2--; n1--; n--;
   drawSpline();} 
  else if ( radio == "add" ){
   var c = getXY(ev);
   var Id = getPointId(c) + 1;
   for (var i = n; i > Id; i--){
    Px[i] = Px[i-1];  Py[i] = Py[i-1];}
   Px[Id] = c[0];  Py[Id] = c[1];
   n2++; n1++; n++;
   drawSpline();} 
  ev.preventDefault();
}
function stop_drag(ev){
  dragId = -1;
  ev.preventDefault();
}
function getPointId(c){
   var Rmin = 2, r2,xi,yi, Id = 0;
   for (var i = 0; i < n; i++){
    xi = (c[0] - Px[i]); yi = (c[1] - Py[i]);
    r2 = xi*xi + yi*yi;
    if ( r2 < Rmin ){ Id = i; Rmin = r2;}}
   return Id;
}
function getXY(ev){
  if (!ev.clientX) ev = ev.touches[0];
  var rect = canvas.getBoundingClientRect();
  var x = (ev.clientX - rect.left) / w,
      y = (h1 - (ev.clientY - rect.top)) / h;
  return [x, y];
}
} // end Cardinal
