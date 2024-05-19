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
  Engine,
} from '@babylonjs/core';

import "@babylonjs/loaders/glTF";
import '@babylonjs/core/Materials/Node/Blocks'

import { TextBlock } from '@babylonjs/gui/2D/controls/textBlock'
import { AdvancedDynamicTexture, Button, StackPanel, Grid, Control, Slider } from '@babylonjs/gui'
import { prePassDeclaration } from '@babylonjs/core/Shaders/ShadersInclude/prePassDeclaration';



const info = localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')) : {};

async function run() {

  let comobo_tutorial_1 = false;
  let comobo_tutorial_2 = false;
  let comobo_tutorial_3 = false;
  let comobo_tutorial_4 = false;
  let comobo_tutorial_5 = false;
  let allow_click_the_menu = true;
  let combo_tutorial = false;
  let tutorial = false;
  let targets = [];
  let startTime = performance.now();
  let progression = 0;


  if (info.difficulty === undefined) {
    info.difficulty = "Easy";
  }

  let stopped = true;
  let globalSpeed = 0;

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


  const advancedTextureRadio = AdvancedDynamicTexture.CreateFullscreenUI("RADIO_UI");
  advancedTextureRadio.idealWidth = 600;


  const radioPlane = MeshBuilder.CreatePlane("radioPlane", {}, scene);
  radioPlane.isVisible = true;
  radioPlane.position = new Vector3(2.5, 1.5, 0);
  radioPlane.rotation = new Vector3(0, Math.PI / 2, 0);

  const advancedTextureRadio2 = AdvancedDynamicTexture.CreateForMesh(
    radioPlane
  );

  const panelRadio = new StackPanel("panelRadio");
  panelRadio.background = "black";
  panelRadio.alpha = 0.8;
  advancedTextureRadio2.addControl(panelRadio);



  const gridRadio = new Grid("gridRadio");
  gridRadio.height = "600px"
  gridRadio.addRowDefinition(200, true);
  gridRadio.addRowDefinition(200, true);
  gridRadio.addColumnDefinition(300, true)
  gridRadio.addColumnDefinition(300, true)
  gridRadio.addColumnDefinition(300, true)
  gridRadio.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER

  const radioHeader = new TextBlock();
  radioHeader.height = "200px";
  radioHeader.text = "";
  radioHeader.paddingTop = "60px";
  radioHeader.paddingLeft = "40px";
  radioHeader.color = '#fff';
  radioHeader.fontSizeInPixels = 1;
  radioHeader.fontWeight = '300';
  radioHeader.fontSize = "80px";

  const playRadio = Button.CreateSimpleButton("playRadio", "Play");
  playRadio.paddingTop = "40px";
  playRadio.paddingLeft = "40px";
  playRadio.color = '#fff';
  playRadio.fontSizeInPixels = 12;
  playRadio.fontWeight = '300';
  playRadio.fontSize = "80px";

  const sliderHeader = new TextBlock();
  sliderHeader.text = "Sound:";
  sliderHeader.paddingTop = "40px";
  sliderHeader.paddingLeft = "40px";
  sliderHeader.color = '#fff';
  sliderHeader.fontSizeInPixels = 12;
  sliderHeader.fontWeight = '300';
  sliderHeader.fontSize = "80px";

  const soundSlider = new Slider();
  soundSlider.paddingTop = "40px";
  soundSlider.paddingLeft = "40px";
  soundSlider.minimum = 0.1;
  soundSlider.maximum = 1.0;
  soundSlider.value = 0.5;
  soundSlider.color = '#fff';
  soundSlider.height = "120px";


  let mp3_index = 0;
  const mp3s = []
  const ddioqjoidjq = new Howl({
    name: "2Pac - Time Back",
    src: "./sounds/2Pac - Time Back.mp3",
    autoplay: false,
    loop: true,
    volume: 0.5
  })
  ddioqjoidjq.name = "2Pac - Time Back";
  mp3s.push(ddioqjoidjq);
  const dzdjjzaioj = new Howl({
    src: "./sounds/a-ha - Take On Me.mp3",
    autoplay: false,
    loop: true,
    volume: 0.5
  })
  dzdjjzaioj.name = "a-ha - Take On Me";
  mp3s.push(dzdjjzaioj);


  const djazjodafd = new Howl({
    src: "./sounds/Kevin Rudolf - Let It Rock.mp3",
    autoplay: false,
    loop: true,
    volume: 0.5
  })
  djazjodafd.name = "Kevin Rudolf - Let It Rock";
  mp3s.push(djazjodafd);



  playRadio.onPointerClickObservable.add(() => {
    if (playRadio.textBlock.text === "Play") {
      playRadio.textBlock.text = "Stop";
      radioPlayer.loadedAnimationGroups.forEach((anim) => {

        if (anim.name === "play") {
          anim.play();
        }
        // if(anim.name === "stop"){
        //   anim.stop();
        // }
      });
      radioHeader.text = `${mp3s[mp3_index].name}`;
      mp3s[mp3_index].play();
    } else {
      playRadio.textBlock.text = "Play";
      radioPlayer.loadedAnimationGroups.forEach((anim) => {
        if (anim.name === "play") {
          anim.stop();
        }
        if (anim.name === "stop") {
          anim.play();
        }
      });
      radioHeader.text = ""
      mp3s[mp3_index].stop();
    }
  });


  const forwardRadio = Button.CreateSimpleButton("forwardRadio", ">>");
  forwardRadio.paddingTop = "40px";
  forwardRadio.paddingLeft = "40px";
  forwardRadio.color = '#fff';
  forwardRadio.fontSizeInPixels = 12;
  forwardRadio.fontWeight = '300';
  forwardRadio.fontSize = "100px";
  forwardRadio.onPointerClickObservable.add(() => {
    let was_playing = false;
    if (mp3s[mp3_index].playing()) {
      was_playing = true;
      radioPlayer.loadedAnimationGroups.forEach((anim) => {
        anim.stop();
      });
      mp3s[mp3_index].stop();
    }

    mp3_index++;
    if (mp3_index >= mp3s.length) {
      mp3_index = 0;
    }
    radioHeader.text = `${mp3s[mp3_index].name}`;
    if (was_playing) {
      radioPlayer.loadedAnimationGroups.forEach((anim) => {
        anim.play();
      });
      mp3s[mp3_index].play();
    }
  });

  const backwardRadio = Button.CreateSimpleButton("backwardRadio", "<<");
  backwardRadio.paddingTop = "40px";
  backwardRadio.paddingLeft = "40px";
  backwardRadio.color = '#fff';
  backwardRadio.fontSizeInPixels = 12;
  backwardRadio.fontWeight = '300';
  backwardRadio.fontSize = "100px";

  backwardRadio.onPointerClickObservable.add(() => {
    let was_playing = false;
    if (mp3s[mp3_index].playing()) {
      was_playing = true;
      radioPlayer.loadedAnimationGroups.forEach((anim) => {
        anim.stop();
      });
      mp3s[mp3_index].stop();
    }

    mp3_index--;
    if (mp3_index < 0) {
      mp3_index = mp3s.length - 1;
    }
    radioHeader.text = `${mp3s[mp3_index].name}`;
    if (was_playing) {
      radioPlayer.loadedAnimationGroups.forEach((anim) => {
        anim.play();
      });
      mp3s[mp3_index].play();
    }
  });
  soundSlider.onValueChangedObservable.add(function (value) {
    mp3s[mp3_index].volume(value);
  });

  panelRadio.addControl(radioHeader);
  panelRadio.addControl(gridRadio);
  gridRadio.addControl(playRadio, 0, 0);
  gridRadio.addControl(backwardRadio, 0, 1);
  gridRadio.addControl(forwardRadio, 0, 2);
  gridRadio.addControl(sliderHeader, 1, 0);
  gridRadio.addControl(soundSlider, 1, 2);


  const assetsManager = new AssetsManager(scene);
  const level = assetsManager.addMeshTask("Gym", "", "/box-up/models/", "gym.glb");

  level.onSuccess = function (task) {
    task.loadedMeshes.forEach((mesh) => {
      if (mesh.name === "Ground") {
        shadowGenerator.addShadowCaster(mesh);
      }
    });
  };

  const radioPlayer = assetsManager.addMeshTask("radio", "", "/box-up/models/", "radio.glb");
  radioPlayer.onSuccess = function (task) {
    task.loadedAnimationGroups.forEach((anim) => {
      anim.stop();
    });
  };


  let destroyedTargetSound = new Howl({
    volume: 0.5,
    html5: true,
    src: "./sounds/break_1.mp3",
    autoplay: false,
    loop: false,
  });

  const yellowSide = assetsManager.addMeshTask("yellow", "", "/box-up/models/", "yellow.glb");
  yellowSide.onSuccess = function (task) {
    task.loadedMeshes.forEach((mesh) => {
      mesh.isVisible = false;
    });
  };

  const yellowSideFracture = assetsManager.addMeshTask("yellow_fracture", "", "/box-up/models/", "yellow_fracture.glb");
  yellowSideFracture.onSuccess = function (task) {
    task.loadedMeshes.forEach((mesh) => {
      if (mesh.name === "__root__") {
        mesh.position.x = 0;
        mesh.rotation.x = Math.PI / 2;
      }
      mesh.isVisible = false;
    });

    task.loadedAnimationGroups.forEach((anim) => {
      anim.stop();
    });

  };



  const blackSide = assetsManager.addMeshTask("black", "", "/box-up/models/", "black.glb");
  blackSide.onSuccess = function (task) {
    task.loadedMeshes.forEach((mesh) => {
      if (mesh.name === "__root__") {
        mesh.position.x = 0;
        mesh.rotation.x = Math.PI / 2;
      }
      mesh.isVisible = false;
    });
  };

  const blackSideFracture = assetsManager.addMeshTask("black_fracture", "", "/box-up/models/", "black_fracture.glb");
  blackSideFracture.onSuccess = function (task) {
    task.loadedMeshes.forEach((mesh) => {
      mesh.isVisible = false;
    });

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

  const shadowGenerator = new ShadowGenerator(1024, dirLight);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.blurKernel = 32;

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

  const upper = MeshBuilder.CreateBox("upper", { width: 1.0, height: 0.5 }, scene);
  upper.material = new StandardMaterial('blackMaterial', scene);
  upper.material.diffuseColor = Color3.Black();
  upper.isVisible = false;
  upper.speed = 0;

  const plane = MeshBuilder.CreatePlane("plane", { size: 1 }, scene);
  plane.position = new Vector3(1, 1.5, 1);
  plane.rotation = new Vector3(0, Math.PI / 9, 0);


  const ComboPlane = MeshBuilder.CreatePlane("ComboPlane", { size: 20 }, scene);
  ComboPlane.position = new Vector3(0, 1.5, -1);
  const advancedTextureComboCounter = AdvancedDynamicTexture.CreateForMesh(
    ComboPlane
  );
  ComboPlane.position = new Vector3(0, 1.5, 10);

  const comboCounter = new TextBlock();
  comboCounter.value = 0;
  comboCounter.isVisible = true;
  comboCounter.text = "COMBO\n\n0";
  comboCounter.width = "100px";
  comboCounter.height = "100px";
  comboCounter.color = "#fff";
  comboCounter.thickness = 4;
  comboCounter.background = "black";
  comboCounter.alpha = 0.8;



  advancedTextureComboCounter.addControl(comboCounter);



  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(
    plane
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

  const gridMenu = new Grid("gridMenu");
  gridMenu.height = "400px"
  gridMenu.addRowDefinition(100, true);
  gridMenu.addRowDefinition(100, true);
  gridMenu.addRowDefinition(100, true);
  gridMenu.addColumnDefinition(500, true)
  gridMenu.addColumnDefinition(500, true)
  gridMenu.addColumnDefinition(500, true)
  gridMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER

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

  const button_5 = Button.CreateSimpleButton("ADJUSTFLOOR", "Adjust floor position");
  button_5.paddingTop = "40px";
  button_5.paddingLeft = "40px";
  button_5.color = '#fff';
  button_5.fontSizeInPixels = 12;
  button_5.fontWeight = '300';
  button_5.fontSize = "40px";


  panel.addControl(gridMenu);
  gridMenu.addControl(button_1, 0, 0);
  gridMenu.addControl(button_2, 1, 0);
  gridMenu.addControl(button_3, 2, 0);

  gridMenu.addControl(button_4, 0, 1);
  gridMenu.addControl(button_5, 1, 1);


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
    if (!allow_click_the_menu) return;
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
    if (!allow_click_the_menu) return;
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
    if (!allow_click_the_menu) return;
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
    if (!allow_click_the_menu) return;
    startTutorial();
  });

  const floorPosition = MeshBuilder.CreateGround("floorPlane", { width: 2, height: 2 }, scene);
  floorPosition.isVisible = false;

  button_5.onPointerDownObservable.add(() => {
    if (!allow_click_the_menu) return;
    if (!floorPosition.isVisible && stopped) {
      const fcp = xr.baseExperience.camera.position
      floorPosition.position.y = fcp.y - 0.5;
      floorPosition.isVisible = true;
      floorPosition.isPressed = true;
      level.loadedMeshes.forEach((mesh) => {
        mesh.isVisible = false;
      });
    }
  });




  const plane2 = MeshBuilder.CreatePlane("plane2", { size: 2 }, scene);
  plane2.position = new Vector3(0, 1.5, 2);
  plane2.isVisible = false;

  const advancedTexture2 = AdvancedDynamicTexture.CreateForMesh(
    plane2
  );
  const panel2 = new StackPanel("panel2");
  advancedTexture2.addControl(panel2);
  const center = new TextBlock();
  center.text = "";
  center.height = "500px";
  center.color = '#fff';
  center.fontSize = "120px";
  panel2.addControl(center);



  function startTutorial() {
   offOnGloves(false, true);
    tutorial = true;
    allow_click_the_menu = false;
    const startTutorialMP3 = new Howl({
      src: ['./sounds/welcome_tutorial.mp3']
    });
    startTutorialMP3.once('load', function () {

      startTutorialMP3.play();
    });

    startTutorialMP3.on('end', function () {
      startFloorFix();
    });
  }


  function startFloorFix() {
    allow_click_the_menu = false;
    const fixFloorPositionMP3 = new Howl({
      src: ['./sounds/adjust_floor.mp3']
    });

    fixFloorPositionMP3.once('load', function () {
      fixFloorPositionMP3.play();
    });

    fixFloorPositionMP3.on('end', function () {
      offOnGloves(true, false);
      allow_click_the_menu = true;
    });
  }



  function JabCross(temp, dist) {
    //jab cross
    for (let i = 0; i < 2; i++) {
      const tb = createBlackTarget();
      const ty = createYellowTarget();
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y - 0.2;
      ty.position.y = pos_y.y - 0.2;
      tb.position.x = 0.1
      ty.position.x = -0.1
      temp.push(tb);
      temp.push(ty);
      tb.position.z += dist + 2;
      ty.position.z += dist;
      tb.speed = 0.03;
      ty.speed = 0.03;
      dist += 4;
    }
    dist += 20;
    targets = temp;
    comobo_tutorial_2 = true;
  }

  function CrossJab(temp, dist) {
    //cross jab
    for (let i = 0; i < 2; i++) {
      const tb = createBlackTarget();
      const ty = createYellowTarget();
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y - 0.2;
      ty.position.y = pos_y.y - 0.2;
      tb.position.x = 0.1
      ty.position.x = -0.1
      temp.push(tb);
      temp.push(ty);
      tb.position.z += dist;
      ty.position.z += dist + 2;
      tb.speed = 0.03;
      ty.speed = 0.03;
      dist += 4;
    }
    dist += 20;
    targets = temp;
    comobo_tutorial_3 = true;
  }

  function UpperCutAndHook(temp, dist) {

    //lead uppercut, rear uppercut
    for (let i = 0; i < 1; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(-0.9, Math.PI / 2 + 0.1, -Math.PI);
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0.9, Math.PI / 2 + 0.1, -Math.PI);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y - 0.3;
      ty.position.y = pos_y.y - 0.3;
      tb.position.x = 0
      ty.position.x = 0
      temp.push(tb);
      temp.push(ty);
      tb.position.z += dist + 6;
      ty.position.z += dist;
      dist += 4;

      tb.speed = 0.03;
      ty.speed = 0.03;
    }
    dist += 20;

    //lead hook, rear hook
    for (let i = 0; i < 1; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(Math.PI / 2 + 0.5, 0, 0);
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(-(Math.PI / 2 + 0.5), 0, 0);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y - 0.2;
      ty.position.y = pos_y.y - 0.2;
      tb.position.x = 0
      ty.position.x = -0.1
      temp.push(tb);
      temp.push(ty);
      ty.position.z += dist + 2;
      tb.position.z += dist + 6;
      dist += 14;
      tb.speed = 0.03;
      ty.speed = 0.03;
    }
    dist += 20;


    //lead uppercut, rear uppercut
    for (let i = 0; i < 1; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(-0.9, Math.PI / 2 + 0.1, -Math.PI);
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0.9, Math.PI / 2 + 0.1, -Math.PI);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y - 0.3;
      ty.position.y = pos_y.y - 0.3;
      tb.position.x = 0
      ty.position.x = 0
      temp.push(tb);
      temp.push(ty);
      tb.position.z += dist + 6;
      ty.position.z += dist;
      dist += 4;

      tb.speed = 0.03;
      ty.speed = 0.03;
    }
    dist += 20;

    //lead hook, rear hook
    for (let i = 0; i < 1; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(Math.PI / 2 + 0.5, 0, 0);
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(-(Math.PI / 2 + 0.5), 0, 0);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y - 0.2;
      ty.position.y = pos_y.y - 0.2;
      tb.position.x = 0
      ty.position.x = -0.1
      temp.push(tb);
      temp.push(ty);
      ty.position.z += dist + 2;
      tb.position.z += dist + 6;
      dist += 14;
      tb.speed = 0.03;
      ty.speed = 0.03;
    }
    dist += 20;
    targets = temp;
    comobo_tutorial_4 = true;
  }

  function SkyHammerSquat(temp, dist) {
    //squad
    for (let i = 0; i < 1; i++) {
      const pos_y = xr.baseExperience.camera.position.clone();
      const up = createUpper();
      up.scaling.z = 3.0;
      up.position.z += dist;
      up.position.y = pos_y.y - 0.2;
      up.speed = 0.03;
      temp.push(up);
      dist += 4 + up.scaling.z;
    }
    dist += 20;
    //lead skycut, rear skycut, left first
    for (let i = 0; i < 1; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(-0.9, Math.PI / 2 + 0.1, -Math.PI);
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0.9, Math.PI / 2 + 0.1, -Math.PI);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y + 0.3;
      ty.position.y = pos_y.y + 0.3;
      tb.position.x = 0.1
      ty.position.x = -0.1
      temp.push(tb);
      temp.push(ty);
      tb.position.z += dist + 4;
      ty.position.z += dist;
      dist += 4;

      tb.speed = 0.03;
      ty.speed = 0.03;
    }
    dist += 20;

    //lead skycut + rear skycut
    for (let i = 0; i < 1; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(-0.9, Math.PI / 2 + 0.1, -Math.PI);
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0.9, Math.PI / 2 + 0.1, -Math.PI);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y + 0.3;
      ty.position.y = pos_y.y + 0.3;
      tb.position.x = 0.2
      ty.position.x = -0.2
      temp.push(tb);
      temp.push(ty);
      tb.position.z += dist;
      ty.position.z += dist;
      dist += 4;

      tb.speed = 0.03;
      ty.speed = 0.03;
    }
    dist += 20;

    //lead skycut, rear skycut, right first
    for (let i = 0; i < 1; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(-0.9, Math.PI / 2 + 0.1, -Math.PI);
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0.9, Math.PI / 2 + 0.1, -Math.PI);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y + 0.3;
      ty.position.y = pos_y.y + 0.3;
      tb.position.x = 0.1
      ty.position.x = -0.1
      temp.push(tb);
      temp.push(ty);
      tb.position.z += dist;
      ty.position.z += dist + 4;
      dist += 4;

      tb.speed = 0.03;
      ty.speed = 0.03;
    }
    dist += 20;

    //lead skycut + rear skycut
    for (let i = 0; i < 1; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(-0.9, Math.PI / 2 + 0.1, -Math.PI);
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0.9, Math.PI / 2 + 0.1, -Math.PI);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y + 0.3;
      ty.position.y = pos_y.y + 0.3;
      tb.position.x = 0.2
      ty.position.x = -0.2
      temp.push(tb);
      temp.push(ty);
      tb.position.z += dist;
      ty.position.z += dist;
      dist += 4;

      tb.speed = 0.03;
      ty.speed = 0.03;
    }
    dist += 20;


    //lead hammer, rear hammer, left first
    for (let i = 0; i < 1; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, -(Math.PI / 2 + 0.1), Math.PI);
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, -(Math.PI / 2 + 0.1), Math.PI);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y - 0.3;
      ty.position.y = pos_y.y - 0.3;
      tb.position.x = 0.1
      ty.position.x = -0.1
      temp.push(tb);
      temp.push(ty);
      tb.position.z += dist + 4;
      ty.position.z += dist;
      dist += 4;

      tb.speed = 0.03;
      ty.speed = 0.03;
    }
    dist += 20;

    //lead hammer + rear hammer
    for (let i = 0; i < 1; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, -(Math.PI / 2 + 0.1), Math.PI);
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, -(Math.PI / 2 + 0.1), Math.PI);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y - 0.3;
      ty.position.y = pos_y.y - 0.3;
      tb.position.x = 0.2
      ty.position.x = -0.2
      temp.push(tb);
      temp.push(ty);
      tb.position.z += dist;
      ty.position.z += dist;
      dist += 4;

      tb.speed = 0.03;
      ty.speed = 0.03;
    }
    dist += 20;

    //lead hammer, rear hammer, right first
    for (let i = 0; i < 1; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, -(Math.PI / 2 + 0.1), Math.PI);
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, -(Math.PI / 2 + 0.1), Math.PI);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y - 0.3;
      ty.position.y = pos_y.y - 0.3;
      tb.position.x = 0.1
      ty.position.x = -0.1
      temp.push(tb);
      temp.push(ty);
      tb.position.z += dist;
      ty.position.z += dist + 4;
      dist += 4;

      tb.speed = 0.03;
      ty.speed = 0.03;
    }
    dist += 20;

    //lead hammer + rear hammer
    for (let i = 0; i < 1; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, -(Math.PI / 2 + 0.1), Math.PI);
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, -(Math.PI / 2 + 0.1), Math.PI);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y - 0.3;
      ty.position.y = pos_y.y - 0.3;
      tb.position.x = 0.2
      ty.position.x = -0.2
      temp.push(tb);
      temp.push(ty);
      tb.position.z += dist;
      ty.position.z += dist;
      dist += 4;

      tb.speed = 0.03;
      ty.speed = 0.03;
    }
    dist += 20;
    targets = temp;
    comobo_tutorial_5 = true;


  }



  function create_combo_tutorial() {


    combo_tutorial = true;
    offOnGloves(false, true);
    plane.isVisible = false;
    comobo_tutorial_1 = true;
  }

  function create_combo_1() {

    let dist = 0;
    let temp = [];
    // for (let i = 0; i < 4; i++) {
    //   const tb = createBlackTarget();
    //   const ty = createYellowTarget();
    //   const pos_y = xr.baseExperience.camera.position.clone();
    //   tb.position.y = pos_y.y - 0.2;
    //   ty.position.y = pos_y.y - 0.2;
    //   tb.position.x = 0.1
    //   ty.position.x = -0.1
    //   temp.push(tb);
    //   temp.push(ty);
    //   tb.position.z += dist;
    //   ty.position.z += dist + 2;
    //   dist += 4;
    // }
    // dist += 10;

    // for (let i = 0; i < 4; i++) {
    //   const tb = createBlackTarget();
    //   const ty = createYellowTarget();
    //   tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(Math.PI / 2 + 0.5, 0, 0);
    //   ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(-Math.PI / 2 - 0.5, 0, 0);
    //   const pos_y = xr.baseExperience.camera.position.clone();
    //   tb.position.y = pos_y.y - 0.2;
    //   ty.position.y = pos_y.y - 0.2;
    //   temp.push(ty);
    //   temp.push(tb);
    //   tb.position.z += dist;
    //   ty.position.z += dist + 2;
    //   dist += 4;
    // }
    // dist += 10;
    // for (let i = 0; i < 4; i++) {
    //   const tb = createBlackTarget();
    //   const ty = createYellowTarget();
    //   tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, -Math.PI / 2 - 0.5, Math.PI);
    //   ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, -Math.PI / 2 - 0.5, Math.PI);
    //   const pos_y = xr.baseExperience.camera.position.clone();
    //   tb.position.y = pos_y.y - 0.2 - 0.5;
    //   ty.position.y = pos_y.y - 0.2 - 0.5;
    //   tb.position.x = 0.1
    //   ty.position.x = -0.1
    //   temp.push(ty);
    //   temp.push(tb);
    //   tb.position.z += dist;
    //   ty.position.z += dist + 2;
    //   dist += 4;
    // }
    // dist += 10;

    // for (let i = 0; i < 4; i++) {
    //   const tb = createBlackTarget();
    //   const ty = createYellowTarget();
    //   const pos_y = xr.baseExperience.camera.position.clone();
    //   tb.position.y = pos_y.y - 0.2;
    //   ty.position.y = pos_y.y - 0.2;
    //   tb.position.x = 0.1
    //   ty.position.x = -0.1
    //   temp.push(tb);
    //   temp.push(ty);
    //   tb.position.z += dist;
    //   ty.position.z += dist + 2;
    //   dist += 14;
    // }

    // dist += 10;

    //jab jab rear hook
    for (let i = 0; i < 4; i++) {
      const tb = createBlackTarget();
      tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(Math.PI / 2 + 0.5, 0, 0);
      const ty = createYellowTarget();
      const ty2 = createYellowTarget();
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y - 0.2;
      ty.position.y = pos_y.y - 0.2;
      ty2.position.y = pos_y.y - 0.2;
      tb.position.x = 0
      ty.position.x = -0.1
      ty2.position.x = -0.1
      temp.push(tb);
      temp.push(ty);
      temp.push(ty2);
      ty.position.z += dist + 2;
      ty2.position.z += dist + 4;
      tb.position.z += dist + 6;
      dist += 14;
      tb.speed = globalSpeed;
      ty.speed = globalSpeed;
      ty2.speed = globalSpeed;
    }
    dist += 10;

    //cross cross lead hook
    for (let i = 0; i < 4; i++) {
      const tb = createBlackTarget();
      const tb2 = createBlackTarget();
      const ty = createYellowTarget();
      ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(-(Math.PI / 2 + 0.5), 0, 0);
      const pos_y = xr.baseExperience.camera.position.clone();
      tb.position.y = pos_y.y - 0.3;
      tb2.position.y = pos_y.y - 0.3;
      ty.position.y = pos_y.y - 0.3;
      tb.position.x = 0.1
      tb2.position.x = 0.1
      ty.position.x = 0
      temp.push(tb);
      temp.push(ty);
      temp.push(tb2);


      tb.position.z += dist + 2;
      tb2.position.z += dist + 4;
      ty.position.z += dist + 6;
      dist += 14;
    }

    // dist += 10;
    // //uppercut left first
    // for (let i = 0; i < 4; i++) {
    //   const tb = createBlackTarget();
    //   const ty = createYellowTarget();
    //   tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(-0.9, Math.PI / 2 + 0.1, -Math.PI);
    //   ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0.9, Math.PI / 2 + 0.1, -Math.PI);
    //   const pos_y = xr.baseExperience.camera.position.clone();
    //   tb.position.y = pos_y.y - 0.3;
    //   ty.position.y = pos_y.y - 0.3;
    //   temp.push(ty);
    //   temp.push(tb);
    //   tb.position.z += dist + 2;
    //   ty.position.z += dist;
    //   dist += 4;
    // }

    // dist += 10;
    // //upper cut right first
    // for (let i = 0; i < 4; i++) {
    //   const tb = createBlackTarget();
    //   const ty = createYellowTarget();
    //   tb.rotationQuaternion = Quaternion.RotationYawPitchRoll(-0.9, Math.PI / 2 + 0.1, -Math.PI);
    //   ty.rotationQuaternion = Quaternion.RotationYawPitchRoll(0.9, Math.PI / 2 + 0.1, -Math.PI);
    //   const pos_y = xr.baseExperience.camera.position.clone();
    //   tb.position.y = pos_y.y - 0.3;
    //   ty.position.y = pos_y.y - 0.3;
    //   temp.push(ty);
    //   temp.push(tb);
    //   tb.position.z += dist;
    //   ty.position.z += dist + 2;
    //   dist += 4;
    // }
    targets = temp;
  }


  function createYellowTarget() {
    const newTellowTarget = yellowSide.loadedMeshes[0].instantiateHierarchy();
    newTellowTarget.name = "yellow";
    newTellowTarget.dts = destroyedTargetSound;
    newTellowTarget.position.copyFrom(pos);
    newTellowTarget.position.y -= 0.2;
    newTellowTarget.position.z += 10;
    newTellowTarget.position.x -= 0.1;
    newTellowTarget.isVisible = true;
    newTellowTarget.speed = globalSpeed;
    shadowGenerator.addShadowCaster(newTellowTarget);
    return newTellowTarget;
  }

  function createBlackTarget() {
    const newBlackTarget = blackSide.loadedMeshes[0].instantiateHierarchy();
    newBlackTarget.dts = destroyedTargetSound;
    newBlackTarget.name = "black";
    newBlackTarget.position.copyFrom(pos);
    newBlackTarget.rotation.x = Math.PI / 2;
    newBlackTarget.position.y -= 0.2;
    newBlackTarget.position.z += 10;
    newBlackTarget.position.x += 0.1;
    newBlackTarget.isVisible = true;
    newBlackTarget.speed = globalSpeed;
    shadowGenerator.addShadowCaster(newBlackTarget);
    return newBlackTarget;
  }


  function createUpper() {
    const newUpper = upper.createInstance("upper");
    newUpper.position.copyFrom(pos);
    newUpper.position.z += 10;
    newUpper.isVisible = true;
    newUpper.speed = globalSpeed;
    return newUpper;
  }



  let timerInterval = null;

  function getTimer(sec) {
    if (stopped) {
      plane.isVisible = false;
      comboCounter.text = "COMBO\n\n0";
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        if (!plane2.isVisible) plane2.isVisible = true;
        center.text = sec.toString();
        if (sec <= 0) {
          pos.copyFrom(xr.baseExperience.camera.position);
          center.text = "Go!";
          clearInterval(timerInterval);
          setTimeout(() => {
            if (info.difficulty === "Easy") {
              globalSpeed = 0.03;

              create_combo_1();


            }
            // else if (info.difficulty === "Medium") {
            //   globalSpeed = 0.04;
            //   create_combo_1();
            // } else if (info.difficulty === "Hard") {
            //   globalSpeed = 0.05;
            //   create_combo_1();
            // }
            plane2.isVisible = false;

            center.text = "";
            stopped = false;
          }, 1000);
        }
        sec--;
      }, 1000);
    } else {
      clearInterval(timerInterval);
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




  function OkFloorAdjust() {
    const okFloor = new Howl({
      src: ['./sounds/continue_tutorial.mp3']
    });
    okFloor.once('load', function () {
      okFloor.play();
    });

    okFloor.on('end', function () {

    });
  }


  function openMenu() {

    stopped = true;
    startTime = performance.now();
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
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




  const leftCollision = MeshBuilder.CreateSphere("dummyCam", { diameter: 0.25 }, scene, true);
  leftCollision.isVisible = false;
  leftCollision.showBoundingBox = true;
  const rightCollision = MeshBuilder.CreateSphere("dummyCam2", { diameter: 0.25 }, scene, true);
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
            target.speed = 0;
            target.dts.play();
            target.dispose();
            targets.splice(targets.indexOf(target), 1);
            yellowSideFracture.loadedMeshes.forEach((mesh) => {
              mesh.isVisible = true;
              if (mesh.name === "__root__") {
                mesh.position = target.position;
                mesh.rotationQuaternion = target.rotationQuaternion;
              }
            });
            const fracture = yellowSideFracture.loadedMeshes[0].instantiateHierarchy();
            fracture.animations = yellowSideFracture.loadedAnimationGroups;


            if (left.velocity.length() > 0.9) {
              comboCounter.text = `COMBO\n\n${(comboCounter.value += 1).toString()}`;
            }

            if (fracture.animations) {
              fracture.animations.forEach((anim) => {
                if (!anim.isPlaying) {
                  anim.play();
                }
                anim.onAnimationEndObservable.addOnce(() => {
                  yellowSideFracture.loadedMeshes.forEach((mesh) => {
                    mesh.isVisible = false;
                  });
                });
              });
            }
            fracture.dispose();
          }
        }
        if (rightCollision.intersectsMesh(target, true)) {
          if (target.name === "black") {
            target.speed = 0;
            target.dts.play();
            target.dispose();
            targets.splice(targets.indexOf(target), 1);
            blackSideFracture.loadedMeshes.forEach((mesh) => {
              mesh.isVisible = true;
              if (mesh.name === "__root__") {
                mesh.position = target.position;
                mesh.rotationQuaternion = target.rotationQuaternion;
              }
            });
            const fracture = blackSideFracture.loadedMeshes[0].instantiateHierarchy();
            fracture.animations = blackSideFracture.loadedAnimationGroups;
            if (right.velocity.length() > 0.9) {
              comboCounter.text = `COMBO\n\n${(comboCounter.value += 1).toString()}`;
            }

            if (fracture.animations) {
              fracture.animations.forEach((anim) => {

                if (!anim.isPlaying) {
                  anim.play();
                }
                anim.onAnimationEndObservable.addOnce(() => {
                  blackSideFracture.loadedMeshes.forEach((mesh) => {
                    mesh.isVisible = false;
                  });
                });

              });
            }
            fracture.dispose();

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
        const A_OR_X = motionController.getComponent(ids[3]);
        const B_OR_Y = motionController.getComponent(ids[4]);

        [A_OR_X, B_OR_Y].forEach((button) => {
          button.onButtonStateChangedObservable.add(() => {
            if (button.pressed && stopped && tutorial && !combo_tutorial && allow_click_the_menu) {
              create_combo_tutorial();
            }
          });
        });

        thumb_stick.onButtonStateChangedObservable.add(() => {
          if (thumb_stick.pressed && !floorPosition.isVisible && !tutorial) {
            if (stopped) {
              if (floorPosition.isVisible) {
                floorPosition.parent = null;
                floorPosition.isVisible = false;
              }
              if (timerInterval) {
                plane.isVisible = true;
                if (plane2.isVisible) plane2.isVisible = false;
                center.text = "";
                clearInterval(timerInterval);
                timerInterval = null;
                offOnGloves(true, false);
              } else {
                offOnGloves(false, true);
                getTimer(1);
              }
            } else {
              openMenu();
            }
          }
        });

        trigger.onButtonStateChangedObservable.add(() => {

          if (trigger.pressed && stopped && allow_click_the_menu) {

            target = scene.meshUnderPointer;
            if (xr.pointerSelection.getMeshUnderPointer) {
              target = xr.pointerSelection.getMeshUnderPointer(controller.uniqueId);
            }
            if (target && target.name === "plane" && target.parent === null && !floorPosition.isVisible) {
              target.setParent(motionController.rootMesh);
            }
          } else if (stopped && allow_click_the_menu) {
            if (plane.parent) {
              plane.setParent(null);
            }

            if (target) {

              if (target.name === "Circle" && !floorPosition.isVisible) {
                xr.baseExperience.camera.position.x = 0;
                xr.baseExperience.camera.position.z = 0;
              }

              if (target.name.startsWith("Circle.00") && !floorPosition.isVisible) {
                xr.baseExperience.camera.position.x = -target.position.x;
                xr.baseExperience.camera.position.z = target.position.z;
              }

              target = null;
            }

            if (floorPosition.isVisible && !plane.isVisible) {

              floorPosition.isPressed = false;
              localStorage.setItem('info', JSON.stringify(info));

              [level, radioPlayer].forEach((task) => {
                task.loadedMeshes.forEach((mesh) => {
                  mesh.isVisible = true;
                  if (mesh.name === "__root__") {
                    mesh.position.y = info.floorPosition;
                  }
                });
              });
              plane2.position.y = info.floorPosition + 1.5;
              ComboPlane.position.y = info.floorPosition + 1.5;
              radioPlane.position.y = info.floorPosition + 1.5;
              plane.position.y = info.floorPosition + 1.5;
              plane.isVisible = true;
              floorPosition.parent = null;
              floorPosition.isVisible = false;
              if (tutorial) {
                OkFloorAdjust();
              }
            }
          }
        });

        if (motionController.handness === 'left' && motionController.handness === 'right') {
          comboCounter.isVisible = true;
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


  assetsManager.onFinish = function (tasks) {



    let leftPreviousPosition = null;
    let leftPreviousTime = null;
    
    let rightPreviousPosition = null;
    let rightPreviousTime = null;
    let paused = false;

    engine.runRenderLoop(() => {
      scene.render();

      const now = performance.now();

      let timeLeft = 0;
      if (paused && targets.length === 0) {
        if (!stopped) {
          timeLeft = 30 - Math.floor((now - startTime) / 1000);
        }
        center.text = timeLeft.toString();
        if (timeLeft <= 0) {
          if (progression === 0) {

            create_combo_1();
          }
          // else if (progression === 1) {
          //   create_combo_1();
          // } else if (progression === 2) {
          //   create_combo_1();
          // } else if (progression === 3) {
          //   create_combo_1();
          // }

          plane2.isVisible = false;
          paused = false;
          progression++;
        }
      } else if (targets.length === 0 && !paused && !stopped) {
        timeLeft = 0;
        paused = true;
        plane2.isVisible = true;
        startTime = performance.now();
      }

      if (leftController) {
        const currentTime = performance.now();
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

        if (floorPosition.isVisible && !plane.isVisible && floorPosition.isPressed) {

          if (floorPosition.position.y >= (currentPosition.y - 0.05)) {
            let targetPosition = new Vector3(0, currentPosition.y, 0);
            floorPosition.position.y = Scalar.Lerp(floorPosition.position.y, targetPosition.y, 0.3);
            floorPosition.position.x = Scalar.Lerp(floorPosition.position.x, targetPosition.x, 0.3);
            floorPosition.position.z = Scalar.Lerp(floorPosition.position.z, targetPosition.z, 0.3);
            info.floorPosition = floorPosition.getAbsolutePosition().y - 0.05;
          }
        }

        leftPreviousPosition = currentPosition;
        leftPreviousTime = currentTime;
      }

      if (rightController) {
        const currentTime = performance.now();
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

        if (floorPosition.isVisible && !plane.isVisible && floorPosition.isPressed) {

          if (floorPosition.position.y >= (currentPosition.y - 0.05)) {
            let targetPosition = new Vector3(0, currentPosition.y, 0);
            floorPosition.position.y = Scalar.Lerp(floorPosition.position.y, targetPosition.y, 0.3);
            floorPosition.position.x = Scalar.Lerp(floorPosition.position.x, targetPosition.x, 0.3);
            floorPosition.position.z = Scalar.Lerp(floorPosition.position.z, targetPosition.z, 0.3);
            info.floorPosition = floorPosition.getAbsolutePosition().y - 0.05;
          }
        }

        rightPreviousPosition = currentPosition;
        rightPreviousTime = currentTime;
      }


      if ((targets.length > 0 && !stopped) || (targets.length > 0 && tutorial)) {

        targets.forEach(target => {
          const delta = engine.getDeltaTime() / 1000;
          target.position.z = Scalar.Lerp(target.position.z, -100, target.speed * delta);
          if (target.position.z <= -1) {
            target.dispose();
            targets.splice(targets.indexOf(target), 1);
          }
        });

      } else if ((targets.length > 0 && stopped || tutorial)) {
        for (let i = targets.length - 1; i >= 0; i--) {
          const target = targets[i];
          target.dispose();
          targets.splice(i, 1);
        }
      }
      if (tutorial && targets.length === 0) {
        let dist = 0;
        let temp = [];
        if(comobo_tutorial_1){
          comobo_tutorial_1 = false;
          const combo3MP3 = new Howl({
            src: ['./sounds/left_right_punches.mp3']
          });
          combo3MP3.once('load', function () {
            combo3MP3.play();
          });
    
          combo3MP3.on('end', function () {
            JabCross(temp, dist);
          });
        
        }
        else if(comobo_tutorial_2){
          comobo_tutorial_2 = false;
          const combo3MP3 = new Howl({
            src: ['./sounds/right_left_punches.mp3']
          });
    
    
          combo3MP3.once('load', function () {
            combo3MP3.play();
          });
    
          combo3MP3.on('end', function () {
            CrossJab(temp, dist);
          });
   
        }
        else if(comobo_tutorial_3){
          comobo_tutorial_3 = false;
          const combo4MP3 = new Howl({
            src: ['./sounds/uppercut_hook.mp3']
          });
    
          combo4MP3.once('load', function () {
            combo4MP3.play();
          });
    
          combo4MP3.on('end', function () {
        
            UpperCutAndHook(temp, dist);
          });
     
        }else if (comobo_tutorial_4) {
          comobo_tutorial_4 = false;



          const combo5MP3 = new Howl({
            src: ['./sounds/squat_sky_hammer.mp3']
          });
    
          combo5MP3.once('load', function () {
            combo5MP3.play();
          });
    
          combo5MP3.on('end', function () {
        
            SkyHammerSquat(temp, dist);
          });


        }else if(comobo_tutorial_5){
          comobo_tutorial_5 = false;
          const end_tutorialMP3 = new Howl({
            src: ['./sounds/end_tutorial.mp3']
          });
          
          end_tutorialMP3.once('load', function () {
            end_tutorialMP3.play();
          });
        
          end_tutorialMP3.on('end', function () {
            offOnGloves(true, false);
            allow_click_the_menu = true;
            plane.isVisible = true;
            tutorial = false;
          });
        }
  
      }
    });
  };
  assetsManager.load();
}


run()
  .then(() => {
    document.getElementsByClassName("xr-button-overlay")[0].style.display = "block";
  })
  .catch((err) => {
    console.log(err);
  });
