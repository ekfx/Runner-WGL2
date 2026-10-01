let dT = 0.0;
let Ti = 0.0;
let Tf = 0.0;

export function delta(timestamp) {
  Tf = timestamp / 1000;
  dT = Tf - Ti;
  Ti = timestamp / 1000;
  return dT;
}
