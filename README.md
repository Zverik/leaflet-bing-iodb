# IODB for Bing Leaflet Layer

[**Demonstration page**](http://zverik.github.io/leaflet-bing-iodb/)

Nice projects like [show-me-the-way](http://osmlab.github.io/show-me-the-way/), that
show OSM data on top of Bing imagery, have one tiny flaw: in most areas of the world
Bing imagery is offset by several meters, and mappers usually fix its alignment using
GPX traces. This results in lines shown being slightly misaligned with imagery.
This plugin alters [Bing layer](https://github.com/shramov/leaflet-plugins/blob/master/layer/tile/Bing.js)
using responses from [Imagery Offset Database](http://wiki.openstreetmap.org/wiki/Imagery_Offset_Database).
So if there is an offset in the database, it is applied to the Bing layer (only on zooms 15 and higher).

Testing showed this plugin makes one request in 4-5 seconds when scrolling, so while
projected load on IODB server is not high, please do not use this plugin on public
map displaying websites, like openstreetmap.ru. Show-me-the-way is ok, I guess: not many
users watch it simultaneously.

Usage is simple: include `Bing.IODB.js` — and you're set.

Written by Ilya Zverev, licensed WTFPL.
