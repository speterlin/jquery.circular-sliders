import { ballLocationForAngle } from './helpers';

export default class Ball {
  constructor(slider, ballColor) {
    [this.x, this.y] = ballLocationForAngle(slider);
    this.radius = slider.lineWidth;
    this.color = ballColor;
  }
}
