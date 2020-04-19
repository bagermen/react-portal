import React, { useRef, useEffect } from 'react';
import NVD3Chart from 'react-nvd3';
import m from 'moment-timezone';

export default ({ datum, xFormat='%Y-%m-%d' }) => {
  const chartref = useRef(null),
    handleResize = function() {
      const chart = chartref.current.chart,
        rect = chartref.current.refs.root.getBoundingClientRect();

      if (!chart) {
        return;
      }
      chart.width(rect.width).height(rect.height).update();
    },
    formatX = function(i) {
      const mDate = m(parseInt(i)),
            d = new Date(mDate.year(), mDate.month(), mDate.date(), mDate.hour(), mDate.minute(), mDate.second()),
            dateFormatter = d3.time.format(xFormat);

      return dateFormatter(d);
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
      type="multiBarChart"
      rightAlignYAxis={true}
      showControls={false}
      datum={datum}
      multibar={{stacked: true}}
      context={{
        formatX
      }}
      xAxis={{
        tickFormat: { name: 'formatX', type: 'function'}
      }}
      configure={(chart) => {
        // xAxis
        // chart.multibar.stacked(true);
      }}
    />
  )
}