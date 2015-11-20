'use strict';

var ccvTree = function ($document, $rootScope, $location, $filter, CONST) {

  var link;
  var node;
  var width;
  var height;
  var maxWeight = 0;
  var ownTermSize = 10;
  var otherTermSize = 10;
  var textOffsetProportion = -10;

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
    $rootScope.resetDataContainer();
    $location.path("dashboard/" + d.term);
  }

  function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
    //console.log(d.term);
  }

  function prepareNode(n, nodeType, nodes, relevancies) {
    var cn = angular.copy(n);
    cn.nodeType = nodeType;
    cn.fixed = true;
    cn.originalWeight = n.count;
    cn.nodeRelevancy = cn.count * 100;
    if (cn != null) {
      cn.nodeRelevancy += (100 - cn.term.length);
    }
    relevancies.push(cn.nodeRelevancy)
    nodes.push(cn);
    return cn;
  }

  function pushNode(n, graph) {
    var nodeIndex = graph.nodes.length;
    n.nodeIndex = nodeIndex;
    graph.nodes.push(n);
    return n;
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

  function getTermSize(d) {
    if (d.nodeType == 'own') {
      return ownTermSize;
    } else {
      return d.originalWeight * otherTermSize / maxWeight;
    }
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
      count: 1
    };

    var ownNodes = [];
    var ownRelevancies = [];

    var own = prepareNode(ownNode, "own", ownNodes, ownRelevancies);
    own.x = width / 2;
    own.y = ownY;
    own.originalWeight = 1;
    var ownNewNode = pushNode(own, graph);
    var ownIdx = ownNewNode.nodeIndex;
    //console.log("PUSH ROOT");
    //console.log(ownNode);
    //console.log(ownNewNode);


    // -- PARENTS

    var parents = [];
    var pl = $rootScope.dataContainer.parents;

    var parentCountToShow = Math.min(pl.length, CONST.graph.parentCountLimit);
    var parentHSpace = width * CONST.graph.parentsSpanMultiplier;
    var parentHDist = parentHSpace / (parentCountToShow + 1);
    var parentNodes = [];
    var parentRelevancies = [];

    for (var i in pl) {
      var np = prepareNode(pl[i], "parent", parentNodes, parentRelevancies);
      parents.push(np);
    }

    var orderedPR = $filter('orderBy')(parentRelevancies, function (v) {
      return v;
    }, true);
    var parentCutoffValue = orderedPR[parentCountToShow -1];

    var addedParents = 0;
    for (var i in parents) {
      if (addedParents < parentCountToShow && parents[i].nodeRelevancy > parentCutoffValue) {
        var np = pushNode(parents[i], graph);
        np.y = parentY + CONST.graph.parentYOffsets[addedParents % CONST.graph.parentYOffsets.length];
        np.x = (width - parentHSpace) / 2 + parentHDist * (addedParents + 1);
        pushLink(ownIdx, np.nodeIndex, graph);
        addedParents++;
      }
    }

    // -- CHILDREN

    var children = [];
    var cl = $rootScope.dataContainer.children;

    var childCountToShow = Math.min(cl.length, CONST.graph.childCountLimit);
    var childrenHSpace = width * CONST.graph.childrenSpanMultiplier;
    var childrenHDist = childrenHSpace / (childCountToShow + 1);
    var childNodes = [];
    var childrenRelevancies = [];

    for (var i in cl) {
      var nc = prepareNode(cl[i], "child", childNodes, childrenRelevancies);
      children.push(nc);
    }

    var orderedCR = $filter('orderBy')(childrenRelevancies, function (v) {
      return v;
    }, true);
    var childCutoffValue = orderedCR[childCountToShow -1];

    var addedChildren = 0;
    for (var i in children) {
      if (addedChildren <= childCountToShow && children[i].nodeRelevancy > childCutoffValue) {
        var nc = pushNode(children[i], graph);
        nc.y = childrenY - CONST.graph.childrenYOffsets[addedChildren % CONST.graph.childrenYOffsets.length];
        nc.x = (width - childrenHSpace) / 2 + childrenHDist * (addedChildren + 1);
        pushLink(ownIdx, nc.nodeIndex, graph);
        addedChildren++;
      }
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

    var treeThumbnail = angular.element('#treeThumbnail');

    width = (treeThumbnail.width() != 0) ? treeThumbnail.width() - 80 : CONST.graph.backupWidth;
    height = (treeThumbnail.height() != 0) ? treeThumbnail.height() - 80 : CONST.graph.backupHeight;

    ownTermSize = height * CONST.graph.ownTermProportion;
    otherTermSize = height * CONST.graph.otherTermProportion;
    textOffsetProportion = height * CONST.graph.textOffsetProportion;

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
      .on("mouseover", function (d, i) {
        if (i > 0) {
          //CIRCLE
          d3.select(this).selectAll("circle")
            .transition()
            .duration(250)
            //.style("cursor", "none")
            .attr("r", getTermSize(d) / 2 * CONST.graph.increasedTermProportion)

          //TEXT
          d3.select(this).select("text")
            .transition()
            //.style("cursor", "none")
            .duration(250)
            .attr("font-size", "2em")
        } else {
          //CIRCLE
          d3.select(this).selectAll("circle")
          //.style("cursor", "none")

          //TEXT
          d3.select(this).select("text")
          //.style("cursor", "none")
        }
      })

      //MOUSEOUT
      .on("mouseout", function (d, i) {
        if (i > 0) {
          //CIRCLE
          d3.select(this).selectAll("circle")
            .transition()
            .duration(250)
            .attr("r", getTermSize(d) / 2)

          //TEXT
          d3.select(this).select("text")
            .transition()
            .duration(250)
            .attr("font-size", "1em")
        }
      })
      .call(drag);

    node.append("svg:circle")
      .attr("r", function (d) {
        return getTermSize(d) / 2;
      })
      .attr("fill", function (d, i) {
        return CONST.graph.palette[d.nodeType];
      })


    node.append("text")
      .text(function (d, i) {
        return d.term;
      })
      .attr("dx", 0)
      .attr("dy", function (d) {
        if (d.nodeType == 'own') {
          return 0;
        } else {
          return -getTermSize(d) / 2 + CONST.graph.textYOffset;
        }
      })
      .attr("font-family", "Arial, Helvetica, Sans")
      .attr("font-size", function (d, i) {
        return "1em";
      })
      .attr("text-anchor", "middle");

  }

  return {
    restrict: 'A',
    link: angularlink
  };

};

ccvTree.$inject = ['$document', '$rootScope', '$location', '$filter', 'CONST'];
angularApp.directive('ccvTree', ccvTree);