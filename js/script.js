/*
const boxw = document.querySelectorAll('.box-warning');
const subt = document.querySelectorAll('.subtitle-div');
const ahref = document.querySelectorAll('a');

const now = new Date();
let color = now.getUTCMilliseconds();
let fcolor = color.toString(16).padStart(2, '0');

boxw.forEach(member => {
    member.style.borderColor = "#" + fcolor;
    
    bcolor = Number(color) * 0.8;
    fcolor = color.toString(16).padStart(2, '0');
    
    member.style.backgroundColor = "#" + fcolor;
});

subt.forEach(member => {
    bcolor = Number(color) * 0.8;
    fcolor = color.toString(16).padStart(2, '0');
    
    member.style.color = "#" + fcolor; 
});

ahref.forEach(member => {
    member.style.backgroundColor = "#" + fcolor;
});

*/

function show(id) {
  document.querySelectorAll('.main').forEach(m => {
    m.hidden = true;
  });

  const element = document.getElementById(id).forEach(b => {
    b.hidden = true;
  });

  document.querySelectorAll('.box');

  element.hidden = false;
};
