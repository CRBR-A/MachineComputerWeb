/*
Written by Peter O. in 2015.

Any copyright is dedicated to the Public Domain.
http://creativecommons.org/publicdomain/zero/1.0/
If you like this, you should donate to Peter O.
at: http://upokecenter.dreamhosters.com/articles/donate-now-2/
*/
/**
* Parametric evaluator for a surface of revolution, which results by revolving
* an X/Y curve around an axis.
* <p>This class is considered a supplementary class to the
* Public Domain HTML 3D Library and is not considered part of that
* library. <p>
* To use this class, you must include the script "extras/evaluators.js"; the
 * class is not included in the "glutil_min.js" file which makes up
 * the HTML 3D Library.  Example:<pre>
 * &lt;script type="text/javascript" src="extras/evaluators.js">&lt;/script></pre>
* @class
* @alias SurfaceOfRevolution
* @param {Function} curve Curve to rotate about the axis of rotation, as
* specified in the "axis" parameter.
* The curve function must contain a function
* named "evaluate", which takes the following parameter:<ul>
* <li><code>u</code> - A curve coordinate, generally from 0 to 1.
* </ul>
* The evaluator function returns an array of at least 2 elements: the first
* element is the X coordinate of the curve's position (corresponding to
* elevation), and the second
* element is the Y coordinate (corresponding to
* radius).<p>
* If the curve function draws a curve that goes around the axis of rotation, such
* as a circle or ellipse, the V-coordinates given in _minval_ and _maxval_ must
* restrict the curve definition to no more than half of the curve.
* @param {number} minval Smallest V-coordinate.
* @param {number} maxval Largest V-coordinate.   If _minval_ is greater than
* _maxval_, both values will be swapped.
* @param {Array<number>} [axis] Axis of rotation, around which the curve
* will be rotated to generate the surface of revolution.  If null or omitted, the positive
* Z-axis will be the axis of rotation.  This parameter is a 3-element array describing
* the X, Y, and Z coordinates, respectively, of a 3D point.  The axis of rotation will
* run in the direction from the origin to the point given in this parameter.  This
* parameter need not be normalized to unit length.
*/
var SurfaceOfRevolution=function(curve,minval,maxval, axis){
 this.curve=curve
 this.minval=Math.min(minval,maxval);
 this.maxval=Math.min(minval,maxval);
 this._axis=axis;
 this._axisQuat=null;
 if(this._axis){
  this._axisQuat=GLMath.quatFromVectors([0,0,1],this._axis);
 }
 this.evaluate=function(u,v){
  v=minval+(maxval-minval)*v;
  var curvepos=this.curve.evaluate(v);
  u=(GLMath.PiTimes2)*u;
  var cosu = Math.cos(u);
  var sinu = (u>=0 && u<6.283185307179586) ? (u<=3.141592653589793 ? Math.sqrt(1.0-cosu*cosu) : -Math.sqrt(1.0-cosu*cosu)) : Math.sin(u);
  var cp1=curvepos[1];
  var cp0=curvepos[0];
  var x=cp1*cosu
  var y=cp1*sinu
  var z=cp0;
  var ret=[x,y,z];
  if(this._axisQuat){
   SurfaceOfRevolution._quatTransformInPlace(this._axisQuat,ret);
  }
  return ret;
 }
}
/** @private */
SurfaceOfRevolution._quatTransformInPlace=function(q,v){
 var v1 = GLMath.vec3cross( q, v );
 v1[0] += v[0] * q[3];
 v1[1] += v[1] * q[3];
 v1[2] += v[2] * q[3];
 var v2 = GLMath.vec3cross( v1, q );
 var dot = q[0] * v[0] + q[1] * v[1] + q[2] * v[2];
 v[0]=q[0] * dot + v1[0] * q[3] - v2[0];
 v[1]=q[1] * dot + v1[1] * q[3] - v2[1];
 v[2]=q[2] * dot + v1[2] * q[3] - v2[2];
};
/**
* Creates a parametric evaluator for a surface of revolution
* whose curve is the graph of a single-variable function.
* @param {Function} func Function whose graph will be
* rotated about the axis of rotation, as
* specified in the "axis" parameter.  The function takes a number
* as a single parameter and returns a number.  The return
* value is effectively the radius of each part of the surface
* from beginning to end.
* @param {number} minval Smallest parameter of the function.
* This is a number of units from the origin along the axis of rotation.
* @param {number} maxval Largest parameter of the function.
* This is a number of units from the origin along the axis of rotation.
* If _minval_ is greater than _maxval_, both values will be swapped.
* @param {Array<number>} [axis] Axis of rotation, around which the
* function graph will be rotated to generate the surface of revolution.
* If null or omitted, the positive Z-axis will be the axis of rotation.
* This parameter is a 3-element array describing
* the X, Y, and Z coordinates, respectively, of a 3D point.  The axis of rotation will
* run in the direction from the origin to the point given in this parameter.  This
* parameter need not be normalized to unit length.
* @return {SurfaceOfRevolution} Return value.* @example <caption>The following creates an evaluator for a cone
* which starts at the origin and runs 10 units along the Z axis.</caption>
* var surf=SurfaceOfRevolution.fromFunction(
*  function(x){  return x/2; }, // use a constantly increasing function
* 0, 10);
* @example <caption>This is an evaluator for the same cone, but
* shifted 3 units back.</caption>
* var surf=SurfaceOfRevolution.fromFunction(
*  function(x){  x+=3; return x/2; },
* -3,7);
* @example <caption>The following creates an evaluator for a cylinder
* which runs from 5 to 10 units, and with a radius of 2 units.</caption>
* var surf=SurfaceOfRevolution.fromFunction(
*  function(x){  return 2; }, // use a constant radius
* 5, 10);
*/
SurfaceOfRevolution.fromFunction=function(func,minval,maxval,axis){
  return new SurfaceOfRevolution({
    "evaluate":function(u){
      return [u,func(u),0];
    }},minval,maxval,axis);
}
/**
* Parametric evaluator for a torus, a special case of a surface of revolution.
* @param {number} outerRadius Radius from the center to the innermost
* part of the torus.
* @param {number} innerRadius Radius from the inner edge to the innermost
* part of the torus.
* @param {Function} [curve] Object describing
* a curve to serve as the cross section of the torus.
* The curve need not be closed; in fact, certain special surfaces can result
* by leaving the ends open.
* The curve function must contain a function
* named "evaluate", which takes the following parameter:<ul>
* <li><code>u</code> - A curve coordinate, generally from 0 to 1.
* </ul>
* The evaluator function returns an array of at least 2 elements: the first
* element is the X coordinate of the curve's position, and the second
* element is the Y coordinate.  If null or omitted, uses a circular cross section.
* @param {Array<number>} [axis] Axis of rotation, which the torus
* will pass through.
* If null or omitted, the positive Z-axis will be the axis of rotation.
* This parameter is a 3-element array describing
* the X, Y, and Z coordinates, respectively, of a 3D point.  The axis of rotation will
* run in the direction from the origin to the point given in this parameter.  This
* parameter need not be normalized to unit length.
* @return {SurfaceOfRevolution} Return value.*/
SurfaceOfRevolution.torus=function(outerRadius,innerRadius,curve,axis){
  if(!curve)curve={
    "evaluate":function(u){
      u*=GLMath.PiTimes2;
      return [Math.cos(u),Math.sin(u)]
    }
  }
  return new SurfaceOfRevolution({
    "evaluate":function(u){
      var curvept=curve.evaluate(u)
      var x=innerRadius*curvept[1];
      var y=outerRadius+innerRadius*curvept[0];
      return [x,y,0];
    }},0,Math.PI,axis);
}

