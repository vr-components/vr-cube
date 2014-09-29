(function(define){'use strict';define(function(require,exports,module){
/*jshint esnext:true*/
/*jshint node:true*/
/*globals define*/

/**
 * Dependencies
 */

/**
 * Locals
 */

var baseComponents = window.COMPONENTS_BASE_URL || 'bower_components/';

/**
 * Element prototype, extends from HTMLElement
 *
 * @type {Object}
 */
var proto = Object.create(HTMLElement.prototype);

function getStyle(className) {
  var styleSheets = document.styleSheets;
  var styleSheet;
  var classes;
  var i;
  var j;

  for (i=0; i<styleSheets.length; ++i) {
    styleSheet = styleSheets[0];
    classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
    for (j=0; j<classes.length; j++) {
      if (classes[j].selectorText == className) {
        return classes[j].style;
      }
    }
  }
}


/**
 * Called when the element is first created.
 *
 * Here we create the shadow-root and
 * inject our template into it.
 *
 * @private
 */
proto.createdCallback = function() {
  var shadow = this.createShadowRoot();
  var styleName = this.getAttribute('style');
  var style = getStyle("." + styleName);
  //var color = this.getAttribute('color');
  //var x = this.getAttribute('x');
  //var y = this.getAttribute('y');
  //var z = this.getAttribute('z')

  var color = style.getPropertyValue("--texture");
  var x = style.getPropertyValue("--x");
  var y = style.getPropertyValue("--y");
  var z = style.getPropertyValue("--z");

  var material = new THREE.MeshLambertMaterial({ color: color });
  var obj = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 200), material);
  obj.overdraw = true;
  obj.position.set(x, y, z);

  VR.group.add(obj);
  this.obj = obj;
  this.material = material;
  document.body.addEventListener('render', this.render.bind(this));
};

proto.render = function() {
  var styleName = this.getAttribute('style');
  var style = getStyle("." + styleName);
  var material = this.material;
  var obj = this.obj;
  var color = style.getPropertyValue("--texture");
  var x = style.getPropertyValue("--x");
  var y = style.getPropertyValue("--y");
  var z = style.getPropertyValue("--z");
  obj.position.x = x;
  obj.position.y = y;
  obj.position.z = z;
  material.color.set(color);
  material.needsUpdate = true;
};

proto.attachedCallback = function() {
  console.log("Attached callback");
};

/**
 * Called when one of the attributes
 * on the element changes.
 *
 * @private
 */
proto.attributeChangedCallback = function(attr, oldVal, newVal) {
  var material = this.material;
  var obj = this.obj;
  if (!newVal) { return; }
  switch (attr) {
    case 'style':
      this.render();
    case 'color':
      material.color.set(newVal);
      material.needsUpdate = true;
      break;
    case 'x': case 'y': case 'z':
      obj.position[attr] = newVal;
      break;
    default:
      break;
  }

};


// Register and return the constructor
// and expose `protoype` (bug 1048339)
module.exports = document.registerElement('vr-cube', { prototype: proto });
module.exports._prototype = proto;

});})((function(n,w){'use strict';return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:
function(c){var m={exports:{}},r=function(n){return w[n];};
w[n]=c(r,m.exports,m)||m.exports;};})('vr-cube',this));
