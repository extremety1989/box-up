import './style.css';
import {Howl, Howler} from 'howler';

import {
  HemisphericLight,
  Scene,
  Vector3,
  StandardMaterial,
  Color3,
  MeshBuilder,
  AdvancedDynamicTexture,
  StackPanel,
  Button,
  InputText,
  Control,
  TextBlock,
  DirectionalLight,
  WebXRFeatureName,
  WebXRControllerComponent,
  SceneLoader,
  ShadowGenerator,
  Engine,
  glTf,
} from 'babylonjs';
import HavokPhysics from "@babylonjs/havok";
import "https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"

const info = localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')) : {};

try {
  async function loadPromise(root, file, scene) {
    if (file !== '') {
      return new Promise((res, rej) => {
        SceneLoader.LoadAssetContainer(root, file, scene, function (container) {
          res(container);
        });
      });
    }
  }

  const scenes = [
    {
      root: '',
      file: '',
    },
    {
      root: '/models/',
      file: 'gym.glb',
    }
  ];


  

  async function run() {
    if(info.level) {
      const level = scenes.find((scene) => scene.file === info.level);
      
    }
    const app = document.getElementById('app');
    const canvas = document.createElement('canvas');
    app.appendChild(canvas);
    const engine = new Engine(canvas, true);

    const scene = new Scene(engine);
  
    const xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: 'immersive-vr',
      },
      optionalFeatures: false,
    });

    const swappedHandednessConfiguration = [
      {
        allowedComponentTypes: [
          WebXRControllerComponent.THUMBSTICK_TYPE,
          WebXRControllerComponent.TOUCHPAD_TYPE,
        ],
        forceHandedness: 'right',
        axisChangedHandler: (axes, movementState, featureContext, xrInput) => { },
      },
      {
        allowedComponentTypes: [
          WebXRControllerComponent.THUMBSTICK_TYPE,
          WebXRControllerComponent.TOUCHPAD_TYPE,
        ],
        forceHandedness: 'left',
        axisChangedHandler: (axes, movementState, featureContext, xrInput) => { },
      },
    ];

    const featureManager = xr.baseExperience.featuresManager;

    featureManager.disableFeature(WebXRFeatureName.TELEPORTATION);
    featureManager.enableFeature(WebXRFeatureName.MOVEMENT, 'latest', {
      PerformanceMeasurement: false,
      xrInput: xr.input,
      customRegistrationConfigurations: swappedHandednessConfiguration,
    });

    const assetContainers = [];
    let currentSceneIndex = 0;

    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].file === '') continue;
      const assets = await loadPromise(scenes[i].root, scenes[i].file, scene);
      assets.meshes.forEach((mesh) => {
        mesh.computeWorldMatrix(true);
       if(mesh.name === "Ground"){
        mesh.receiveShadows = true;
        mesh.position.y = 0;
       }
      });
      if (assets.lights.length == 0) {
        const light = new HemisphericLight(
          'light',
          new Vector3(-0.5, -1, -0.25),
          scene
        );

        light.diffuse = Color3.FromHexString('#ffffff');
        light.groundColor = Color3.FromHexString('#bbbbff');
        light.intensity = 0.7;


        scene.removeLight(light);
        assets.lights.push(light);
        const dirLight = new DirectionalLight(
          'light',
          new Vector3(0, -1, -0.5),
          scene
        );
        dirLight.position = new Vector3(0, 5, -5);
        scene.removeLight(dirLight);
        assets.lights.push(dirLight);
      }
      assetContainers.push(assets);
    }
    assetContainers[currentSceneIndex].addAllToScene();

    function changeMap() {
      assetContainers[currentSceneIndex].removeAllFromScene();
      currentSceneIndex = ++currentSceneIndex % assetContainers.length;
      assetContainers[currentSceneIndex].addAllToScene();
    }

    const destroyedTarget = new Howl({
      src: ['./sounds/break_1.mp3']
    });
    

    const upper = MeshBuilder.CreateBox("upper", {width: 1.5, height: 0.5}, scene);
    upper.isVisible = false;
    upper.speed = 0;
    const blackSide = MeshBuilder.CreateCylinder("black", {height: 0.05, diameter: 0.2}, scene);
    blackSide.position.y = -0.025;
    blackSide.material = new StandardMaterial('blackMaterial', scene);
    blackSide.material.diffuseColor = Color3.Black();


    const yellowSide = MeshBuilder.CreateCylinder("yellow", {height: 0.05, diameter: 0.2}, scene);
    yellowSide.position.y = -0.025;
    yellowSide.material = new StandardMaterial('blackMaterial', scene);
    yellowSide.material.diffuseColor = Color3.Yellow();

    const blackTarget = MeshBuilder.CreateSphere(
      'black',
      { diameter: 0.2, slice: 0.5},
      scene
    );

    blackTarget.speed = 0;
    blackTarget.material = new StandardMaterial('blackMaterial', scene);
    blackTarget.material.diffuseColor = Color3.Black();
    blackTarget.isVisible = false;

   
    const yellowTarget = MeshBuilder.CreateSphere(
      'yellow',
      { diameter: 0.2, slice: 0.5},
      scene
    );

    yellowTarget.speed = 0;
    yellowTarget.material = new StandardMaterial('yellowMaterial', scene);
    yellowTarget.material.diffuseColor = Color3.Yellow();
    yellowTarget.isVisible = false;
   

    let pos = new Vector3(0, 0, 0);
    xr.baseExperience.onStateChangedObservable.add((state) => {
      pos.copyFrom(xr.baseExperience.camera.position);
    });



    const targets = [];



    function combo_1() {
      const newBlackTarget = blackSide.createInstance("black");
      newBlackTarget.addChild(blackTarget.createInstance("b"));
      newBlackTarget.position.copyFrom(pos);
      newBlackTarget.position.y -= 0.2;
      newBlackTarget.position.z += 10;
      newBlackTarget.position.x += 0.1;
      newBlackTarget.speed = 1;
      newBlackTarget.isVisible = true;
      newBlackTarget.rotation.x = Math.PI/2;
      newBlackTarget.rotation.z = Math.PI/4;
      targets.push(newBlackTarget);
      const newTellowTarget = yellowSide.createInstance("yellow");
      newTellowTarget.addChild(yellowTarget.createInstance("y"));
      newTellowTarget.position.copyFrom(pos);
      newTellowTarget.position.y -= 0.2;
      newTellowTarget.position.z += 5;
      newTellowTarget.position.x -= 0.1;
      newTellowTarget.speed = 1;
      newTellowTarget.isVisible = true;
      newTellowTarget.rotation.x = Math.PI/2;
      newTellowTarget.rotation.z = -Math.PI/4;
      targets.push(newTellowTarget);
    }

    function combo_2() {
      const newBlackTarget = blackSide.createInstance("black");
      newBlackTarget.addChild(blackTarget.createInstance("black"));
      newBlackTarget.position.copyFrom(pos);
      newBlackTarget.position.y -= 0.5;
      newBlackTarget.position.z += 10;
      newBlackTarget.position.x += 0.1;
      newBlackTarget.speed = 1;
      newBlackTarget.isVisible = true;
      newBlackTarget.rotation.x = Math.PI/2;
      newBlackTarget.rotation.z = Math.PI/4;
      targets.push(newBlackTarget);
      const newTellowTarget = yellowSide.createInstance("yellow");
      newTellowTarget.addChild(yellowTarget.createInstance("yellow"));
      newTellowTarget.position.copyFrom(pos);
      newTellowTarget.position.y -= 0.5;
      newTellowTarget.position.z += 5;
      newTellowTarget.position.x -= 0.1;
      newTellowTarget.speed = 1;
      newTellowTarget.isVisible = true;
      newTellowTarget.rotation.x = Math.PI/2;
      newTellowTarget.rotation.z = -Math.PI/4;
      targets.push(newTellowTarget);
    }

    function combo_3() {
      const newBlackTarget = blackSide.createInstance("black");
      newBlackTarget.addChild(blackTarget.createInstance("black"));
      newBlackTarget.position.copyFrom(pos);
      newBlackTarget.position.y -= 0.2;
      newBlackTarget.position.z += 10;
      newBlackTarget.position.x += 0.1;
      newBlackTarget.speed = 1;
      newBlackTarget.isVisible = true;
      newBlackTarget.rotation.x = Math.PI/2;
      newBlackTarget.showBoundingBox = true;
      targets.push(newBlackTarget);
      const newTellowTarget = yellowSide.createInstance("yellow");
      newTellowTarget.addChild(yellowTarget.createInstance("yelow"));
      newTellowTarget.position.copyFrom(pos);
      newTellowTarget.position.y -= 0.2;
      newTellowTarget.position.z += 5;
      newTellowTarget.position.x -= 0.1;
      newTellowTarget.speed = 1;
      newTellowTarget.isVisible = true;
      newTellowTarget.rotation.x = Math.PI/2;
      newTellowTarget.showBoundingBox = true;
      targets.push(newTellowTarget);
    }

    function combo_4() {
      const newBlackTarget = blackSide.createInstance("black");
      newBlackTarget.addChild(blackTarget.createInstance("black"));
      newBlackTarget.position.copyFrom(pos);
      newBlackTarget.position.y -= 0.5;
      newBlackTarget.position.z += 10;
      newBlackTarget.position.x += 0.1;
      newBlackTarget.speed = 1;
      newBlackTarget.isVisible = true;
      newBlackTarget.rotation.x = Math.PI/2;
      newBlackTarget.showBoundingBox = true;
      targets.push(newBlackTarget);
      const newTellowTarget = yellowSide.createInstance("yellow");
      newTellowTarget.addChild(yellowTarget.createInstance("yellow"));
      newTellowTarget.position.copyFrom(pos);
      newTellowTarget.position.y -= 0.5;
      newTellowTarget.position.z += 5;
      newTellowTarget.position.x -= 0.1;
      newTellowTarget.speed = 1;
      newTellowTarget.isVisible = true;
      newTellowTarget.rotation.x = Math.PI/2;
      newTellowTarget.showBoundingBox = true;
      targets.push(newTellowTarget);
    }

    function combo_5() {
      upper.isVisible = true;
      const newUpper = upper.createInstance("upper");
      newUpper.position.copyFrom(pos);
      newUpper.position.z += 10;
      upper.speed = 1;
      targets.push(newUpper);
    }

    setInterval(() => {
    if(Math.random() > 0.8){
      combo_1();
    } else if (Math.random() > 0.6){
      combo_2();

    } else if (Math.random() > 0.4){
      combo_3();
    }
    else if(Math.random() > 0.2){
      combo_4();
    }else{
      // combo_5();
    }
    }, 1500);


    const left = await SceneLoader.ImportMeshAsync(null, "./models/", "left.glb", scene);
    left.velocity = new Vector3(0, 0, 0);


    const right = await SceneLoader.ImportMeshAsync(null, "./models/", "right.glb", scene);
    right.velocity = new Vector3(0, 0, 0);


    scene.registerBeforeRender(function () {
      if( targets.length > 0 ) {
        targets.forEach((target) => {
          if(target.name === "upper"){
            if((xr.baseExperience.camera.position.y < target.position.y + 0.5) && 
            (xr.baseExperience.camera.position.z < target.position.z - 1.5)){
              target.dispose();
              targets.splice(targets.indexOf(target), 1);
            }
          }
          if (left.meshes[0].intersectsMesh(target, true) && right.meshes[0].intersectsMesh(target, true)){

          }
          if (left.meshes[0].intersectsMesh(target, false)) {
            if(target.name === "yellow"){
              if(left.velocity.length() > 0.9){

              }
              destroyedTarget.play();
              target.dispose();
              targets.splice(targets.indexOf(target), 1);
            } else{

            }
          }
          if (right.meshes[0].intersectsMesh(target, false)){
            if(target.name === "black"){
              if(right.velocity.length() > 0.9){

              }
              destroyedTarget.play();
              target.dispose();
              targets.splice(targets.indexOf(target), 1);
            } else{

            }
          }
        });
      }
    });


    let leftController;
    let rightController;
    xr.input.onControllerAddedObservable.add((controller) => {
      controller.onMotionControllerInitObservable.add(
        async (motionController) => {

          if (motionController.handness === 'left' && motionController.handedness === 'right') {

          }
          

          const ids = motionController.getComponentIds();
          const trigger = motionController.getComponent(ids[0]);
          const squeeze = motionController.getComponent(ids[1]);
          const a_and_b_Button = motionController.getComponent(ids[3]);
          const x_and_y_Button = motionController.getComponent(ids[4]);

          if (motionController.handness === 'left') {

            leftController = controller;
            left.meshes[0].parent = controller.grip || controller.pointer;

            trigger.onButtonStateChangedObservable.add(() => {

              if (trigger.pressed) {
                changeMap();
              }
            });
          }
          if (motionController.handness === 'right') {

            rightController = controller;
            right.meshes[0].parent = controller.grip || controller.pointer;

            trigger.onButtonStateChangedObservable.add(() => {

              if (trigger.pressed) {
                changeMap();
              }
            });
          }
        }
      );
    });

    let leftPreviousPosition = null;
    let leftPreviousTime = null;
    let rightPreviousPosition = null;
    let rightPreviousTime = null;
 
    engine.runRenderLoop(() => {
      scene.render();
      if(leftController){
        const currentPosition = leftController.grip.position.clone();
        const currentTime = performance.now();
        
        if (leftPreviousPosition && leftPreviousTime) {
          const deltaTime = (currentTime - leftPreviousTime) / 1000; // Time in seconds
          if (deltaTime > 0) {
            const velocity = currentPosition.subtract(leftPreviousPosition).scale(1 / deltaTime);
            if(velocity.length() > 0.1) {
              left.velocity = velocity;
            }
          }
        }
        
        // Update previous position and time
        leftPreviousPosition = currentPosition;
        leftPreviousTime = currentTime;
      }

      if(rightController){
        const currentPosition = rightController.grip.position.clone();
        const currentTime = performance.now();
        
        if (rightPreviousPosition && rightPreviousTime) {
          const deltaTime = (currentTime - rightPreviousTime) / 1000; // Time in seconds
          if (deltaTime > 0) {
            const velocity = currentPosition.subtract(rightPreviousPosition).scale(1 / deltaTime);
            if(velocity.length() > 0.1) {
              right.velocity = velocity;
            }
          }
        }
        
        // Update previous position and time
        rightPreviousPosition = currentPosition;
        rightPreviousTime = currentTime;
      }


      const delta = engine.getDeltaTime() / 1000;
      if( targets.length > 0 ) {
        targets.forEach((target) => {
          if(target.position.z < -1) {
            target.dispose();
            targets.splice(targets.indexOf(target), 1);
          }
          target.position.z -= target.speed * delta;
        });
      }
    });
  }

  run()
    .then(() => {
      console.log('Done');
      document.getElementsByClassName("xr-button-overlay")[0].style.display = "block";
    })
    .catch((err) => {
      console.log(err);
    });
} catch (error) {
  console.log(error);
}
