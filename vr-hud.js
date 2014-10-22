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

var template = document.createElement('template');
template.innerHTML =
'<div>' +
  '<content></content>' +
'</div>';

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
  var tmpl = template.content.cloneNode(true);
  var shadow = this.createShadowRoot();
  this.inner = tmpl.firstElementChild;
  shadow.appendChild(tmpl);
};

proto.render = function() {
  var styleName = this.getAttribute('style');
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
};

// Register and return the constructor
// and expose `protoype` (bug 1048339)
module.exports = document.registerElement('vr-hud', { prototype: proto });
module.exports._prototype = proto;

});})((function(n,w){'use strict';return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:
function(c){var m={exports:{}},r=function(n){return w[n];};
w[n]=c(r,m.exports,m)||m.exports;};})('vr-hud',this));
