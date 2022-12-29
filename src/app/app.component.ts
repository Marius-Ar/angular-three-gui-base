import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('canvas')
  private canvasRef: ElementRef;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private rotationIncrement = 0.005;

  private camera: THREE.PerspectiveCamera;
  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshLambertMaterial( { color: 0xf0f000 } );

  private ambientLight = new THREE.AmbientLight(0xffffff, 1);
  private directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  private cube = new THREE.Mesh(this.geometry, this.material);

  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();

  private controls: OrbitControls;
  private gui = new dat.GUI({ name: 'Debug' });

  ngAfterViewInit(): void {
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.createGuiControls();
    this.createScene();
    this.startRendering();
  }

  private createScene() {
    this.directionalLight.lookAt(this.cube.position);
    this.scene.add(this.directionalLight);

    this.scene.add(this.ambientLight);

    this.scene.add(this.cube);
    this.scene.background = new THREE.Color(0xffffff);
    this.camera = new THREE.PerspectiveCamera( 75, this.getAspectRatio(), 0.1, 1000 );
    this.camera.position.z = 5;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRendering() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    const component = this;
    (function render() {
      requestAnimationFrame(render);
      component.controls.update();
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }

  private animateCube() {
    this.cube.rotation.x += this.rotationIncrement;
    this.cube.rotation.y += this.rotationIncrement;
  }

  private createGuiControls() {
    const cubeFolder = this.gui.addFolder('Cube');
    cubeFolder.add(this, 'rotationIncrement', 0, 0.5);
    cubeFolder.add(this.cube.material.color, 'r', 0, 1);
    cubeFolder.add(this.cube.material.color, 'g', 0, 1);
    cubeFolder.add(this.cube.material.color, 'b', 0, 1);

    const lightsFolder = this.gui.addFolder('Lights');
    const ambientLightFolder = lightsFolder.addFolder('Ambient');
    ambientLightFolder.add(this.ambientLight, 'intensity', 0, 1);
    const ambientLightColorFolder = ambientLightFolder.addFolder('Color');
    ambientLightColorFolder.add(this.ambientLight.color, 'r', 0, 1);
    ambientLightColorFolder.add(this.ambientLight.color, 'g', 0, 1);
    ambientLightColorFolder.add(this.ambientLight.color, 'b', 0, 1);

    const directionalLightFolder = lightsFolder.addFolder('Directional');
    directionalLightFolder.add(this.directionalLight, 'intensity', 0, 1);
    const directionalLightColorFolder = directionalLightFolder.addFolder('Color');
    directionalLightColorFolder.add(this.directionalLight.color, 'r', 0, 1);
    directionalLightColorFolder.add(this.directionalLight.color, 'g', 0, 1);
    directionalLightColorFolder.add(this.directionalLight.color, 'b', 0, 1);

    const directionalLightPositionFolder = directionalLightFolder.addFolder('Position');
    directionalLightPositionFolder.add(this.directionalLight.position, 'x', -10, 10);
    directionalLightPositionFolder.add(this.directionalLight.position, 'y', -10, 10);
    directionalLightPositionFolder.add(this.directionalLight.position, 'z', -10, 10);
  }
}