/**
* Parametric evaluator for a
* curve drawn by a circle that rolls along the inside
* of another circle, whose position is fixed.
* <p>This class is considered a supplementary class to the
* Public Domain HTML 3D Library and is not considered part of that
* library. <p>
* To use this class, you must include the script "extras/evaluators.js"; the
 * class is not included in the "glutil_min.js" file which makes up
 * the HTML 3D Library.  Example:<pre>
 * &lt;script type="text/javascript" src="extras/evaluators.js">&lt;/script></pre>
* @class
* @param {number} outerRadius Radius of the circle whose position
* is fixed.
* @param {number} innerRadius Radius of the rolling circle.
* A hypocycloid results when outerRadius=innerRadius.
* @param {number} distFromInnerCenter Distance from the center of the
* rolling circle to the drawing pen.
*/
function Hypotrochoid(outerRadius, innerRadius, distFromInnerCenter){
 this.outer=outerRadius;
 this.inner=innerRadius;
 this.distFromInner=distFromInnerCenter;
 /**
* Generates a point on the curve from the given u coordinate.
* @function
* @param {number} u U coordinate.
* @return {Array<number>} A 3-element array specifying a 3D point.
* Only the X and Y coordinates will be other than 0.
*/
 this.evaluate=function(u){
  u=u*GLMath.PiTimes2;
  var oi=(this.outer-this.inner)
  var term=oi*u/this.inner;
  // NOTE: prolate hypotrochoid if distFromInner>innerRadius
  var cosu = Math.cos(u),
    sinu = (u>=0 && u<6.283185307179586) ? (u<=3.141592653589793 ? Math.sqrt(1.0-cosu*cosu) : -Math.sqrt(1.0-cosu*cosu)) : Math.sin(u);
  var cost = Math.cos(term),
    sint = (term>=0 && term<6.283185307179586) ? (term<=3.141592653589793 ? Math.sqrt(1.0-cost*cost) : -Math.sqrt(1.0-cost*cost)) : Math.sin(term);
  return [
   oi*cosu+this.distFromInner*cost,
   oi*sinu-this.distFromInner*sint,
   0
  ]
 }
 /**
 * Creates a modified version of this curve so that it
 * fits the given radius.
 * @function
 * @param {number} radius Desired radius of the curve.
 * @return {Hypotrochoid} Return value. */
 this.scaleTo=function(radius){
  var oi=(this.outer-this.inner)
  var mx=Math.abs(Math.max(
   -oi-this.distFromInner,
   -oi+this.distFromInner,
   oi-this.distFromInner,
   oi+this.distFromInner));
  var ratio=radius/mx;
  return new Hypotrochoid(
   this.outer*ratio,
   this.inner*ratio,
   this.distFromInner*ratio);
 }
}

