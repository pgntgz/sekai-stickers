import React from "react";

export default function MD3WavySlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className = "",
  orientation = "horizontal"
}) {
  const numVal = Number(value);
  const pct = Math.max(0, Math.min(100, ((numVal - min) / (max - min)) * 100));

  // Generate SVG wavy path for the active portion (up to pct%)
  // Coordinate space: 300px wide, 24px high
  const activeWidth = (pct / 100) * 300;
  
  const waveLength = 16;
  const waveHeight = 4.5;
  let wavePath = "M 0 12";
  for (let x = 0; x < activeWidth; x += waveLength) {
    const nextX = Math.min(x + waveLength, activeWidth);
    const midX = (x + nextX) / 2;
    const sign = Math.floor(x / waveLength) % 2 === 0 ? 1 : -1;
    wavePath += ` Q ${midX} ${12 - sign * waveHeight}, ${nextX} 12`;
  }

  return (
    <div className={`md3-wavy-slider-container ${orientation} ${className}`}>
      <svg className="md3-wavy-svg" viewBox="0 0 300 24" preserveAspectRatio="none">
        {/* Inactive straight background track */}
        <line
          x1={activeWidth}
          y1="12"
          x2="300"
          y2="12"
          className="md3-wavy-inactive-track"
        />
        {/* Active undulating wave track */}
        <path
          d={wavePath}
          className="md3-wavy-active-track"
        />
      </svg>
      {/* MD3 Expressive Pill Thumb with State Layer */}
      <div
        className="md3-wavy-thumb-visual"
        style={{ left: `${pct}%` }}
      >
        <div className="md3-wavy-thumb-inner" />
      </div>
      {/* Transparent native range input for 100% native touch and drag response */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="md3-wavy-native-input"
      />
    </div>
  );
}
