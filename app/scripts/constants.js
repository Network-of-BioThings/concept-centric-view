/*jslint node: true */
/*global angularApp */
'use strict';

angularApp.constant('CONST', {
  graph: {
    backupWidth: 960,
    backupHeight: 500,
    parentsYMultiplier: 0.2,
    ownYMultiplier: 0.5,
    childrenYMultiplier: 0.8,
    parentsSpanMultiplier: 0.8,
    childrenSpanMultiplier: 0.9,
    parentYOffsets: [0, -10, 20, -20, 10],
    childrenYOffsets: [0, 10, -20, -10, 20],
    ownTermSize: 10,
    maxTermSize: 20,
    increaseTermSizeBy: 10
  },
  synonymWordCloud: {
    colors: ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976"]
  }
});