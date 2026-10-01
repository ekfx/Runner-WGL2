export class Mesh {
  #VAO;
  #VBO;
  #gl;

  // voce deve atribuir os ponteiros do buffer
  // deixei sem essa automação porque falta  pouco tempo pra entregar
  create(gl, data) {
    this.#gl = gl;

    this.#VAO = this.#gl.createVertexArray();
    this.#VBO = this.#gl.createBuffer();
    this.#gl.bindVertexArray(this.#VAO);

    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#VBO);
    this.#gl.bufferData(this.#gl.ARRAY_BUFFER, data, this.#gl.STATIC_DRAW);
  }

  bindVAO(number) {
    if (number) {
      this.#gl.bindVertexArray(this.#VAO);
    } else {
      this.#gl.bindVertexArray(null);
    }
  }

  bindVBO(number) {
    if (number) {
      this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#VBO);
    } else {
      this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, null);
    }
  }

  getVAO() {
    return this.#VAO;
  }

  getVBO() {
    return this.#VBO;
  }
}
