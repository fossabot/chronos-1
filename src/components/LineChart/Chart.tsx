import * as d3 from "d3";
import { interpolatePath } from "d3-interpolate-path";
import React, { useEffect, useRef } from "react";

import { usePrevious } from "../../hooks";

import { Datum } from "./types";

interface ChartProps {
  onMouseOver: (datum: Datum) => void;
  onMouseEnter: (datum: Datum) => void;
  onMouseLeave: (datum: Datum) => void;

  data: Datum[];
  height: number;
  width: number;
  isInteractive: boolean;
  scaleX: d3.ScaleLinear<number, number>;
  scaleY: d3.ScaleLinear<number, number>;
  transitionDelay: number;
}

function resetData(data: Datum[]) {
  return data.map(d => ({ ...d, y: 0 }));
}

const Chart = ({
  data,
  height,
  width,
  isInteractive,
  onMouseOver,
  onMouseEnter,
  onMouseLeave,
  scaleX,
  scaleY,
  transitionDelay
}: ChartProps) => {
  const chartRef = useRef<SVGGElement | null>(null);
  const prevData = usePrevious(data);
  const prevScaleX = usePrevious(scaleX) || scaleX;
  const prevScaleY = usePrevious(scaleY) || scaleY;
  useEffect(() => {
    const svg = d3.select(chartRef.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("path").remove();
    svg.selectAll("circle").remove();
    svg.selectAll("rect").remove();

    if (isInteractive) {
      const regionWidth = width / data.length;

      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .on("mouseover", d => onMouseOver(d))
        .on("mouseenter", d => onMouseEnter(d))
        .on("mouseleave", d => onMouseLeave(d))
        .attr("class", "line-chart__hover-region")
        .attr("x", d => scaleX(d.x) - regionWidth / 2)
        .attr("width", () => regionWidth)
        .attr("y", () => 0)
        .attr("height", () => height);
    }

    // Draw line
    const lineGenerator = d3
      .line<Datum>()
      .x(d => scaleX(d.x))
      .y(d => scaleY(d.y));
    const prevLineGenerator = d3
      .line<Datum>()
      .x(d => prevScaleX(d.x))
      .y(d => prevScaleY(d.y));
    const initialData = prevData || resetData(data);
    const isTransitioningFromALine = initialData.length > 1;
    const isTransitioningIntoALine = data.length > 1;
    svg
      .append("path")
      .datum(initialData)
      .attr("class", "line-chart__line")
      .attr("d", prevLineGenerator)
      .transition()
      .attrTween("d", function() {
        const current = isTransitioningFromALine
          ? d3.select(this).attr("d")
          : lineGenerator(resetData(data));
        const next = isTransitioningIntoALine
          ? lineGenerator(data)
          : prevLineGenerator(resetData(initialData));
        return interpolatePath(current || "", next || "");
      })
      .style("opacity", data.length > 1 ? 1 : 0)
      .duration(transitionDelay);

    // Draw single dot if there's only a single datapoint
    const isTransitioningFromASingleDot = prevData && prevData.length === 1;
    const isTransitioningIntoASingleDot = data.length === 1;
    svg
      .selectAll(".line-chart__dot")
      .data(data.length === 0 ? initialData : [data[0]])
      .enter()
      .append("circle")
      .attr("class", "line-chart__dot")
      .style("opacity", isTransitioningFromASingleDot ? 1 : 0)
      .attr("cx", () => width / 2)
      .attr("cy", () =>
        prevData && isTransitioningFromASingleDot
          ? prevScaleY(prevData[0].y)
          : height
      )
      .transition()
      .attr("cy", d => (isTransitioningIntoASingleDot ? scaleY(d.y) : height))
      .style("opacity", isTransitioningIntoASingleDot ? 1 : 0)
      .duration(transitionDelay);
  }, [
    data,
    height,
    isInteractive,
    onMouseEnter,
    onMouseLeave,
    onMouseOver,
    prevData,
    prevScaleX,
    prevScaleY,
    scaleX,
    scaleY,
    transitionDelay,
    width
  ]);

  return <g ref={chartRef} className="line-chart__chart" />;
};

export default Chart;
