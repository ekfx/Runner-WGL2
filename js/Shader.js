import { is_same_v, is_from_v } from "./Processing.js";
import { mat4, vec3, vec4, quat } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/+esm';

export class Shader {
  #gl;
  #sProgram;
  #location = new Map();

  #inFile(path) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send(null);

    if (xhr.status === 200) {
      return xhr.responseText.replace(/^\uFEFF/, '').trim();
    } else {
      console.error(`Cannot load file: ${path}.\n`);
      return null;
    }
  }


  #createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;

    } else {
      return shader;
    }
  }

  #createProgram(gl, vertex, fragment) {
    let program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Unable to initialize the shader program: ", gl.getProgramInfoLog(program));
      return null;

    } else {
      return program;
    }
  }


  constructor(glObject, vspath, fspath) {
    this.#gl = glObject;

    let vsSource = this.#inFile(vspath);
    let fsSource = this.#inFile(fspath);

    let vertShader = this.#createShader(this.#gl, this.#gl.VERTEX_SHADER, vsSource);
    let fragShader = this.#createShader(this.#gl, this.#gl.FRAGMENT_SHADER, fsSource);

    this.#sProgram = this.#createProgram(this.#gl, vertShader, fragShader);
  }

  setUniform(name, value) {
    this.#gl.useProgram(this.#sProgram);

    let loc_t = this.#location.get(name);

    if (loc_t === undefined) {
      loc_t = this.#gl.getUniformLocation(this.#sProgram, name);
      this.#location.set(name, loc_t);
    }

    if (value.length === 16) {
      this.#gl.uniformMatrix4fv(loc_t, false, value);
    } else if (value.length === 3) {
      this.#gl.uniform3fv(loc_t, value);
    } else if (value.length === 4) {
      this.#gl.uniform4fv(loc_t, value);
    }
  }

  use() {
    this.#gl.useProgram(this.#sProgram);
  }
}
