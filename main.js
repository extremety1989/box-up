import './style.css';

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
  Engine,
  ShadowGenerator,
  HavokPlugin,
  PhysicsShapeType,
  PhysicsAggregate,
  glTF,
} from 'babylonjs';

import HavokPhysics from 'https://cdn.babylonjs.com/havok/HavokPhysics_es.js';
// import HavokPhysics from '@babylonjs/havok';

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
    root: '/',
    file: 'https://github.com/extremety1989/3dgame/blob/main/parking.glb',
  },
  {
    root: '/',
    file: 'room.glb',
  },
];

async function run() {
  let shadowGenerator;
  const app = document.getElementById('app');
  const canvas = document.createElement('canvas');
  app.appendChild(canvas);
  const engine = new Engine(canvas, true);

  const scene = new Scene(engine);
  const plugin = new HavokPlugin(true, await HavokPhysics());
  const gravity = new Vector3(0, -9.81, 0);
  scene.enablePhysics(gravity, plugin);
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
      axisChangedHandler: (axes, movementState, featureContext, xrInput) => {},
    },
    {
      allowedComponentTypes: [
        WebXRControllerComponent.THUMBSTICK_TYPE,
        WebXRControllerComponent.TOUCHPAD_TYPE,
      ],
      forceHandedness: 'left',
      axisChangedHandler: (axes, movementState, featureContext, xrInput) => {},
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
      shadowGenerator = new ShadowGenerator(1024, light);
      shadowGenerator.useBlurExponentialShadowMap = true;
      shadowGenerator.blurKernel = 32;

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
    if (assets.cameras.length == 0) {
      const camera = new FreeCamera('camera1', new Vector3(0, 0, 0), scene);
      camera.setTarget(Vector3.Zero());
      camera.attachControl(canvas, true);
      scene.removeCamera(camera);
      assets.cameras.push(camera);
    }
    assetContainers.push(assets);
  }
  assetContainers[currentSceneIndex].addAllToScene();
  assetContainers[currentSceneIndex].meshes.forEach((mesh) => {
    if (mesh.parent) {
      const parentTransform = mesh.parent.getWorldMatrix();
      mesh.bakeTransformIntoVertices(parentTransform);
      mesh.parent = null;
    }
    shadowGenerator.addShadowCaster(mesh);
  });

  document.onkeydown = (e) => {
    if (e.key != 'z') {
      return;
    }
    assetContainers[currentSceneIndex].removeAllFromScene();
    currentSceneIndex = ++currentSceneIndex % assetContainers.length;

    if (assetContainers[currentSceneIndex].cameras[0]) {
      scene.activeCamera.position.copyFrom(
        assetContainers[currentSceneIndex].cameras[0].position
      );
    }
    assetContainers[currentSceneIndex].meshes.forEach((mesh) => {
      if (mesh.parent) {
        const parentTransform = mesh.parent.getWorldMatrix();
        mesh.bakeTransformIntoVertices(parentTransform);
        mesh.parent = null;
      }
    });
    assetContainers[currentSceneIndex].addAllToScene();
  };

  xr.baseExperience.onInitialXRPoseSetObservable.add(() => {
    const xrPosition = xr.baseExperience.camera.position.clone();
    console.log(xrPosition);
  });

  xr.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add(
      async (motionController) => {
        if (motionController.handness === 'left') {
          const leftSpehere = MeshBuilder.CreateSphere(
            'leftSphere',
            { diameter: 0.05 },
            scene
          );
        }
        if (motionController.handness === 'right') {
          const rightSpehere = MeshBuilder.CreateSphere(
            'leftSphere',
            { diameter: 0.05 },
            scene
          );
        }
      }
    );
  });

  engine.runRenderLoop(() => {
    scene.render();
  });
}

run()
  .then(() => {
    console.log('Done');
  })
  .catch((err) => {
    console.log(err);
  });
