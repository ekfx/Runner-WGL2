import { Mesh } from './Mesh.js'
import { Shader } from './Shader.js';
import { toRadians, getMVP, } from './Processing.js';
import { mat4, vec3, quat, vec4 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/+esm';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const vertices = new Float32Array([
  -0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 0.5, -0.5, -0.5, 0.0, 0.0, -1.0,
  0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
  -0.5, 0.5, -0.5, 0.0, 0.0, -1.0, -0.5, -0.5, -0.5, 0.0, 0.0, -1.0,

  -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
  0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
  -0.5, 0.5, 0.5, 0.0, 0.0, 1.0, -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,

  -0.5, 0.5, 0.5, -1.0, 0.0, 0.0, -0.5, 0.5, -0.5, -1.0, 0.0, 0.0,
  -0.5, -0.5, -0.5, -1.0, 0.0, 0.0, -0.5, -0.5, -0.5, -1.0, 0.0, 0.0,
  -0.5, -0.5, 0.5, -1.0, 0.0, 0.0, -0.5, 0.5, 0.5, -1.0, 0.0, 0.0,

  0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 0.5, 0.5, -0.5, 1.0, 0.0, 0.0,
  0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.5, -0.5, -0.5, 1.0, 0.0, 0.0,
  0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.5, 0.5, 0.5, 1.0, 0.0, 0.0,

  -0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 0.5, -0.5, -0.5, 0.0, -1.0, 0.0,
  0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
  -0.5, -0.5, 0.5, 0.0, -1.0, 0.0, -0.5, -0.5, -0.5, 0.0, -1.0, 0.0,

  -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
  0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
  -0.5, 0.5, 0.5, 0.0, 1.0, 0.0, -0.5, 0.5, -0.5, 0.0, 1.0, 0.0
]);

////////////////////////////////////////////////////////////
// Initializing data
////////////////////////////////////////////////////////////

let Actor = new Mesh;
let MeshShader;

let model = mat4.create();
let view = mat4.create();
let projection = mat4.create();

let Color = vec3.fromValues(0.7, 0.3, 0.9);


export function Initialize(gl) {
  ////////////////////////////////////////////////////////////
  // Buffers
  ////////////////////////////////////////////////////////////
  Actor.create(gl, vertices);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  Actor.bindVAO(false);
  Actor.bindVBO(false);

  ////////////////////////////////////////////////////////////
  // Shaders
  ////////////////////////////////////////////////////////////

  MeshShader = new Shader(gl, "shaders/vertexShader.glsl", "shaders/fragmentShader.glsl");
}

////////////////////////////////////////////////////////////
// Render Function
////////////////////////////////////////////////////////////

let lightPos = vec3.fromValues(0.0, 0.0, 0.0);
let lightColor = vec3.fromValues(1.0, 1.0, 1.0);
//let objectColor = vec3.fromValues(0.8, 0.2, 0.6);
let objectColor = vec3.fromValues(1.0, 1.0, 1.0);

class Object {
  model = mat4.create();
  trans = vec3.create();

  constructor(pos, trans, rot) {
    mat4.identity(this.model);
    mat4.translate(this.model, this.model, pos);
    mat4.rotate(this.model, this.model, rot[3], [rot[0], rot[1], rot[2]]);
    mat4.scale(this.model, this.model, trans);
    this.trans = vec3.clone(trans);
  }

  update(pos, trans, rot) {
    mat4.identity(this.model);
    mat4.translate(this.model, this.model, pos);
    mat4.rotate(this.model, this.model, toRadians(rot[3]), [rot[0], rot[1], rot[2]]);
    mat4.scale(this.model, this.model, trans);
    this.trans = vec3.clone(trans);
  }
}

let longestBox = 300.0;
const Models = [
  new Object([-2.5, 0.0, 0.0], [0.25, 10.0, 20000.0], [0.0, 0.0, 0.0, 0.0]), // parede esqeurda
  new Object([+2.5, 0.0, 0.0], [0.25, 10.0, 20000.0], [0.0, 0.0, 0.0, 0.0]), // aparede direita
  new Object([0.0, -2.5, 0.0], [5.0, 0.25, 20000.0], [0.0, 0.0, 0.0, 0.0]), // chao
  new Object([0.0, +5.0, 0.0], [5.0, 0.25, 20000.0], [0.0, 0.0, 0.0, 0.0]), // teto
  new Object([0.0, 0.0, -1.0], [5.0, 10.0, 1.0], [1.0, 0.0, 0.0, 0.0]), // parede inicial
];

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

