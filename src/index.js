import $ from 'jquery';
import CircularSlider from './circular_slider';
import { handleMouseDown, handleMouseUp, handleMouseMove } from './helpers';
import renderCanvas from './render_canvas';

if (typeof $ === 'undefined') {
  throw new Error('jQuery.CircularSliders requires jQuery');
}

$.fn.sliders = function (slidersOptions) {
  this.each(function () {
    if (!$(this).is('canvas')) { throw new Error('Circular Sliders must be called on a Canvas.'); }
    const canvas = this;
    const sliders = [];
    const canvasDefaults = {};
    [canvasDefaults.centerX, canvasDefaults.centerY, canvasDefaults.radius] = [canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 4];
    slidersOptions.forEach((sliderOptions, index) => {
      canvasDefaults.name = `Slider ${index + 1}`;
      if (index > 0) {
        [canvasDefaults.centerX, canvasDefaults.centerY] = [sliders[index - 1].centerX, sliders[index - 1].centerY];
        canvasDefaults.radius = sliders[index - 1].radius + sliders[index - 1].lineWidth + $.fn.sliders.defaults.lineWidth;
      }
      const sliderDefaults = $.extend({}, $.fn.sliders.defaults, canvasDefaults);
      // true for deep merge
      const settings = $.extend(true, {}, sliderDefaults, sliderOptions);
      sliders.push(new CircularSlider(settings));
    });
    // maybe look at https://stackoverflow.com/questions/10149963/adding-event-listener-cross-browser
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    [canvas.sliders, canvas.selectedSlider] = [sliders, sliders[0]];

    renderCanvas(canvas);
  });
};

// TODO: add configure(options) and config: config
$.fn.sliders.defaults = {
  name: 'Slider',
  type: 'Plain',
  color: '#0000FF',
  minValue: 0,
  maxValue: 100,
  step: 10,
  units: '',
  priceUnits: '',
  // centerX, centerY, and radius set in Canvas because they are specific/modified to each canvas
  lineWidth: 5,
  strokeColor: '#D3D3D3',
  ballColor: '#000000',
  gradientFill: true,
  legend: { display: true, font: '12px Arial', color: '#000000' },
};

$.fn.findSliderByName = function (name) {
  if (!this.is('canvas')) { throw new Error('findSliderByName must be called on a Canvas.'); }
  const canvas = this[0];
  return canvas.sliders.filter(slider => slider.name === name)[0];
};
