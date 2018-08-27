import $ from 'jquery';
import renderCanvas from './render_canvas';

let isMouseDown = false;

function roundToStep(value, step) {
  return Math.round(value / step) * step;
}

function ballLocationForAngle(slider) {
  return [slider.centerX + slider.radius * Math.cos(slider.angle), slider.centerY + slider.radius * Math.sin(slider.angle)];
}

function angleForValue(slider) {
  return (2 * Math.PI * (slider.value - slider.minValue) / slider.range) - (Math.PI / 2);
}

function moveBall(mouseX, mouseY, canvas) {
  const slider = canvas.selectedSlider;
  const dx = mouseX - slider.centerX;
  // if draw out in x-y coordinates correct way would be slider.centerY - mouseY, but because top of circle -π / 2, have to do negative of angle which is the same as doing below
  const dy = mouseY - slider.centerY;
  slider.angle = Math.atan(dy / dx);
  // to cover other half of circle, Math.atan only calculates angles between -π/2 and π/2
  if (dx < 0) { slider.angle += Math.PI; }
  [slider.ball.x, slider.ball.y] = ballLocationForAngle(slider);
  // add π / 2 because 0˚ (top of circle) starts at -π / 2, divide by 2π because this is 360˚ in radians, this is reverse of #angleForValue
  const value = slider.minValue + slider.range * ((slider.angle + (Math.PI / 2)) / (2 * Math.PI));
  // refactor - bug if give step value below 0.5
  const roundedValue = roundToStep(value, slider.step);
  slider.value = roundedValue;
  renderCanvas(canvas, true);
}

function moveBallToStep(canvas) {
  const slider = canvas.selectedSlider;
  slider.angle = angleForValue(slider);
  [slider.ball.x, slider.ball.y] = ballLocationForAngle(slider);
  renderCanvas(canvas);
}

function setMouse(e) {
  const canvas = e.target;
  // $(window).scrollLeft() and $(window).scrollTop() to account for page scrolling
  return [parseInt(e.clientX - canvas.offsetLeft + $(window).scrollLeft(), 10), parseInt(e.clientY - canvas.offsetTop + $(window).scrollTop(), 10)];
}

function onBall(x, y, slider) {
  if (x > (slider.ball.x - slider.ball.radius) && x < (slider.ball.x + slider.ball.radius) && y > (slider.ball.y - slider.ball.radius) && y < (slider.ball.y + slider.ball.radius)) {
    return true;
  }
  return false;
}

function handleMouseDown(e) {
  e.preventDefault();
  isMouseDown = true;
  const [mouseX, mouseY] = setMouse(e);
  const sliders = e.target.sliders;
  sliders.forEach((slider) => {
    if (onBall(mouseX, mouseY, slider)) {
      e.target.selectedSlider = slider;
    }
  });
}

function handleMouseUp(e) {
  e.preventDefault();
  isMouseDown = false;
  moveBallToStep(e.target);
}

function handleMouseMove(e) {
  if (!isMouseDown) {
    return;
  }
  e.preventDefault();
  const [mouseX, mouseY] = setMouse(e);
  moveBall(mouseX, mouseY, e.target);
}

export { handleMouseDown, handleMouseUp, handleMouseMove, ballLocationForAngle, angleForValue };
