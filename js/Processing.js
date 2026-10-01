import { mat4, vec3, quat } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/+esm';

export function getMVP(model, view, projection) {
  let pv = mat4.create();
  mat4.multiply(pv, projection, view);
  let MVP = mat4.create();
  mat4.multiply(MVP, pv, model);
  return MVP;
}

export function toRadians(degrees) {
  return (degrees * Math.PI / 180.0);
}

export function is_same_v(T1, T2) {
  if (T1 === null || T2 === null || T1 === undefined || T2 === undefined) {
    return T1 === T2;
  }
  return T1.constructor === T2.constructor;
}

// nao funciona pra objetos do glmatrix pq internamente sao Float32Array
export function is_from_v(T1, C1) {
  if (T1 === null || T1 === undefined) {
    return false;
  }

  return T1.constructor === C1;
}
