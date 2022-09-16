const GAMES_FILE = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

d3.json(GAMES_FILE).then(data => {
    const color = d3.scaleOrdinal().range(d3.schemeTableau10)
    const margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };
    const width = 1300 - margin.left - margin.right;
    const height = 650 - margin.top - margin.bottom;

    const svg = d3.select("#treeContainer")
        .append("svg")
            .style("position", "relative")
            .style("width", (width + margin.left + margin.right) + "px")
            .style("height", (height + margin.top + margin.bottom) + "px")
            .style("left", margin.left + "px")
            .style("top", margin.top + "px")

    const tip = d3.select("#treeContainer")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);
        
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value);

    d3.treemap()
        .size([width, height])
        .padding(1)
        (root);
    
    svg
        .selectAll(".tile")
        .data(root.leaves())
        .enter()
        .append("rect")
            .attr("class", "tile")
            .attr("data-name", d => d.data.name)
            .attr("data-category", d => d.parent.data.name)
            .attr("data-value", d => d.value)
            .attr("x", d => d.x0 + "px")
            .attr("y", d => d.y0 + "px")
            .style("width", d => d.x1 - d.x0 + "px")
            .style("height", d => d.y1 - d.y0 + "px")
            .style("fill", d => color(d.parent.data.name))
            .on("mousemove", function (e, d) {
                tip.style("opacity", 1);
                tip.html(() => {
                    return "Name: " + d.data.name + "<br>" +
                    "Category: " + d.parent.data.name + "<br>" +
                    "Value: " + d.value
                })
                tip.attr("data-value", d.value)
                tip.style("left", e.pageX + "px")                
                tip.style("top", e.pageY + "px")
            })
            .on("mouseout", () => tip.style("opacity", 0));

    // text
    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
            .text(d => d.data.name)
            .attr("x", d => d.x0 + 5 + "px")
            .attr("y", d => d.y0 + 20 + "px")
            .style("fill", "#eee")
            .style("font-size", "12px");

    // legend
    const legend = d3.select("#treeContainer")
    .append("div")
        .attr("id", "legendContainer")
        .append("div")
            .attr("id", "legend");

    const enterSelection = legend
        .selectAll("div")
        .data(root.children)
        .enter()
        .append("div")
        .attr("class", "label");

    enterSelection
        .append("svg")
        .append("rect")
            .attr("class", "legend-item")
            .style("fill", d => color(d.data.name));

    enterSelection
        .append("text")
        .text(d => d.data.name);

    // finished
    // create another file js to the fcc tests
})