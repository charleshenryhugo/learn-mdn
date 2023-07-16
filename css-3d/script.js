const metricsMovement = document.querySelector('.metrics-movement');
const metricsRotate = document.querySelector('.metrics-rotate');

const cubeContainer = document.querySelector('.cube-container');
const cube = cubeContainer.querySelector('.cube');

let lastPosX = null;
let lastPosY = null;
let rotateX = 0;
let rotateY = 0;
let deltaX = 0;
let deltaY = 0;

const resetAll = () => {
  lastPosX = null;
  lastPosY = null;
  rotateX = 0;
  rotateY = 0;
  deltaX = 0;
  deltaY = 0;

  const rotate = `rotateY(${rotateX}deg) rotateX(${-rotateY}deg)`;
  cube.style.transform = rotate;
  metricsMovement.textContent = `△X: ${deltaX}, △Y: ${deltaY}`;
  metricsRotate.textContent = rotate;
}

cube.onmousedown = (_mouseDownEvent) => {
  cube.onmousemove = (moveEvent) => {
    if (lastPosX !== null) {
      deltaX = moveEvent.clientX - lastPosX;
      deltaY = moveEvent.clientY - lastPosY;
      rotateX += deltaX;
      rotateY += deltaY;
      const rotate = `rotateY(${rotateX}deg) rotateX(${-rotateY}deg)`;
      cube.style.transform = rotate;
      metricsMovement.textContent = `△X: ${deltaX}, △Y: ${deltaY}`;
      metricsRotate.textContent = rotate;
    }

    lastPosX = moveEvent.clientX;
    lastPosY = moveEvent.clientY;
  }
}

cube.onmouseup = () => {
  cube.onmousemove = null
  lastPosX = null;
  lastPosY = null;
}

const metricsReset = document.querySelector('.metrics-reset');
metricsReset.onclick = () => {
  resetAll();
}
