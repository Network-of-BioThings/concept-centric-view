'use strict';

var ccvTree = function ($document, CONST) {

  var link;
  var node;
  var width;
  var height;

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

    node.attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }

  function dblclick(d) {
    d3.select(this).classed("fixed", d.fixed = false);
  }

  function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
  }

  function pushNode(n, nodeType, graph) {
    var nodeIndex = graph.nodes.length;
    var cn = angular.copy(n);
    cn.nodeIndex = nodeIndex;
    cn.nodeType = nodeType;
    //cn.fixed = true;
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
      term: scope.dataContainer.term,
      count: NaN
    };

    var own = pushNode(ownNode, "own", graph);
    own.x = width / 2;
    own.y = ownY;
    var ownIdx = own.nodeIndex;

    // -- PARENTS

    var parents = [];
    var pl = scope.dataContainer.parents;

    var parentHSpace = width * CONST.graph.parentsSpanMultiplier;
    var parentHDist = parentHSpace / (pl.length + 1);

    for (var i in pl) {
      var np = pushNode(pl[i], "parent", graph);
      parents.push(np);
      np.y = parentY;
      np.x = (width - parentHSpace) / 2 + parentHDist * (Number(i) + 1);
      pushLink(ownIdx, np.nodeIndex, graph);
    }

    // -- CHILDREN

    var children = [];
    var cl = scope.dataContainer.children;

    var childrenHSpace = width * CONST.graph.childrenSpanMultiplier;
    var childrenHDist = childrenHSpace / (cl.length + 1);

    for (var i in cl) {
      var nc = pushNode(cl[i], "child", graph);
      children.push(nc);
      nc.y = childrenY;
      nc.x = (width - childrenHSpace) / 2 + childrenHDist * (Number(i) + 1);
      pushLink(ownIdx, nc.nodeIndex, graph);
    }

    console.log(graph);

    return graph;
  }

  function angularlink(scope, element, attrs) {

    width = CONST.graph.width;
    height = CONST.graph.height;

    var graph = prepareGraphData(scope);

    var force = d3.layout.force()
      .size([width, height])
      .charge(-400)
      .linkDistance(function(link, idx) {
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
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 22)
      .on("dblclick", dblclick)
      .call(drag);

  }

  return {
    restrict: 'A',
    link: angularlink
  };

};

ccvTree.$inject = ['$document', 'CONST'];
angularApp.directive('ccvTree', ccvTree);