for (let i = 0; i < 10000; i++) {
  Models.push(new Object([randRange(-2.5, 2.5), randRange(-2.0, 10.0), randRange(0, 10000)], [randRange(0, 2), randRange(0, 2), randRange(0, 2)], [0.0, 0.0, 0.0, 0.0]));
}

//////////////////////////////////////////////////////////////////////////////////
// Atributos do jofador
let pStat = true; // true rodando e false parado
let PlayerModel = new Object([0.0, 0.0, 0.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0, 0.0]);
let pPos = vec3.fromValues(0.0, 0.0, 0.0);
let pRot = vec4.fromValues(0.0, 1.0, 0.0, 180.0);
let pVel = 9.0;
let pRotVel = 2.5;
let objIndex = 0;
let pCollision = vec3.fromValues(0.5, 0.5, 0.5);

export function Render(gl, delta) {
  Actor.bindVAO(true);
  MeshShader.use();

  // Player
  mat4.identity(view);
  if (pStat) {
    pPos[2] += delta * pVel;
  }
  PlayerModel.update(pPos, [1.0, 1.0, 1.0], pRot);

  lightPos = pPos;
  MeshShader.setUniform("lightPos", lightPos);

  view = mat4.clone(PlayerModel.model);
  mat4.invert(view, view);
  MeshShader.setUniform("view", view);

  // projeecao
  mat4.identity(projection);
  mat4.perspective(projection, toRadians(120), CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 100.0);
  MeshShader.setUniform("projection", projection);

  /// Luz
  MeshShader.setUniform("lightColor", lightColor);

  pVel += Math.sin(Math.random()) * delta * delta;
  if (pPos[2] >= 10000) {
    pPos[2] = 2.0;
  }

  objIndex = 0;
  setPoints(pPos[2]);
  Models.forEach(m => {

    if ((pPos[2] <= m.model[14] + pCollision[2]) && (pPos[2] >= m.model[14] - pCollision[2])) {
      if ((pPos[0] <= m.model[12] + pCollision[0]) && (pPos[0] >= m.model[12] - pCollision[0]) &&
        (pPos[1] <= m.model[13] + pCollision[1]) && (pPos[1] >= m.model[13] - pCollision[1])) {
        setGame(false);
        pStat = false;
      }
    }

    objIndex++;
    if (objIndex > 4) {
      // objectColor = vec3.fromValues(m.model[12] + 1.0, m.model[13] + 1.0, m.model[13] + 1.0);
      const hue = (objIndex * 0.618) % 1.0;
      objectColor = vec3.fromValues(
        0.5 + 0.5 * Math.sin(hue * 6.28),
        0.5 + 0.5 * Math.sin(hue * 6.28 + 2.09),
        0.5 + 0.5 * Math.sin(hue * 6.28 + 4.18)
      );
    } else {
      if (objIndex === 3 || objIndex === 4)
        objectColor = [0.7, 0.0, 0.0];
      else
        objectColor = [1.0, 1.0, 1.0];
    }

    MeshShader.setUniform("model", m.model);
    MeshShader.setUniform("objectColor", objectColor);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  });

}

export function Input(keys, delta) {

  if (keys['r']) {
    pPos[2] = 0.0;
    setGame(true);
    pStat = true;
    pVel = 9.0;
  }
  if (pStat) {
    if (keys['w']) {
      if (pPos[1] <= 3.0)
        pPos[1] += pVel * delta;
    } else if (keys['s']) {
      if (pPos[1] >= -2.0)
        pPos[1] -= pVel * delta;
    } else {
      pPos[1] *= 0.70;
    }

    if (keys['a']) {
      if (pPos[0] <= 2.0)
        pPos[0] += pVel * delta;
    } else if (keys['d']) {
      if (pPos[0] >= -2.0)
        pPos[0] -= pVel * delta;
    } else {
      pPos[0] *= 0.70;
    }

    if (keys['x']) {
      pVel += 2.0 * delta;
    }
  }
}

function setPoints(pt) {
  document.getElementById("gamePoints").textContent = String(Math.floor(pt) + "pt");
}

function setGame(state) {
  if (state)
    document.getElementById("gameStatus").textContent = "Running.";
  else
    document.getElementById("gameStatus").textContent = "Fail. Press R to restart.";
}
