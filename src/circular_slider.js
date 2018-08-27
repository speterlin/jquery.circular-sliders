import { renderShoeWithGradient, renderWaistWithGradient, renderPersonWithGradient } from './shapes';
import { angleForValue } from './helpers';
import Ball from './ball';

function renderSlider(ctx, slider) {
  ctx.beginPath();
  ctx.lineWidth = slider.lineWidth;
  ctx.strokeStyle = slider.strokeColor;
  ctx.setLineDash([slider.lineDashLength, slider.lineDashSpacing]);
  ctx.arc(slider.centerX, slider.centerY, slider.radius, 0, Math.PI * 2, false);
  ctx.stroke();
  ctx.closePath();
  if (slider.type !== 'Plain') {
    ctx.beginPath();
    ctx.setLineDash([10, 0]);
    ctx.lineWidth = 5;
    let myGradient = null;
    if (slider.type === 'Shoe') {
      myGradient = renderShoeWithGradient(ctx, slider);
    } else if (slider.type === 'Waist') {
      myGradient = renderWaistWithGradient(ctx, slider);
    } else if (slider.type === 'Height') {
      myGradient = renderPersonWithGradient(ctx, slider);
    } else if (slider.type === 'Weight') {
      myGradient = renderPersonWithGradient(ctx, slider, { style: 'Weight' });
    }
    if (slider.gradientFill) {
      const scale = (slider.value - slider.minValue) / slider.range;
      myGradient.addColorStop(0, slider.color);
      myGradient.addColorStop(scale, '#ffffff');
      ctx.fillStyle = myGradient;
      ctx.fill();
    }
    ctx.stroke();
    ctx.closePath();
  }
}

function renderArc(ctx, slider) {
  // add this if want arc to stop at edge of ball: let angleOffset = Math.atan(slider.ball.radius / slider.radius), then also need check for (π / 2) + slider.angle) < angleOffset) for when go past the 0˚ mark at top of circle, π / 2 + slider.angle since angle starts at -π / 2 at top of circle
  ctx.beginPath();
  ctx.arc(slider.centerX, slider.centerY, slider.radius, -(Math.PI / 2), slider.angle, false);
  ctx.lineWidth = slider.lineWidth;
  ctx.strokeStyle = slider.color;
  // have to set lineDashLength to a number > 0 for arc to be completely full in browsers like Safari
  ctx.setLineDash([10, 0]);
  ctx.stroke();
  ctx.closePath();
}

function renderBall(ctx, slider) {
  ctx.beginPath();
  ctx.arc(slider.ball.x, slider.ball.y, slider.ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = slider.ball.color;
  ctx.fill();
  ctx.closePath();
}

class CircularSlider {
  constructor(settings) {
    const slider = this;
    Object.keys(settings).forEach((key) => {
      slider[key] = settings[key];
    });
    // centerX, centerY, and radius should be set in defaults (in for loop) or options
    this.value = this.value || this.minValue;
    // calculated / created attributes
    this.range = this.maxValue - this.minValue;
    this.angle = angleForValue(this);
    // maybe refactor, I like 2/3 and 1/3 for now
    const arcSegment = 2 * Math.PI * this.radius / (this.range / this.step);
    this.lineDashLength = (2 / 3) * arcSegment;
    this.lineDashSpacing = (1 / 3) * arcSegment;
    this.ball = new Ball(this, settings.ballColor);
  }

  __render(ctx) {
    renderSlider(ctx, this);
    renderArc(ctx, this);
    renderBall(ctx, this);
  }
}

export default CircularSlider;
// $.fn.sliders.CircularSlider = CircularSlider;
