(function(){

  var VR = window.VR = window.VR || {};
  VR.debug = true;
  VR.renderEvent = VR.renderEvent || new Event('render');

  var camera = VR.camera = VR.camera || new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 500;
  var scene = VR.scene = VR.scene || new THREE.Scene();
  var group = VR.group = VR.group || new THREE.Object3D();
  var renderer = VR.renderer = VR.renderer || createRenderer();

  function createRenderer() {
    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    createLights();
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = false;
    scene.add(group);
    document.body.appendChild( renderer.domElement );
    animate();
    return renderer;
  }

  function createLights() {
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);
  }

  // revolutions per second
  var angularSpeed = 0.2;
  var lastTime = 0;

  function animate() {
    requestAnimationFrame(animate);
    if (!renderer) {
      return;
    }

    // var time = (new Date()).getTime();
    // var timeDiff = time - lastTime;
    // var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
    // VR.group.rotation.y += angleChange;
    // lastTime = time;

    if (VR.debug) {
      document.body.dispatchEvent(VR.renderEvent);
    }

    renderer.render(scene, camera);
  }

})();