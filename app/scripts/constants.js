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
    parentYOffsets: [0, -20, -120, 40, -40, 20, 60, -60, 100, -100, 120],
    childrenYOffsets: [0, -20, -120, 40, -40, 20, 60, -60, 100, -100, 120],
    ownTermProportion: 0.2,
    otherTermProportion: 0.1,
    increasedTermProportion: 1.5,
    textOffsetProportion: -0.01,
    textYOffset: -5,
    palette: {
      'own': '#fd8d3c',
      'parent': "#e31a1c",
      'child': "#feb24c"
    }
  },
  synonymWordCloud: {
    colors: ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976"]
  }
});