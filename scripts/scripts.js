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

    const div = d3.select("#treeContainer")
        .append("div")
            .attr("id", "notSvgDiv")
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

    const tree = d3.treemap()
        .size([width, height])
        (root);
    
    div.datum(root)
        .selectAll(".node")
        .data(tree.leaves())
        .enter()
        .append("div")
            .attr("class", "node")
            .style("left", d => d.x0 + "px")
            .style("top", d => d.y0 + "px")
            .style("width", d => d.x1 - d.x0 + "px")
            .style("height", d => d.y1 - d.y0 + "px")
            .style("background", d => color(d.parent.data.name))
            .text(d => d.data.name)
            .on("mousemove", function (e, d) {
                tip.style("opacity", 1);
                tip.html(() => {
                    return "Name: " + d.data.name + "<br>" +
                    "Category: " + d.parent.data.name + "<br>" +
                    "Value: " + d.value
                })
                tip.style("left", e.pageX + "px")                
                tip.style("top", e.pageY - 75 + "px")
            })
            .on("mouseout", () => tip.style("opacity", 0));

    // legend
    const legend = d3.select("body")
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
        .append("div")
        .attr("class", "square")
        .attr("style", d => `background-color: ${color(d.data.name)}`);

    enterSelection
        .append("text")
        .text(d => d.data.name);

    // finished
    // created another file js to the fcc tests
})