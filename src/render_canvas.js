function renderLegend(ctx, slider, sliderIndex, movingSliderBall) {
  ctx.beginPath();
  if (movingSliderBall) { ctx.font = `bold ${slider.legend.font}`; } else { ctx.font = slider.legend.font; }
  ctx.fillStyle = slider.legend.color;
  // maybe refactor, 20px vertical spacing by default, could be an issue if set font above 20px
  ctx.fillText(`${slider.name}: ${slider.priceUnits}${slider.value} ${slider.units}`, 10, 20 * (sliderIndex + 1));
  ctx.closePath();
}

export default function renderCanvas(canvas, movingBall = false) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const sliders = canvas.sliders;
  sliders.forEach((slider, index) => {
    slider.__render(ctx);
    if (slider.legend.display) {
      renderLegend(ctx, slider, index, movingBall && slider === canvas.selectedSlider);
    }
  });
}
