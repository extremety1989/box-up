import './style.css';
import { Howl, Howler } from 'howler';

import {
  HemisphericLight,
  Scene,
  Vector3,
  StandardMaterial,
  Color3,
  MeshBuilder,
  DirectionalLight,
  WebXRFeatureName,
  WebXRControllerComponent,
  SceneLoader,
  ShadowGenerator,
  Engine,
} from '@babylonjs/core';

import "@babylonjs/loaders/glTF";
import '@babylonjs/core/Materials/Node/Blocks'

import { Rectangle } from '@babylonjs/gui/2D/controls/rectangle'
import { Line } from '@babylonjs/gui/2D/controls/line'
import { Ellipse } from '@babylonjs/gui/2D/controls/ellipse'
import { TextBlock } from '@babylonjs/gui/2D/controls/textBlock'
import { AdvancedDynamicTexture, Button, StackPanel } from '@babylonjs/gui'





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
    let paused = true;

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

    let pos = new Vector3(0, 0, 0);
    xr.baseExperience.onStateChangedObservable.add((state) => {
      pos.copyFrom(xr.baseExperience.camera.position);
    });

    const assetContainers = [];
    let currentSceneIndex = 0;

    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].file === '') continue;
      const assets = await loadPromise(scenes[i].root, scenes[i].file, scene);
      assets.meshes.forEach((mesh) => {
        mesh.computeWorldMatrix(true);
        mesh.position.addInPlace(pos);
        if (mesh.name === "Radio") {

        }
        if (mesh.name === "Ground") {
          mesh.receiveShadows = true;
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


    const upper = MeshBuilder.CreateBox("upper", { width: 1.5, height: 0.5 }, scene);
    upper.material = new StandardMaterial('blackMaterial', scene);
    upper.material.diffuseColor = Color3.Black();
    upper.isVisible = false;
    upper.speed = 0;

    const blackSide = MeshBuilder.CreateCylinder("black", { height: 0.05, diameter: 0.2 }, scene);
    blackSide.isVisible = false;
    blackSide.position.y = -0.025;
    blackSide.material = new StandardMaterial('blackMaterial', scene);
    blackSide.material.diffuseColor = Color3.Black();


    const yellowSide = MeshBuilder.CreateCylinder("yellow", { height: 0.05, diameter: 0.2 }, scene);
    yellowSide.isVisible = false;
    yellowSide.position.y = -0.025;
    yellowSide.material = new StandardMaterial('blackMaterial', scene);
    yellowSide.material.diffuseColor = Color3.Yellow();

    const blackTarget = MeshBuilder.CreateSphere(
      'black',
      { diameter: 0.2, slice: 0.5 },
      scene
    );
    blackTarget.isVisible = false;
    blackTarget.speed = 0;
    blackTarget.material = new StandardMaterial('blackMaterial', scene);
    blackTarget.material.diffuseColor = Color3.Black();



    const yellowTarget = MeshBuilder.CreateSphere(
      'yellow',
      { diameter: 0.2, slice: 0.5 },
      scene
    );
    yellowTarget.isVisible = false;
    yellowTarget.speed = 0;
    yellowTarget.material = new StandardMaterial('yellowMaterial', scene);
    yellowTarget.material.diffuseColor = Color3.Yellow();





    const plane = MeshBuilder.CreatePlane("plane", { size: 1 }, scene);
    plane.position = new Vector3(1, 1.5, 1);
    plane.rotation = new Vector3(0, Math.PI / 9, 0);
    const planeMaterial = new StandardMaterial("planeMaterial", scene);

    planeMaterial.diffuseColor = new Color3(0, 1, 1);


  

    const plane2 = MeshBuilder.CreatePlane("plane2", { size: 2 }, scene);
    plane2.position = new Vector3(0, 1, 1);
    plane2.material = planeMaterial;

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(
      plane
    );
    const advancedTexture2 = AdvancedDynamicTexture.CreateForMesh(
      plane2
    );

    const panel = new StackPanel("panel");
    panel.background = "black";
    panel.alpha = 0.8;
    advancedTexture.addControl(panel);

    const header = new TextBlock();
    header.position = "center";
    header.text = "Menu";
    header.height = "500px";
    header.color = "white";
    header.fontSize = "80px";
    panel.addControl(header);

    const button_1 = Button.CreateSimpleButton("", "Easy");
    button_1.fontSizeInPixels = 12;
    button_1.paddingTop = "10px";
    button_1.fontWeight = '300';
    button_1.width = 0.2;
    button_1.height = "100px";
    button_1.color = '#fff';
    button_1.fontSize = "40px";
    panel.addControl(button_1);

    const button_2 = Button.CreateSimpleButton("", "Medium");
    button_2.fontSizeInPixels = 12;
    button_2.fontWeight = '300';
    button_2.paddingTop = "10px";
    button_2.width = 0.2;
    button_2.height = "100px";
    button_2.color = '#fff';
    button_2.fontSize = "40px";
    panel.addControl(button_2);

    const button_3 = Button.CreateSimpleButton("", "Hard");
    button_3.fontSizeInPixels = 12;
    button_3.paddingTop = "10px";
    button_3.width = 0.2;
    button_3.fontWeight = '300';
    button_3.height = "100px";
    button_3.color = '#fff';
    button_3.fontSize = "40px";
    panel.addControl(button_3);


    const panel2 = new StackPanel("panel2");
    advancedTexture2.addControl(panel2);

    const center = new TextBlock();
    center.text = "";
    center.height = "500px";
    center.color = '#fff';
    center.fontSize = "120px";
    panel2.addControl(center);



 let globalSpeed = 5;

 let interval = null;

 function getTimerLeft(sec) {
    if(paused){
      panel.isVisible = false;
      if(interval) clearInterval(interval);
      interval = setInterval(() => {
        center.text = sec.toString();
        console.log(sec);
        if (sec <= 0) {
          center.text = "Go!";
          paused = false;
          clearInterval(interval);
          setTimeout(() => {
            center.text = "";
          }, 1000);
        }
        sec--;
      }, 1000);
    }else{
      clearInterval(interval);
    }
  }

  function openMenu() {
    if(interval) {
      clearInterval(interval);
      interval = null;
    }
    panel.isVisible = true;
    center.text = "";
    left.isVisible = false;
    right.isVisible = false;
    targets.forEach((target) => {
      target.dispose();
    });
    targets = [];
    paused = true;
  }


    let targets = [];



    function combo_1() {
      const newBlackTarget = blackSide.createInstance("black");
      newBlackTarget.addChild(blackTarget.createInstance("b"));
      newBlackTarget.position.copyFrom(pos);
      newBlackTarget.position.y -= 0.2;
      newBlackTarget.position.z += 15;
      newBlackTarget.position.x += 0.1;
      newBlackTarget.speed = globalSpeed;
      newBlackTarget.isVisible = true;
      newBlackTarget.rotation.x = Math.PI / 2;
      newBlackTarget.rotation.z = Math.PI / 4;
      targets.push(newBlackTarget);
      const newTellowTarget = yellowSide.createInstance("yellow");
      newTellowTarget.addChild(yellowTarget.createInstance("y"));
      newTellowTarget.position.copyFrom(pos);
      newTellowTarget.position.y -= 0.2;
      newTellowTarget.position.z += 5;
      newTellowTarget.position.x -= 0.1;
      newTellowTarget.speed = globalSpeed;
      newTellowTarget.isVisible = true;
      newTellowTarget.rotation.x = Math.PI / 2;
      newTellowTarget.rotation.z = -Math.PI / 4;
      targets.push(newTellowTarget);
    }

    function combo_2() {
      const newBlackTarget = blackSide.createInstance("black");
      newBlackTarget.addChild(blackTarget.createInstance("black"));
      newBlackTarget.position.copyFrom(pos);
      newBlackTarget.position.y -= 0.5;
      newBlackTarget.position.z += 15;
      newBlackTarget.position.x += 0.1;
      newBlackTarget.speed = globalSpeed;
      newBlackTarget.isVisible = true;
      newBlackTarget.rotation.x = Math.PI / 2;
      newBlackTarget.rotation.z = Math.PI / 4;
      targets.push(newBlackTarget);
      const newTellowTarget = yellowSide.createInstance("yellow");
      newTellowTarget.addChild(yellowTarget.createInstance("yellow"));
      newTellowTarget.position.copyFrom(pos);
      newTellowTarget.position.y -= 0.5;
      newTellowTarget.position.z += 5;
      newTellowTarget.position.x -= 0.1;
      newTellowTarget.speed = globalSpeed;
      newTellowTarget.isVisible = true;
      newTellowTarget.rotation.x = Math.PI / 2;
      newTellowTarget.rotation.z = -Math.PI / 4;
      targets.push(newTellowTarget);
    }

    function combo_3() {
      const newBlackTarget = blackSide.createInstance("black");
      newBlackTarget.addChild(blackTarget.createInstance("black"));
      newBlackTarget.position.copyFrom(pos);
      newBlackTarget.position.y -= 0.2;
      newBlackTarget.position.z += 15;
      newBlackTarget.position.x += 0.1;
      newBlackTarget.speed = globalSpeed;
      newBlackTarget.isVisible = true;
      newBlackTarget.rotation.x = Math.PI / 2;
      newBlackTarget.showBoundingBox = true;
      targets.push(newBlackTarget);
      const newTellowTarget = yellowSide.createInstance("yellow");
      newTellowTarget.addChild(yellowTarget.createInstance("yelow"));
      newTellowTarget.position.copyFrom(pos);
      newTellowTarget.position.y -= 0.2;
      newTellowTarget.position.z += 5;
      newTellowTarget.position.x -= 0.1;
      newTellowTarget.speed = globalSpeed;
      newTellowTarget.isVisible = true;
      newTellowTarget.rotation.x = Math.PI / 2;
      newTellowTarget.showBoundingBox = true;
      targets.push(newTellowTarget);
    }

    function combo_4() {
      const newBlackTarget = blackSide.createInstance("black");
      newBlackTarget.addChild(blackTarget.createInstance("black"));
      newBlackTarget.position.copyFrom(pos);
      newBlackTarget.position.y -= 0.5;
      newBlackTarget.position.z += 15;
      newBlackTarget.position.x += 0.1;
      newBlackTarget.speed = globalSpeed;
      newBlackTarget.isVisible = true;
      newBlackTarget.rotation.x = Math.PI / 2;
      newBlackTarget.showBoundingBox = true;
      targets.push(newBlackTarget);
      const newTellowTarget = yellowSide.createInstance("yellow");
      newTellowTarget.addChild(yellowTarget.createInstance("yellow"));
      newTellowTarget.position.copyFrom(pos);
      newTellowTarget.position.y -= 0.5;
      newTellowTarget.position.z += 5;
      newTellowTarget.position.x -= 0.1;
      newTellowTarget.speed = globalSpeed;
      newTellowTarget.isVisible = true;
      newTellowTarget.rotation.x = Math.PI / 2;
      newTellowTarget.showBoundingBox = true;
      targets.push(newTellowTarget);
    }

    function combo_5() {
      const newUpper = upper.createInstance("upper");
      newUpper.position.copyFrom(pos);
      newUpper.position.z += 5;
      newUpper.speed = globalSpeed;
      newUpper.isVisible = true;
      targets.push(newUpper);
    }



    setInterval(async () => {
      if (paused) return;
      if (Math.random() > 0.5) {
        combo_1();
      }else {
        combo_5();
      }

    }, 1500);


    const left = await SceneLoader.ImportMeshAsync(null, "./models/", "left.glb", scene);
    left.velocity = new Vector3(0, 0, 0);
    left.isVisible = false;

    const right = await SceneLoader.ImportMeshAsync(null, "./models/", "right.glb", scene);
    right.velocity = new Vector3(0, 0, 0);
    right.isVisible = false;





    scene.registerBeforeRender(function () {
      if (targets.length > 0) {
        targets.forEach((target) => {

          if (left.meshes[0].intersectsMesh(target, true) && right.meshes[0].intersectsMesh(target, true)) {

          }
          if (left.meshes[0].intersectsMesh(target, false)) {
            if (target.name === "yellow") {
              if (left.velocity.length() > 0.9) {

              }
              destroyedTarget.play();
              target.dispose();
              targets.splice(targets.indexOf(target), 1);
            } else {

            }
          }
          if (right.meshes[0].intersectsMesh(target, false)) {
            if (target.name === "black") {
              if (right.velocity.length() > 0.9) {

              }
              destroyedTarget.play();
              target.dispose();
              targets.splice(targets.indexOf(target), 1);
            } else {

            }
          }
        });
      }
    });

    scene.meshes.forEach((mesh) => {
      if (mesh.name === "Radio") {

      }
    });


    document.addEventListener("keydown", function(event) {
      if (event.key === "p") {
        if (paused) {

          if(interval){
            panel.isVisible = true;
            center.text = "";
            clearInterval(interval);
            interval = null;
          }else{
            left.isVisible = true;
            right.isVisible = true;
            getTimerLeft(10);
          }

        } else {
          openMenu();
        }
      }
    });

    let target;
    let leftController;
    let rightController;
    xr.input.onControllerAddedObservable.add((controller) => {
      controller.onMotionControllerInitObservable.add(
        async (motionController) => {


          const ids = motionController.getComponentIds();
          const trigger = motionController.getComponent(ids[0]);
          const squeeze = motionController.getComponent(ids[1]);
          const a_or_x_Button = motionController.getComponent(ids[3]);
          const b_or_y_Button = motionController.getComponent(ids[4]);


          b_or_y_Button.onButtonStateChangedObservable.add(() => {
            if (b_or_y_Button.pressed) {
              if (paused) {

                if(interval){
                  panel.isVisible = true;
                  center.text = "";
                  clearInterval(interval);
                  interval = null;
                }else{
                  left.isVisible = true;
                  right.isVisible = true;
                  getTimerLeft(10);
                }
      
              } else {
                openMenu();
              }
            }
          });



          if (motionController.handness === 'left') {
  


            leftController = controller;
            left.meshes[0].parent = controller.grip || controller.pointer;

            trigger.onButtonStateChangedObservable.add(() => {

              if (trigger.pressed && paused) {
                target = scene.meshUnderPointer;
                if (xr.pointerSelection.getMeshUnderPointer) {
                  target = xr.pointerSelection.getMeshUnderPointer(controller.uniqueId);
                }
                if (target && target.name === "panel" && target.parent === null) {
    
                
      
                }else{
          
                }
              }
            });
          }
          if (motionController.handness === 'right') {
   
  
            rightController = controller;
            right.meshes[0].parent = controller.grip || controller.pointer;

            trigger.onButtonStateChangedObservable.add(() => {

              if (trigger.pressed && paused) {
                target = scene.meshUnderPointer;
                if (xr.pointerSelection.getMeshUnderPointer) {
                  target = xr.pointerSelection.getMeshUnderPointer(controller.uniqueId);
                }
           
                if (target && target.name === "panel" && target.parent === null) {
    
                  // target.setParent(motionController.rootMesh);
      
                }else{
                  // target && target.setParent(null);
                }
              }
            });
          }

          if (motionController.handness === 'left' && motionController.handedness === 'right') {

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
      if (leftController) {
        const currentPosition = leftController.grip.position.clone();
        const currentTime = performance.now();

        if (leftPreviousPosition && leftPreviousTime) {
          const deltaTime = (currentTime - leftPreviousTime) / 1000;
          if (deltaTime > 0) {
            const velocity = currentPosition.subtract(leftPreviousPosition).scale(1 / deltaTime);
            if (velocity.length() > 0.1) {
              left.velocity = velocity;
            }
          }
        }
        leftPreviousPosition = currentPosition;
        leftPreviousTime = currentTime;
      }

      if (rightController) {
        const currentPosition = rightController.grip.position.clone();
        const currentTime = performance.now();

        if (rightPreviousPosition && rightPreviousTime) {
          const deltaTime = (currentTime - rightPreviousTime) / 1000;
          if (deltaTime > 0) {
            const velocity = currentPosition.subtract(rightPreviousPosition).scale(1 / deltaTime);
            if (velocity.length() > 0.1) {
              right.velocity = velocity;
            }
          }
        }
        rightPreviousPosition = currentPosition;
        rightPreviousTime = currentTime;
      }


      const delta = engine.getDeltaTime() / 1000;
      if (targets.length > 0 && !paused) {
        targets.forEach((target) => {
          if (target.position.z < -1) {
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
