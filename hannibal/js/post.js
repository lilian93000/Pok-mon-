/* Rendu « cinéma » : anticrénelage multiéchantillonné, halo des reflets, tonalité,
   étalonnage chaud, vignettage et grain très léger. */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const Grade = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uWarm: { value: 1 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes; uniform float uWarm; varying vec2 vUv;
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      c = mix(c, c * c * (3.0 - 2.0 * c), 0.16);
      float l = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(vec3(l), c, 1.07);
      c *= mix(vec3(1.0), vec3(1.025, 1.0, 0.965), uWarm);
      vec2 d = (vUv - 0.5) * vec2(1.0, 0.82);
      c *= 1.0 - 0.55 * dot(d, d);
      float g = fract(sin(dot(vUv * uRes + fract(uTime) * 91.7, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
      c += g * 0.010;
      gl_FragColor = vec4(c, 1.0);
    }`,
};

export class Post {
  constructor(renderer, scene, camera, q) {
    this.r = renderer;
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    const rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: q.msaa || 0 });
    this.composer = new EffectComposer(renderer, rt);
    this.render0 = new RenderPass(scene, camera);
    this.composer.addPass(this.render0);
    if (q.bloom) this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(size.x / 2, size.y / 2), 0.16, 0.45, 0.92));
    this.composer.addPass(new OutputPass());
    this.grade = new ShaderPass(Grade);
    this.composer.addPass(this.grade);
  }
  setScene(scene) { this.render0.scene = scene; }
  resize() {
    this.composer.setPixelRatio(this.r.getPixelRatio());
    this.composer.setSize(innerWidth, innerHeight);
    const s = this.r.getDrawingBufferSize(new THREE.Vector2());
    this.grade.uniforms.uRes.value.copy(s);
  }
  render(t) { this.grade.uniforms.uTime.value = t; this.composer.render(); }
}
