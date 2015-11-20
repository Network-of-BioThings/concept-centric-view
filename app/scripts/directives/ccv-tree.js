'use strict';

var ccvTree = function ($document, $rootScope, $location, CONST) {

  var link;
  var node;
  var width;
  var height;
  var maxWeight = 0;

  function tick() {
    link.attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  }

  function dblclick(d) {
    d3.select(this).classed("fixed", d.fixed = false);
  }

  function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
    //console.log(d.term);
    $rootScope.resetDataContainer();
    $location.path("dashboard/" + d.term);
  }

  function pushNode(n, nodeType, graph) {
    var nodeIndex = graph.nodes.length;
    var cn = angular.copy(n);
    cn.nodeIndex = nodeIndex;
    cn.nodeType = nodeType;
    cn.fixed = true;
    graph.nodes.push(cn);
    return cn;
  }

  function pushLink(sourceIdx, targetIdx, graph) {

    var x1 = graph.nodes[sourceIdx].x;
    var y1 = graph.nodes[sourceIdx].y;
    var x2 = graph.nodes[targetIdx].x;
    var y2 = graph.nodes[targetIdx].y;

    var l = {
      "source": sourceIdx,
      "target": targetIdx,
      "origLength": Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    };
    graph.links.push(l);
    return l;
  }

  function prepareGraphData(scope) {

    var ownY = height * CONST.graph.ownYMultiplier;
    var parentY = height * CONST.graph.parentsYMultiplier;
    var childrenY = height * CONST.graph.childrenYMultiplier;

    var graph = {
      "nodes": [],
      "links": []
    };

    // -- OWN

    var ownNode = {
      term: $rootScope.dataContainer.term,
      count: NaN
    };

    var own = pushNode(ownNode, "own", graph);
    own.x = width / 2;
    own.y = ownY;
    own.originalWeight = 1;
    var ownIdx = own.nodeIndex;

    // -- PARENTS

    var parents = [];
    var pl = $rootScope.dataContainer.parents;

    var parentHSpace = width * CONST.graph.parentsSpanMultiplier;
    var parentHDist = parentHSpace / (pl.length + 1);

    for (var i in pl) {
      var np = pushNode(pl[i], "parent", graph);
      parents.push(np);
      np.y = parentY;
      np.x = (width - parentHSpace) / 2 + parentHDist * (Number(i) + 1);
      np.originalWeight = pl[i].count;
      pushLink(ownIdx, np.nodeIndex, graph);
    }

    // -- CHILDREN

    var children = [];
    var cl = $rootScope.dataContainer.children;

    var childrenHSpace = width * CONST.graph.childrenSpanMultiplier;
    var childrenHDist = childrenHSpace / (cl.length + 1);

    for (var i in cl) {
      var nc = pushNode(cl[i], "child", graph);
      children.push(nc);
      nc.y = childrenY;
      nc.x = (width - childrenHSpace) / 2 + childrenHDist * (Number(i) + 1);
      nc.originalWeight = cl[i].count;
      pushLink(ownIdx, nc.nodeIndex, graph);
    }

    for (var i in graph.nodes) {
      if (graph.nodes[i].originalWeight > maxWeight) {
        maxWeight = graph.nodes[i].originalWeight;
      }
    }

    //console.log(graph);

    return graph;
  }

  function angularlink(scope, element, attrs) {

    width = CONST.graph.width;
    height = CONST.graph.height;

    var palette = {
      "lightgray": "#819090",
      "gray": "#708284",
      "mediumgray": "#536870",
      "darkgray": "#475B62",

      "darkblue": "#0A2933",
      "darkerblue": "#042029",

      "paleryellow": "#FCF4DC",
      "paleyellow": "#EAE3CB",
      "yellow": "#A57706",
      "orange": "#BD3613",
      "red": "#D11C24",
      "pink": "#C61C6F",
      "purple": "#595AB7",
      "blue": "#2176C7",
      "green": "#259286",
      "yellowgreen": "#738A05"
    }

    var graph = prepareGraphData(scope);

    var force = d3.layout.force()
      .size([width, height])
      .charge(0)
      .linkDistance(function (link, idx) {
        return link.origLength;
      })
      .on("tick", tick);


    var drag = force.drag()
      .on("dragstart", dragstart);

    var svg = d3.select("#treeContainer").append("svg")
      .attr("width", width)
      .attr("height", height);

    link = svg.selectAll(".link");
    node = svg.selectAll(".node");


    force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

    link = link.data(graph.links)
      .enter().append("line")
      .attr("class", "link");

    node = node.data(graph.nodes)
      .enter().append("g")
      .attr("class", "node")
      .on("dblclick", dblclick)


      //MOUSEOVER
      .on("mouseover", function(d,i) {
        if (i>0) {
          //CIRCLE
          d3.select(this).selectAll("circle")
            .transition()
            .duration(250)
            .style("cursor", "none")
            .attr("r", d.originalWeight * 20 / maxWeight + 10)

          //TEXT
          d3.select(this).select("text")
            .transition()
            .style("cursor", "none")
            .duration(250)
            .style("cursor", "none")
            .attr("font-size","2em")
            .attr("x", 15 )
            .attr("y", -20 )
        } else {
          //CIRCLE
          d3.select(this).selectAll("circle")
            .style("cursor", "none")

          //TEXT
          d3.select(this).select("text")
            .style("cursor", "none")
        }
      })

      //MOUSEOUT
      .on("mouseout", function(d,i) {
        if (i>0) {
          //CIRCLE
          d3.select(this).selectAll("circle")
            .transition()
            .duration(250)
            .attr("r", d.originalWeight * 20 / maxWeight)

          //TEXT
          d3.select(this).select("text")
            .transition()
            .duration(250)
            .attr("font-size","1em")
            .attr("x", 8 )
            .attr("y", 4 )
        }
      })
      .call(drag);

    node.append("svg:circle")
      .attr("r", function (d) {
        return d.originalWeight * 20 / maxWeight;
      })
      .attr("fill", function (d, i) {
        return d.nodeType == 'parent' ? palette.paleryellow : palette.green;
      })


    node.append("text")
      .text(function (d, i) {
        return d.term;
      })
      .attr("dx", 0)
      .attr("dy", -12)
      .attr("font-family", "Arial, Helvetica, Sans")
      .attr("font-size", function (d, i) {
        return "1em";
      })
      .attr("text-anchor", function (d, i) {
        if (i > 0) {
          return "beginning";
        } else {
          return "end"
        }
      })

  }

  return {
    restrict: 'A',
    link: angularlink
  };

};

ccvTree.$inject = ['$document', '$rootScope', '$location', 'CONST'];
angularApp.directive('ccvTree', ccvTree);