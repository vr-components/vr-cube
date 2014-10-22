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
 * Detects presence of shadow-dom
 * CSS selectors.
 *
 * @return {Boolean}
 */
var hasShadowCSS = (function() {
  try { document.querySelector(':host'); return true; }
  catch (e) { return false; }
})();

proto.shadowStyleHack = function() {
  if (hasShadowCSS) { return; }
  var style = this.shadowRoot.querySelector('style').cloneNode(true);
  this.classList.add('-content', '-host');
  style.setAttribute('scoped', '');
  this.appendChild(style);
};

/**
 * Called when the element is first created.
 *
 * Here we create the shadow-root and
 * inject our template into it.
 *
 * @private
 */
proto.createdCallback = function() {
  var shadowRoot = this.createShadowRoot();
  var classes = this.getAttribute('class');
  var x = this.getAttribute('x');
  var y = this.getAttribute('y');
  var z = this.getAttribute('z');

  // DOM
  shadowRoot.innerHTML = template;
  var div = this.shadowRoot.querySelector('.inner');
  div.classList.add(classes);

  //this.shadowStyleHack();

  // WEB GL
  this.material = new THREE.MeshLambertMaterial({
    color: 'violet',
    map: new THREE.Texture()
  });
  var obj = this.obj = new THREE.Mesh(new THREE.PlaneGeometry( this.clientWidth, this.clientHeight ), this.material);
  //var obj = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 200), material);
  obj.overdraw = true;
  obj.position.set(x, y, z);
  this.textCanvas = document.createElement( 'canvas' );
  this.renderText();

  VR.group.add(obj);
};

proto.renderText = function() {
  var self = this;
  var DOMURL = window.URL || window.webkitURL || window;
  var text = this.innerHTML;
  var data =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + this.clientWidth + '" height="' + this.clientHeight + '">' +
      '<foreignObject  width="' + this.clientWidth + '" height="' + this.clientHeight + '">' +
          '<style>' +
           '.vr-button {' +
            'display: inline-block;' +
            'height: 100%;' +
            'width: 100%;' +
            'background-color: violet;' +
            'margin: 0;' +
            'text-align: center;' +
            'line-height: 50px;' +
           '}' +
          '</style>' +
          '<div xmlns="http://www.w3.org/1999/xhtml" class="vr-button">' +
              text +
          '</div>' +
      '</foreignObject>' +
    '</svg>';
  var img = new Image();
  var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
  var url = DOMURL.createObjectURL(svg);

  //this.material.map = THREE.ImageUtils.loadTexture( 'bug.jpg' );

  img.onload = function () {
    var canvas = self.textCanvas;
    canvas.width = this.width;
    canvas.height = this.height;
    var texture = new THREE.Texture( canvas );
    texture.needsUpdate = true;
    var context = canvas.getContext( '2d' );
    context.fillStyle = 'rgb( 255, 255, 255 )';
    context.fillRect( 0, 0, self.clientWidth, self.clientHeight );
    context.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);
    self.material.map = texture;
    self.material.needsUpdate = true;
  }
  img.src = url;
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

var template = `
<style>

::content {
  color: white;
}

</style>

<div class="inner">
  <content></content>
</div>`;

// If the browser doesn't support shadow-css
// selectors yet, we update the template
// to use the shim classes instead.
if (!hasShadowCSS) {
  template = template
    .replace('::content', '.-content', 'g')
    .replace(':host', '.-host', 'g');
}

// Register and return the constructor
// and expose `protoype` (bug 1048339)
module.exports = document.registerElement('vr-button', { prototype: proto });
module.exports._prototype = proto;

});})((function(n,w){'use strict';return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:
function(c){var m={exports:{}},r=function(n){return w[n];};
w[n]=c(r,m.exports,m)||m.exports;};})('vr-button',this));
