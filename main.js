import './style.css';
import {Howl, Howler} from 'howler';
import {
  HemisphericLight,
  Scene,
  Vector3,
  FreeCamera,
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
  TransformNode,
  glTf
} from 'babylonjs';

import "https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"

import HavokPhysics from "https://cdn.babylonjs.com/havok/HavokPhysics_es.js"
//import HavokPhysics from '@babylonjs/havok';

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
      file: 'parking.glb',
    },
    {
      root: '/models/',
      file: 'room.glb',
    },
    {
      root: '/models/',
      file: 'gym.glb',
    }
  ];

  async function run() {
    let shadowGenerator;
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
      // Add a light if none exists
      if (assets.lights.length == 0) {
        const light = new HemisphericLight(
          'light',
          new Vector3(-0.5, -1, -0.25),
          scene
        );
        light.diffuse = Color3.FromHexString('#ffffff');
        light.groundColor = Color3.FromHexString('#bbbbff');
        light.intensity = 0.7;
        // shadowGenerator = new ShadowGenerator(1024, light);
        // shadowGenerator.useBlurExponentialShadowMap = true;
        // shadowGenerator.blurKernel = 32;

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
      // Add camera if none exists
      // if (assets.cameras.length == 0) {
      //   const camera = new FreeCamera('camera1', new Vector3(0, 0, 0), scene);
      //   camera.setTarget(Vector3.Zero());
      //   camera.attachControl(canvas, true);
      //   console.log(camera.position);
      //   scene.removeCamera(camera);
      //   assets.cameras.push(camera);
      // }
      assetContainers.push(assets);
    }
    assetContainers[currentSceneIndex].addAllToScene();
    assetContainers[currentSceneIndex].meshes.forEach((mesh) => {
      if (mesh.parent) {
        const parentTransform = mesh.parent.getWorldMatrix();
        mesh.bakeTransformIntoVertices(parentTransform);
        mesh.parent = null;
      }
      // shadowGenerator.addShadowCaster(mesh);
    });

    function changeMap() {
      assetContainers[currentSceneIndex].removeAllFromScene();
      currentSceneIndex = ++currentSceneIndex % assetContainers.length;

      // if (assetContainers[currentSceneIndex].cameras[0]) {
      //   scene.activeCamera.position.copyFrom(
      //     assetContainers[currentSceneIndex].cameras[0].position
      //   );
      // }
      assetContainers[currentSceneIndex].meshes.forEach((mesh) => {
        if (mesh.parent) {
          const parentTransform = mesh.parent.getWorldMatrix();
          mesh.bakeTransformIntoVertices(parentTransform);
          mesh.parent = null;
        }
      });
      assetContainers[currentSceneIndex].addAllToScene();
    }


    const blackTarget = MeshBuilder.CreateSphere(
      'black',
      { diameter: 0.2 },
      scene
    );
    blackTarget.speed = 0;
    blackTarget.material = new StandardMaterial('blackMaterial', scene);
    blackTarget.material.diffuseColor = Color3.Black();
    blackTarget.isVisible = true;

    const yellowTarget = MeshBuilder.CreateSphere(
      'yellow',
      { diameter: 0.2 },
      scene
    );

    yellowTarget.speed = 0;
    yellowTarget.material = new StandardMaterial('yellowMaterial', scene);
    yellowTarget.material.diffuseColor = Color3.Yellow();
    yellowTarget.isVisible = true;

    let pos = new Vector3(0, 0, 0);
    xr.baseExperience.onStateChangedObservable.add((state) => {
      pos.copyFrom(xr.baseExperience.camera.position);
    });



    const newBlackTargets = [];
    const newYellowTargets = [];



    setInterval(() => {

      const newBlackTarget = blackTarget.createInstance("black");
      newBlackTarget.position.copyFrom(pos);
      newBlackTarget.position.z += 5;
      newBlackTarget.position.x += 0.5;
      newBlackTarget.speed = 1;
      newBlackTargets.push(newBlackTarget);

      const newTellowTarget = yellowTarget.createInstance("yellow");
      newTellowTarget.position.copyFrom(pos);
      newTellowTarget.position.z += 5;
      newTellowTarget.position.x -= 0.5;
      newTellowTarget.speed = 1;
      newYellowTargets.push(newTellowTarget);

    }, 1000);

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
      if( newBlackTargets.length > 0 ) {
        newBlackTargets.forEach((target) => {
          if (rightSpehere.intersectsMesh(target, true)) {
            target.dispose();
            newBlackTargets.splice(newBlackTargets.indexOf(target), 1);
          }
        });
      }

      if( newYellowTargets.length > 0 ) {
        newYellowTargets.forEach((target) => {
          if (leftSpehere.intersectsMesh(target, true)) {
            target.dispose();
            newYellowTargets.splice(newYellowTargets.indexOf(target), 1);
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
      if( newBlackTargets.length > 0 ) {
        newBlackTargets.forEach((target) => {
          if(target.position.z < -5) {
            target.dispose();
            newBlackTargets.splice(newBlackTargets.indexOf(target), 1);
          }
          target.position.z -= target.speed * delta;
        });
      }

      if( newYellowTargets.length > 0 ) {
        newYellowTargets.forEach((target) => {
          if(target.position.z < -5) {
            target.dispose();
            newYellowTargets.splice(newYellowTargets.indexOf(target), 1);
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
