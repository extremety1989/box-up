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
  glTf
} from 'babylonjs';

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
      src: ['./sounds/sound.mp3']
    });
    
    const blackSide = MeshBuilder.CreateCylinder("black", {height: 0.05, diameter: 0.2}, scene);
    blackSide.position.y = -0.025;
    blackSide.material = new StandardMaterial('blackMaterial', scene);
    blackSide.material.diffuseColor = Color3.Black();


    const yellowSide = MeshBuilder.CreateCylinder("yellow", {height: 0.05, diameter: 0.2}, scene);
    yellowSide.position.y = -0.025;
    yellowSide.material = new StandardMaterial('blackMaterial', scene);
    yellowSide.material.diffuseColor = Color3.Yellow();

    const blackTarget = MeshBuilder.CreateSphere(
      'b',
      { diameter: 0.2, slice: 0.5},
      scene
    );

    blackTarget.speed = 0;
    blackTarget.material = new StandardMaterial('blackMaterial', scene);
    blackTarget.material.diffuseColor = Color3.Black();
    blackTarget.isVisible = false;
    blackTarget.sound = destroyedTarget;
   
    const yellowTarget = MeshBuilder.CreateSphere(
      'y',
      { diameter: 0.2, slice: 0.5},
      scene
    );

    yellowTarget.speed = 0;
    yellowTarget.material = new StandardMaterial('yellowMaterial', scene);
    yellowTarget.material.diffuseColor = Color3.Yellow();
    yellowTarget.isVisible = false;
    yellowTarget.sound = destroyedTarget;


    let pos = new Vector3(0, 0, 0);
    xr.baseExperience.onStateChangedObservable.add((state) => {
      pos.copyFrom(xr.baseExperience.camera.position);
    });



    const targets = [];



    function combo_1() {
      const newBlackTarget = blackTarget.createInstance("black");
      newBlackTarget.addChild(blackSide.createInstance("black"));
      newBlackTarget.position.copyFrom(pos);
      newBlackTarget.position.z += 10;
      newBlackTarget.position.x += 0.1;
      newBlackTarget.speed = 1;
      newBlackTarget.isVisible = true;
      newBlackTarget.rotation.x = Math.PI/2;
      newBlackTarget.rotation.z = Math.PI/4;
      targets.push(newBlackTarget);
      const newTellowTarget = yellowTarget.createInstance("yellow");
      newTellowTarget.addChild(yellowSide.createInstance("yellow"));
      newTellowTarget.position.copyFrom(pos);
      newTellowTarget.position.z += 5;
      newTellowTarget.position.x -= 0.1;
      newTellowTarget.speed = 1;
      newTellowTarget.isVisible = true;
      newTellowTarget.rotation.x = Math.PI/2;
      newTellowTarget.rotation.z = -Math.PI/4;
      targets.push(newTellowTarget);
    }

    setInterval(() => {
      combo_1();
    }, 1500);

    const leftSpehere = MeshBuilder.CreateSphere(
      'leftSphere',
      { diameter: 0.2 },
      scene
    );

    leftSpehere.material = new StandardMaterial('leftMaterial', scene);
    leftSpehere.material.diffuseColor = Color3.Yellow();

    const rightSpehere = MeshBuilder.CreateSphere(
      'leftSphere',
      { diameter: 0.2 },
      scene
    );
    rightSpehere.material = new StandardMaterial('leftMaterial', scene);
    rightSpehere.material.diffuseColor = Color3.Black();


    scene.registerBeforeRender(function () {
      if( targets.length > 0 ) {
        targets.forEach((target) => {
          if (leftSpehere.intersectsMesh(target, true) && rightSpehere.intersectsMesh(target, true)){

          } else {
            if (leftSpehere.intersectsMesh(target, true)) {
              if(target.name === "yellow"){
                target.sound.play();
                target.dispose();
                targets.splice(targets.indexOf(target), 1);
              } else{
  
              }
            }
            if (rightSpehere.intersectsMesh(target, true)) {
              if(target.name === "black"){
                target.sound.play();
                target.dispose();
                targets.splice(targets.indexOf(target), 1);
              } else{
  
              }
            }
          }
        });
      }
    });

    xr.input.onControllerAddedObservable.add((controller) => {
      controller.onMotionControllerInitObservable.add(
        async (motionController) => {

          const ids = motionController.getComponentIds();
          const trigger = motionController.getComponent(ids[0]);
          const squeeze = motionController.getComponent(ids[1]);
          const a_and_b_Button = motionController.getComponent(ids[3]);
          const x_and_y_Button = motionController.getComponent(ids[4]);

          if (motionController.handness === 'left') {


            leftSpehere.parent = controller.grip || controller.pointer;

            trigger.onButtonStateChangedObservable.add(() => {

              if (trigger.pressed) {
                changeMap();
              }
            });
          }
          if (motionController.handness === 'right') {

            rightSpehere.parent = controller.grip || controller.pointer;

            trigger.onButtonStateChangedObservable.add(() => {

              if (trigger.pressed) {
                changeMap();
              }
            });
          }
        }
      );
    });

    engine.runRenderLoop(() => {
      scene.render();
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
