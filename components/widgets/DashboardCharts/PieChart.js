import React, { useRef, useEffect } from 'react';
import NVD3Chart from 'react-nvd3';


export default ({ datum }) => {
  const chartref = useRef(null),
    handleResize = function() {
      const chart = chartref.current.chart,
        rect = chartref.current.refs.root.getBoundingClientRect();

      if (!chart) {
        return;
      }
      chart.width(rect.width).height(rect.height).update();
    };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <NVD3Chart
      ref={chartref}
      showLabels={false}
      type="pieChart"
      legendPosition="right"
      titleOffset={10}
      datum={datum}
      x={"key"}
      y={"y"}
      configure={(chart) => {
      }}
    />
  )
}