/**
* Parametric evaluator for a
* curve drawn by a circle that rolls along the X-axis.
* <p>This class is considered a supplementary class to the
* Public Domain HTML 3D Library and is not considered part of that
* library. <p>
* To use this class, you must include the script "extras/evaluators.js"; the
 * class is not included in the "glutil_min.js" file which makes up
 * the HTML 3D Library.  Example:<pre>
 * &lt;script type="text/javascript" src="extras/evaluators.js">&lt;/script></pre>
* @class
* @param {number} radius Radius of the rolling circle.
* @param {number} distFromCenter Distance from the center of the
* rolling circle to the drawing pen.
*/
function Trochoid(radius, distFromCenter){
 this.inner=radius;
 this.distFromCenter=distFromCenter;
 /**
* Generates a point on the curve from the given u coordinate.
* @function
* @param {number} u U coordinate.
* @return {Array<number>} A 3-element array specifying a 3D point.
* Only the X and Y coordinates will be other than 0.
*/
 this.evaluate=function(u){
  u=u*GLMath.PiTimes2;
  var cosu = Math.cos(u);
  var sinu = (u>=0 && u<6.283185307179586) ? (u<=3.141592653589793 ? Math.sqrt(1.0-cosu*cosu) : -Math.sqrt(1.0-cosu*cosu)) : Math.sin(u);
  return [
   this.inner*u-this.distFromCenter*sinu,
   this.inner    -this.distFromCenter*cosu,
   0
  ]
 }
}

/**
* Parametric evaluator for a
* curve drawn by a circle that rolls along the outside
* of another circle, whose position is fixed.
* <p>This class is considered a supplementary class to the
* Public Domain HTML 3D Library and is not considered part of that
* library. <p>
* To use this class, you must include the script "extras/evaluators.js"; the
 * class is not included in the "glutil_min.js" file which makes up
 * the HTML 3D Library.  Example:<pre>
 * &lt;script type="text/javascript" src="extras/evaluators.js">&lt;/script></pre>
* @class
* @param {number} outerRadius Radius of the circle whose position
* is fixed.
* @param {number} innerRadius Radius of the rolling circle.
* An epicycloid results when outerRadius=innerRadius.
* @param {number} distFromInnerCenter Distance from the center of the
* rolling circle to the drawing pen.
*/
function Epitrochoid(outerRadius, innerRadius, distFromInnerCenter){
 this.outer=outerRadius;
 this.inner=innerRadius;
 this.distFromInner=distFromInnerCenter;
 /**
* Generates a point on the curve from the given u coordinate.
* @function
* @param {number} u U coordinate.
* @return {Array<number>} A 3-element array specifying a 3D point.
* Only the X and Y coordinates will be other than 0.
*/
 this.evaluate=function(u){
  u=u*GLMath.PiTimes2;
  var oi=(this.outer+this.inner)
  var term=oi*u/this.inner;
  var cosu = Math.cos(u),sinu = (u>=0 && u<6.283185307179586) ? (u<=3.141592653589793 ? Math.sqrt(1.0-cosu*cosu) : -Math.sqrt(1.0-cosu*cosu)) : Math.sin(u);
  var cost = Math.cos(term),sint = (term>=0 && term<6.283185307179586) ? (term<=3.141592653589793 ? Math.sqrt(1.0-cost*cost) : -Math.sqrt(1.0-cost*cost)) : Math.sin(term);
  // NOTE: prolate epitrochoid if distFromInner>innerRadius
  return [
   oi*cosu-this.distFromInner*cost,
   oi*sinu-this.distFromInner*sint,
   0
  ]
 }
 /**
 * Creates a modified version of this curve so that it
 * fits the given radius.
 * @function
 * @param {number} radius Desired radius of the curve.
 * @return {Epitrochoid} Return value. */
 this.scaleTo=function(radius){
  var oi=(this.outer+this.inner)
  var mx=Math.abs(Math.max(
   -oi-this.distFromInner,
   -oi+this.distFromInner,
   oi-this.distFromInner,
   oi+this.distFromInner));
  var ratio=radius/mx;
  return new Epitrochoid(
   this.outer*ratio,
   this.inner*ratio,
   this.distFromInner*ratio);
 }
}
