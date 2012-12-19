var counties = require('./counties.json'),
    geojson  = require('./geojson'),
    rtree    = require('./rtree');
    fs       = require('fs');
    
var util = require('util');

var c = new geojson.FeatureCollection(counties);
var count = 0;

var tree = new rtree.RTree();

c.on("feature", function (data) {
  count++;
  tree.insert(data.envelope, data);
});

c.on("done", function () {
  console.log("done import: " + count + " counties");
  var res = tree.search({ y: 45.5165, x: -122.6764, w: 0, h: 0 });

console.dir(res);
  for (var i = 0; i < res.length; i++) {
    if (isPointInPoly(res[i].feature.geometry.coordinates[0], [-122.6764, 45.5165])) {
      console.log("Point inside polygon: " + res[i].feature.properties.name);
    }
  }
});

c.process();

function isPointInPoly(poly, pt) {
  for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1])) &&
      (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]) &&
      (c = !c);

  return c;
}
