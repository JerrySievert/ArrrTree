var events = require('events'),
    util   = require('util');


var FeatureCollection = function (collection) {
  events.EventEmitter.call(this);
  
  this.collection = collection;
};

util.inherits(FeatureCollection, events.EventEmitter);


FeatureCollection.prototype.process = function () {
  for (var i = 0; i < this.collection.features.length; i++) {
    var feature = this.collection.features[i];
    
    this.processSingleFeature(feature);
  }
  
  this.emit('done');
};

FeatureCollection.prototype.processSingleFeature = function (feature) {
  if (feature.type === 'Feature') {
    var envelope;
    
    if (feature.geometry.type === 'Polygon') {
      envelope = this.getEnvelopePolygon(feature.geometry.coordinates);
      this.emit('feature', { envelope: envelope, feature: feature });
    } else {
      envelope = this.getEnvelopeMultiPolygon(feature.geometry.coordinates);
      this.emit('feature', { envelope: envelope, feature: feature });
    }

  }
};

/*
{
  "type": "Polygon",
  "coordinates": [
    [
      [-87.76459, 31.298768],
      [-87.616713, 31.243998],
      [-87.600282, 30.997536],
      [-87.518128, 30.280057],
      [-88.005575, 30.685351],
      [-87.972714, 31.161844],
      [-87.945329, 31.194706],
      [-87.76459, 31.298768]
    ]
  ]
}
*/
FeatureCollection.prototype.getEnvelopePolygon = function (coordinates, debug) {
  var x1, x2, y1, y2;
  
  for (var i = 0; i < coordinates.length; i++) {
    var inner = coordinates[i];
    
    for (var j = 0; j < inner.length; j++) {
      var lonlat = inner[j];
      
      var lon = lonlat[0];
      var lat = lonlat[1];
      
      if (x1 === undefined) {
        x1 = lon;
      } else if (lon < x1) {
        x1 = lon;
      }
      
      if (x2 === undefined) {
        x2 = lon;
      } else if (lon > x2) {
        x2 = lon;
      }

      if (y1 === undefined) {
        y1 = lat;
      } else if (lat < y1) {
        y1 = lat;
      }
      
      if (y2 === undefined) {
        y2 = lat;
      } else if (lat > y2) {
        y2 = lat;
      }
    }
  }
  if (debug) {
    console.log("x1 => " + x1 + ", x1 => " + x2 + ", y1 => " + y1 + ", y2 => " + y2);
  }
  return { x: x1, y: y1, w: Math.abs(x2 - x1), h: Math.abs(y2 - y1) };
};

FeatureCollection.prototype.getEnvelopeMultiPolygon = function (coordinates) {
  var x1, x2, y1, y2;
  
  for (var i = 0; i < coordinates.length; i++) {
    var inner = coordinates[i];
    
    for (var j = 0; j < inner.length; j++) {
      var innerinner = inner[j];
      for (var k = 0; k < innerinner.length; k++) {
        var lonlat = innerinner[k];
      
        var lon = lonlat[0];
        var lat = lonlat[1];
      
        if (x1 === undefined) {
          x1 = lon;
        } else if (lon < x1) {
          x1 = lon;
        }
      
        if (x2 === undefined) {
          x2 = lon;
        } else if (lon > x2) {
          x2 = lon;
        }

        if (y1 === undefined) {
          y1 = lat;
        } else if (lat < y1) {
          y1 = lat;
        }
      
        if (y2 === undefined) {
          y2 = lat;
        } else if (lat > y2) {
          y2 = lat;
        }
      }
    }
  }
  
  return { x: x1, y: y1, w: Math.abs(y2 - y1), h: Math.abs(x2 - x1) };
};

exports.FeatureCollection = FeatureCollection;