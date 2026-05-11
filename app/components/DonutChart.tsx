'use client';

import React, { useEffect, useRef } from 'react';

interface DonutChartProps {
  percentage: number;
  colorFill: string;
  colorBg?: string;
  size?: number;
  strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  percentage,
  colorFill,
  colorBg = '#1a2332',
  size = 80,
  strokeWidth = 9,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;
    const r = (size / 2) - (strokeWidth / 2) - 2; // Subtracting 2 for some padding
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (percentage / 100) * 2 * Math.PI;

    ctx.clearRect(0, 0, size, size);

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = colorBg;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // Fill arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = colorFill;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  }, [percentage, colorFill, colorBg, size, strokeWidth]);

  return (
    <div className="donut-wrap">
      <canvas ref={canvasRef} width={size} height={size} />
      <div className="donut-label">{percentage}%</div>
    </div>
  );
};

export default DonutChart;
