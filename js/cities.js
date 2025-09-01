const svg = d3.select("svg")

svg
    .attr("viewBox","0 0 960 720")

const axisXGroup = svg.append("g")
    .attr("class","x-axis")
    .attr("transform",`translate(0,620)`)

const axisYGroup =svg.append("g")
    .attr("class","y-axis")
    .attr("transform",`translate(100,0)`)

const textXAxis = svg.append("text")
    .attr("class","axis-x")
    .attr("transform","translate(480,660)")
    .text("x-axis")

const textYAxis = svg.append("text")
    .attr("class","axis-y")
    .attr("transform","translate(40,360) rotate(-90)")
    .text("y-axis")





const placeCities = function(){
    const selectX = document.querySelector("select[name=valueX]")
    const selectY = document.querySelector("select[name=valueY]")
    let valueX  = selectX.value;
    let valueY = selectY.value;
    let axisXText = selectX.options[selectX.selectedIndex].innerHTML;
    let axisYText = selectY.options[selectY.selectedIndex].innerHTML;

    let maxValueX = d3.max(data,(d,i) => {return d[valueX]});
    let maxValueY = d3.max(data,(d,i) => {return d[valueY]});
    let maxValueR = d3.max(data,(d,i)=> {return d.population});

    textXAxis.text(axisXText);
    textYAxis.text(axisYText);



    let scaleX = d3.scaleLinear()
        .domain([0,maxValueX])
        .range([100,860])
    let scaleY = d3.scaleLinear()
        .domain([0,maxValueY])
        .range([620,100])
    let scaleR = d3.scaleSqrt()
        .domain([0,maxValueR])
        .range([0,30])

    const axisXGenerator = d3.axisBottom(scaleX)
        .ticks(10,"$,.0f")
        .tickSize(-520)
        .tickSizeOuter(0)
        .tickPadding(10)
    const axisYGenerator = d3.axisLeft(scaleY)
        .ticks(10,"$,.0f")
        .tickSize(-780)
        .tickSizeOuter(0)
        .tickPadding(10)


    axisXGroup
       /*  .transition()
        .duration(750) */
        .call(axisXGenerator)
    axisYGroup
       /*  .transition()
        .duration(750) */
        .call(axisYGenerator)

    const cityGroup = svg.selectAll("g.city")
        .data(data,(d,i)=> {return d.city})
        .enter()
        .append("g")
        .attr("class","city")
        .attr("transform",(d,i)=>{
            const x = scaleX(d[valueX]);
            const y = scaleY(d[valueY]);
            return `translate(${x},${y})`
        })

    cityGroup.append("circle")
        .attr("cx",0)
        .attr("cy",0)
        .attr("r",0)
        .transition()
        .attr("r",(d,i)=>{return scaleR(d.population)})

    cityGroup
        .append("rect")
        .attr("x", -60)
        .attr("y", (d, i) => { return -1 * scaleR(d.population) - 30 })
        .attr("width", 120)
        .attr("height", 30)
    
    cityGroup
        .append("text")
        .attr("x",0)
        .attr("y", (d, i) => { return -1 * scaleR(d.population) - 15 })
        .text((d,i)=>{return d.city})

        svg
            .selectAll("g.city")
            .transition()
            .duration(500)
            .attr("transform",(d,i)=>{
                const x = scaleX(d[valueX]);
                const y = scaleY(d[valueY]);
                return `translate(${x},${y})`
            })
        svg
            .selectAll("g.city")
            .on("mouseover",function(){
                d3.select(this).raise()
            })


}

placeCities();

const selectTags = document.querySelectorAll("select")

selectTags.forEach((selectTags)=>{
    selectTags.addEventListener("input",function(){
        placeCities();
    })
})