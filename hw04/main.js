const self = "111590047.png";

const width = 1000;
const height = 700;

const margin = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 80,
};

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const plotWidth = width - margin.left - margin.right;
const plotHeight = height - margin.top - margin.bottom;

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const tooltip = d3.select("#tooltip");

d3.csv("data.csv").then((data) => {
  data.forEach((d) => {
    d.LPIPS = +d.LPIPS;
    d.SSIM = +d.SSIM;
  });

  const x = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d.LPIPS) * 0.95,
      d3.max(data, (d) => d.LPIPS) * 1.05,
    ])
    .range([0, plotWidth]);

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d.SSIM) * 0.95,
      d3.max(data, (d) => d.SSIM) * 1.05,
    ])
    .range([plotHeight, 0]);

  // Grid X
  g.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0, ${plotHeight})`)
    .call(d3.axisBottom(x).tickSize(-plotHeight).tickFormat(""));

  // Grid Y
  g.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).tickSize(-plotWidth).tickFormat(""));

  // X Axis
  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${plotHeight})`)
    .call(d3.axisBottom(x));

  // Y Axis
  g.append("g").attr("class", "axis").call(d3.axisLeft(y));

  // X Label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text("LPIPS");

  // Y Label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text("SSIM");

  const nodes = g
    .selectAll("g.node")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${x(d.LPIPS)},${y(d.SSIM)})`)
    .style("cursor", "pointer");

  // display frame
  const frameSize = 40;
  nodes
    .append("rect")
    .attr("x", -frameSize / 2)
    .attr("y", -frameSize / 2)
    .attr("width", frameSize)
    .attr("height", frameSize)
    .attr("fill", "rgba(0,0,0,0)")
    .attr("stroke", (d) => (d.Student == self ? "#a01f1f" : "#00a000"))
    .attr("stroke-width", "5px");

  // display img
  const imgSize = 40;
  nodes
    .append("image")
    .attr("href", (d) => `img/${d.Student}`)
    .attr("x", -imgSize / 2)
    .attr("y", -imgSize / 2)
    .attr("width", imgSize)
    .attr("height", imgSize);

  // hover imgs
  nodes
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);

      tooltip.html(`
        <div class="title">${d.Student}</div>
        <div>LPIPS: ${d.LPIPS}</div>
        <div>SSIM: ${d.SSIM}</div>
        <img src="img/${d.Student}" />
      `);
    })

    .on("mousemove", function (event) {
      tooltip
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY - 40 + "px");
    })

    .on("mouseout", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0);
    });
});
