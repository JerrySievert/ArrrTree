# ArrrTree

A very simple Javascript engine to determine whether a point is within a polygon.

* GeoJSON Parser
* Simple envelope detection
* Simple point in polygon detection
* RTree library comes from https://github.com/imbcmdth/RTree

## Running the Sample

    $ node index.js

## Caveats

* It does not bother with 1/-1 latitude/longitude boundaries
* It was written in about 2 hours
* One of those hours was with a fever
* Multipolygon point in polygon may not work right now
