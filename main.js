import './style.css';
import { Howl, Howler } from 'howler';

import {
  HemisphericLight,
  Scene,
  Vector3,
  Scalar,
  Quaternion,
  StandardMaterial,
  Color3,
  MeshBuilder,
  DirectionalLight,
  WebXRFeatureName,
  WebXRControllerComponent,
  SceneLoader,
  ShadowGenerator,
  AssetsManager,
  AxesViewer,
  Engine,
} from '@babylonjs/core';

import "@babylonjs/loaders/glTF";
import '@babylonjs/core/Materials/Node/Blocks'


import { TextBlock } from '@babylonjs/gui/2D/controls/textBlock'
import { AdvancedDynamicTexture, Button, StackPanel, Grid, Control, Line, Rectangle } from '@babylonjs/gui'





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



  async function run() {
    if (info.difficulty === undefined) {
      info.difficulty = "Easy";
    }

    let paused = true;

    const app = document.getElementById('app');
    const canvas = document.createElement('canvas');
    app.appendChild(canvas);
    const engine = new Engine(canvas, true);

    const scene = new Scene(engine);


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


    const assetContainers = [];
    let currentSceneIndex = 0;

    const advancedTextureRadio = AdvancedDynamicTexture.CreateFullscreenUI("RADIO_UI");
    advancedTextureRadio.idealWidth = 600;


    const radioPlane = MeshBuilder.CreatePlane("radioPlane", { size: 1 }, scene);
    radioPlane.isVisible = false;
 
    const advancedTextureRadio2 = AdvancedDynamicTexture.CreateForMesh(
      radioPlane
    );

    const panelRadio = new StackPanel("panelRadio");
    panelRadio.background = "black";
    panelRadio.alpha = 0.8;
    advancedTextureRadio2.addControl(panelRadio);

    const gridRadio = new Grid("Grid");
    gridRadio.height = "200px"
    gridRadio.addRowDefinition(100, true);
    gridRadio.addColumnDefinition(500, true)
    gridRadio.addColumnDefinition(500, true)
    gridRadio.addColumnDefinition(500, true)
    gridRadio.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER

    const playRadio = Button.CreateSimpleButton("playRadio", ">");
    playRadio.paddingTop = "40px";
    playRadio.paddingLeft = "40px";
    playRadio.color = '#fff';
    playRadio.fontSizeInPixels = 12;
    playRadio.fontWeight = '300';
    playRadio.fontSize = "40px";

    const stopRadio = Button.CreateSimpleButton("stopRadio", "[]");
    stopRadio.paddingTop = "40px";
    stopRadio.paddingLeft = "40px";
    stopRadio.color = '#fff';
    stopRadio.fontSizeInPixels = 12;
    stopRadio.fontWeight = '300';
    stopRadio.fontSize = "40px";
    panelRadio.addControl(gridRadio);
    gridRadio.addControl(playRadio, 0, 0);
    gridRadio.addControl(stopRadio, 0, 1);

    const assetsManager = new AssetsManager(scene);
    const level = assetsManager.addMeshTask("Gym", "", "/box-up/models/", "gym.glb");

    level.onSuccess = function (task) {
      task.loadedAnimationGroups.forEach((anim) => {
        anim.stop();
      });
    };

    assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
      engine.loadingUIText = "We are loading the scene. " + remainingCount + " out of " + totalCount + " items still need to be loaded.";
    };
    const light = new HemisphericLight(
      'light',
      new Vector3(-0.5, -1, -0.25),
      scene
    );

    light.diffuse = Color3.FromHexString('#ffffff');
    light.groundColor = Color3.FromHexString('#bbbbff');
    light.intensity = 0.7;

    const dirLight = new DirectionalLight(
      'light',
      new Vector3(0, -1, -0.5),
      scene
    );
    dirLight.position = new Vector3(0, 5, -5);

    const xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: 'immersive-vr',
      },
      optionalFeatures: false,
    });

    const featureManager = xr.baseExperience.featuresManager;

    featureManager.disableFeature(WebXRFeatureName.TELEPORTATION);
    featureManager.enableFeature(WebXRFeatureName.MOVEMENT, 'latest', {
      PerformanceMeasurement: false,
      xrInput: xr.input,
      customRegistrationConfigurations: swappedHandednessConfiguration,
    });

    let pos = new Vector3(0, 0, 0);

    const destroyedTarget = new Howl({
      src: ['./sounds/break_1.mp3']
    });


    const upper = MeshBuilder.CreateBox("upper", { width: 1.0, height: 0.5 }, scene);
    upper.material = new StandardMaterial('blackMaterial', scene);
    upper.material.diffuseColor = Color3.Black();
    upper.isVisible = false;
    upper.speed = 0;

    const blackSide = MeshBuilder.CreateCylinder("black", { height: 0.05, diameter: 0.2 }, scene);
    blackSide.isVisible = false;
    blackSide.position.y = -0.028;
    blackSide.material = new StandardMaterial('blackMaterial', scene);
    blackSide.material.diffuseColor = Color3.Black();


    const yellowSide = MeshBuilder.CreateCylinder("yellow", { height: 0.05, diameter: 0.2 }, scene);
    yellowSide.isVisible = false;
    yellowSide.position.y = -0.028;
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


    const advancedTextureComboCounter = AdvancedDynamicTexture.CreateFullscreenUI("COMBO_UI");
    const comboCounter = new TextBlock();
    comboCounter.isVisible = true;
    comboCounter.text = "HEllo";
    comboCounter.width = "100px";
    comboCounter.height = "100px";
    comboCounter.color = "#fff";
    comboCounter.thickness = 4;
    comboCounter.background = "black";
    comboCounter.alpha = 0.8;

    comboCounter.position = new Vector3(1, 1.5, 1);
    comboCounter.rotation = new Vector3(0, Math.PI / 9, 0);
  
    advancedTextureComboCounter.addControl(comboCounter);

    const plane2 = MeshBuilder.CreatePlane("plane2", { size: 2 }, scene);
    plane2.isVisible = false;
    plane2.position = new Vector3(0, 0, 0);


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

    const grid = new Grid("Grid");
    grid.height = "400px"
    grid.addRowDefinition(100, true);
    grid.addRowDefinition(100, true);
    grid.addRowDefinition(100, true);
    grid.addColumnDefinition(500, true)
    grid.addColumnDefinition(500, true)
    grid.addColumnDefinition(500, true)
    grid.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER

    const button_1 = Button.CreateSimpleButton("Easy", "Easy");
    button_1.paddingTop = "40px";
    button_1.paddingLeft = "40px";
    button_1.color = '#fff';
    button_1.fontSizeInPixels = 12;
    button_1.fontWeight = '300';
    button_1.fontSize = "40px";

    const button_2 = Button.CreateSimpleButton("Medium", "Medium");
    button_2.paddingTop = "40px";
    button_2.paddingLeft = "40px";
    button_2.color = '#fff';
    button_2.fontSizeInPixels = 12;
    button_2.fontWeight = '300';
    button_2.fontSize = "40px";

    const button_3 = Button.CreateSimpleButton("Hard", "Hard");
    button_3.paddingTop = "40px";
    button_3.paddingLeft = "40px";
    button_3.color = '#fff';
    button_3.fontSizeInPixels = 12;
    button_3.fontWeight = '300';
    button_3.fontSize = "40px";

    const button_4 = Button.CreateSimpleButton("HOW", "How to play");
    button_4.paddingTop = "40px";
    button_4.paddingLeft = "40px";
    button_4.color = '#fff';
    button_4.fontSizeInPixels = 12;
    button_4.fontWeight = '300';
    button_4.fontSize = "40px";

    const button_5 = Button.CreateSimpleButton("SETFLOOR", "Set floor position");
    button_5.paddingTop = "40px";
    button_5.paddingLeft = "40px";
    button_5.color = '#fff';
    button_5.fontSizeInPixels = 12;
    button_5.fontWeight = '300';
    button_5.fontSize = "40px";


    panel.addControl(grid);
    grid.addControl(button_1, 0, 0);
    grid.addControl(button_2, 1, 0);
    grid.addControl(button_3, 2, 0);

    grid.addControl(button_4, 0, 1);
    grid.addControl(button_5, 1, 1);


    if (info.difficulty === button_1.name) {
      button_1.background = '#fff';
      button_1.color = '';
      button_2.background = '';
      button_3.background = '';
    } else if (info.difficulty === button_2.name) {
      button_1.background = '';
      button_2.background = '#fff';
      button_2.color = '';
      button_3.background = '';
    } else if (info.difficulty === button_3.name) {
      button_1.background = '';
      button_2.background = '';
      button_3.background = '#fff';
      button_3.color = '';
    }


    button_1.onPointerClickObservable.add(() => {
      info.difficulty = button_1.name;
      localStorage.setItem('info', JSON.stringify(info));
      button_1.background = '#fff';
      button_1.color = '';
      button_2.color = '#fff';
      button_2.background = '';
      button_3.background = '';
      button_3.color = '#fff';
    });

    button_2.onPointerClickObservable.add(() => {
      info.difficulty = button_2.name;
      localStorage.setItem('info', JSON.stringify(info));
      button_1.color = '#fff';
      button_1.background = '';
      button_2.background = '#fff';
      button_2.color = '';
      button_3.background = '';
      button_3.color = '#fff';
    });

    button_3.onPointerClickObservable.add(() => {
      info.difficulty = button_3.name;
      localStorage.setItem('info', JSON.stringify(info));
      button_1.color = '#fff';
      button_1.background = '';
      button_2.background = '';
      button_2.color = '#fff';
      button_3.background = '#fff';
      button_3.color = '';
    });

    button_4.onPointerClickObservable.add(() => {
  
    });
    let localAxes = new AxesViewer(scene, 1);
    const floorPosition = MeshBuilder.CreateGround("floorPlane", {width: 2, height: 2}, scene);
    floorPosition.position.y = xr.baseExperience.camera.position.y + 0.5;
    localAxes.xAxis.parent = floorPosition;
    localAxes.yAxis.parent = floorPosition;
    localAxes.zAxis.parent = floorPosition;	
    floorPosition.isVisible = false;
    button_5.onPointerClickObservable.add(() => {
      if(!floorPosition.isVisible && paused){

      }
    });

    button_5.onPointerDownObservable.add(() => {
      if(!floorPosition.isVisible && paused){
        plane.isVisible = false;
        floorPosition.isVisible = true;
        level.loadedMeshes.forEach((mesh) => {
          mesh.isVisible = false;
        });
      }
    });

  

    const panel2 = new StackPanel("panel2");
    advancedTexture2.addControl(panel2);
    const center = new TextBlock();
    center.text = "";
    center.height = "500px";
    center.color = '#fff';
    center.fontSize = "120px";
    panel2.addControl(center);





    let globalSpeed = 1;

    let interval = null;

    function getTimerLeft(sec) {
      if (paused) {
        plane.isVisible = false;
        comboCounter.text = "0";
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
          if (!plane2.isVisible) plane2.isVisible = true;
 
          center.text = sec.toString();
          if (sec <= 0) {
            pos.copyFrom(xr.baseExperience.camera.position);
            center.text = "Go!";
            paused = false;
            clearInterval(interval);
            setTimeout(() => {
              if(info.difficulty === "Easy"){
                globalSpeed = 2;
              } else if(info.difficulty === "Medium"){
                globalSpeed = 2.5;
              } else if(info.difficulty === "Hard"){
                globalSpeed = 5;
              }
              plane2.isVisible = false;
              center.text = "";
            }, 1000);
          }
          sec--;
        }, 1000);
      } else {
        clearInterval(interval);
      }
    }

    function offOnGloves(controller, gloves) {
      left.isVisible = true;
      right.isVisible = true;
      [left, right].forEach((model) => {
        if (model.meshes[0].parent) {
          model.meshes[0].parent.getChildMeshes().forEach((mesh) => {
            mesh.isVisible = controller;
          });
        }
        model.meshes.forEach((mesh) => {
          if (mesh.name === "LeftGlove" || mesh.name === "RightGlove") {
            mesh.isVisible = gloves;
          }
        });
      });
    }

    function openMenu() {
      paused = true;
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      offOnGloves(true, false);
      plane.isVisible = true;
      if (plane2.isVisible) plane2.isVisible = false;
      center.text = "";
      left.isVisible = false;
      right.isVisible = false;
      targets.forEach((target) => {
        target.dispose();
      });
      targets = [];
    }

    let targets = [];


    async function createBlackTarget() {
      return new Promise((res, rej) => {
        const newBlackTarget = blackTarget.createInstance("black");
        newBlackTarget.addChild(blackSide.createInstance("b"));
        newBlackTarget.position.copyFrom(pos);
        newBlackTarget.position.y -= 0.2;
        newBlackTarget.position.z += 5;
        newBlackTarget.position.x += 0.1;
        newBlackTarget.isVisible = true;
        newBlackTarget.rotation.x = Math.PI / 2;
        res(newBlackTarget);
      });
    }

    async function createYellowTarget() {
      return new Promise((res, rej) => {
        const newTellowTarget = yellowSide.createInstance("yellow");
        newTellowTarget.addChild(yellowTarget.createInstance("y"));
        newTellowTarget.position.copyFrom(pos);
        newTellowTarget.position.y -= 0.2;
        newTellowTarget.position.z += 5;
        newTellowTarget.position.x -= 0.1;
        newTellowTarget.isVisible = true;
        newTellowTarget.rotation.x = Math.PI / 2;
        newTellowTarget.rotation.z = -Math.PI / 4;
        res(newTellowTarget);
      });
    }

    async function createUpper() {
      return new Promise((res, rej) => {
        const newUpper = upper.createInstance("upper");
        newUpper.position.copyFrom(pos);
        newUpper.position.z += 5;
        newUpper.isVisible = true;
        res(newUpper);
      });
    }

    async function combo_1() {
      const tb = await createBlackTarget();
      targets.push(tb);
      const ty = await createYellowTarget();
      targets.push(ty);
      // const tu = await createUpper();
      // targets.push(tu);


      ty.position.z += 5;
      tb.speed = globalSpeed;
      ty.speed = globalSpeed;
      // tu.speed = globalSpeed;
    }

    async function combo_5() {

    }



    setInterval(async () => {
      if (paused) return;
      if (Math.random() > 0.5) {
        await combo_1();
      } else {
        await combo_5();
      }

    }, 1500);


    // const {radio_meshes, radio_animationGroups} = await SceneLoader.ImportMeshAsync(null, "./models/", "radio.glb", scene);


    const leftCollision = MeshBuilder.CreateSphere("dummyCam", { diameter: 0.25 }, scene, true);
    leftCollision.isVisible = false;
    leftCollision.showBoundingBox = true;
    const rightCollision = MeshBuilder.CreateSphere("dummyCam", { diameter: 0.25 }, scene, true);
    rightCollision.showBoundingBox = true;
    rightCollision.isVisible = false;



    const left = await SceneLoader.ImportMeshAsync(null, "./models/", "left.glb", scene);
    left.velocity = new Vector3(0, 0, 0);

    const right = await SceneLoader.ImportMeshAsync(null, "./models/", "right.glb", scene);
    right.velocity = new Vector3(0, 0, 0);


    [left, right].forEach((model) => {
      model.meshes.forEach((mesh) => {
        mesh.isVisible = false;
      });
    });




    scene.registerBeforeRender(function () {
      if (targets.length > 0) {
        targets.forEach((target) => {

          if (leftCollision.intersectsMesh(target, true)) {
            if (target.name === "yellow") {
              if (left.velocity.length() > 0.9) {
                comboCounter.text = (parseInt(comboCounter.text) + 1).toString();
              }
              destroyedTarget.play();
              target.dispose();
              targets.splice(targets.indexOf(target), 1);
            } else {

            }
          }
          if (rightCollision.intersectsMesh(target, true)) {
            if (target.name === "black") {
              if (right.velocity.length() > 0.9) {
                comboCounter.text = (parseInt(comboCounter.text) + 1).toString();
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

    let target;
    let leftController;
    let rightController;
    xr.input.onControllerAddedObservable.add((controller) => {
      controller.onMotionControllerInitObservable.add(
        async (motionController) => {


          const ids = motionController.getComponentIds();
          const trigger = motionController.getComponent(ids[0]);
          const thumb_stick = motionController.getComponent(ids[2]);

          thumb_stick.onButtonStateChangedObservable.add(() => {
            if (thumb_stick.pressed && !floorPosition.isVisible) {
              if (paused) {
                if(floorPosition.isVisible){
                  floorPosition.parent = null;
                  floorPosition.isVisible = false;
                }
                if (interval) {
                  plane.isVisible = true;
                  if (plane2.isVisible) plane2.isVisible = false;
                  center.text = "";
                  clearInterval(interval);
                  interval = null;
                  offOnGloves(true, false);
                } else {
                  offOnGloves(false, true);
                  getTimerLeft(1);
                }
              } else {
                openMenu();
              }
            }
          });
          
          trigger.onButtonStateChangedObservable.add(() => {

            if (trigger.pressed && paused) {
           
              target = scene.meshUnderPointer;
              if (xr.pointerSelection.getMeshUnderPointer) {
                target = xr.pointerSelection.getMeshUnderPointer(controller.uniqueId);
              }
              if(target && target.name === "floorPlane" && floorPosition.isVisible && 
              target.parent === null && !plane.isVisible){ 
                target.isPressed = true;
              }
              else if (target && target.name === "plane" && target.parent === null && !floorPosition.isVisible) {
                target.setParent(motionController.rootMesh);
              }
            } else if (paused) {

              if(target){
                    
              if (target.name === "Circle" && !floorPosition.isVisible) {
                xr.baseExperience.camera.position.x = 0;
                xr.baseExperience.camera.position.z = 0;
              }

              else if (target.name.startsWith("Circle.00") && !floorPosition.isVisible) {
                xr.baseExperience.camera.position.x = -target.position.x;
                xr.baseExperience.camera.position.z = target.position.z;
              }

              else if (target.name === "plane") {
                target.setParent(null);
              }
              target = null;
              }

              if(floorPosition.isVisible && !plane.isVisible){ 
              
                floorPosition.isPressed = false;
                localStorage.setItem('info', JSON.stringify(info));

                level.loadedMeshes.forEach((mesh) => {
                  mesh.isVisible = true;
                  if (mesh.name === "__root__") {
                    mesh.position.y = info.floorPosition;
                  }
                });
                plane.isVisible = true;
                floorPosition.parent = null;
                floorPosition.isVisible = false;
              }
            }
          });

          if (motionController.handness === 'left' && motionController.handness === 'right') {
            comboCounter.isVisible = true;
            plane2.position.copyFrom(xr.baseExperience.camera.position);
            plane2.position.z += 1;
          }

          if (motionController.handness === 'left') {
            leftCollision.position = controller.grip.position;
            leftCollision.position.y -= 0.03;
            leftController = controller;
            left.meshes[0].parent = controller.grip || controller.pointer;
            left.meshes[0].position.x -= 0.03;
          }
          if (motionController.handness === 'right') {    
            rightCollision.position = controller.grip.position;
            rightCollision.position.y -= 0.03;
            rightController = controller;
            right.meshes[0].parent = controller.grip || controller.pointer;
            right.meshes[0].position.x += 0.03;
          }
        }
      );

    });

    let leftPreviousPosition = null;
    let leftPreviousTime = null;
    let rightPreviousPosition = null;
    let rightPreviousTime = null;

    assetsManager.onFinish = function (tasks) {
      engine.runRenderLoop(() => {
        scene.render();
    
        const currentTime = performance.now();
        const delta = engine.getDeltaTime() / 1000;

        if (leftController) {
          const currentPosition = leftController.grip.position.clone();  
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
          if (rightPreviousPosition && rightPreviousTime) {
            const deltaTime = (currentTime - rightPreviousTime) / 1000;
            if (deltaTime > 0) {
              const velocity = currentPosition.subtract(rightPreviousPosition).scale(1 / deltaTime);
              if (velocity.length() > 0.1) {
                right.velocity = velocity;
              }
            }
          }


          if(floorPosition.isVisible && !plane.isVisible && floorPosition.isPressed){
        
            let distance = Vector3.Distance(currentPosition, floorPosition.position); 
            if (floorPosition.position.y >= (currentPosition.y - 0.05)) {
              let targetPosition = new Vector3(0, currentPosition.y, 0);
              floorPosition.position.y = Scalar.Lerp(floorPosition.position.y, targetPosition.y, 0.1);
              floorPosition.position.x = Scalar.Lerp(floorPosition.position.x, targetPosition.x, 0.1);
              floorPosition.position.z = Scalar.Lerp(floorPosition.position.z, targetPosition.z, 0.1);
              info.floorPosition = floorPosition.getAbsolutePosition().y - 0.05;
            }
          }  


          rightPreviousPosition = currentPosition;
          rightPreviousTime = currentTime;
        }
  

        if (targets.length > 0 && !paused) {
          targets.forEach((target) => {
            if (target.position.z < -1) {
              target.dispose();
              targets.splice(targets.indexOf(target), 1);
            }
            target.position.z -= target.speed * delta;
          });
        } else if (targets.length > 0 && paused) {
          targets.forEach((target) => {
            target.dispose();
            targets.splice(targets.indexOf(target), 1);
          });
        }
      });
    };
    assetsManager.load();
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
