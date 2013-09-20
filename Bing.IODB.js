// Written by Ilya Zverev, licensed WTFPL

L.BingLayer = L.BingLayer.extend({
    options: {
        offsetServer: 'http://offsets.textual.ru/',
        offsetUpdateDistance: 1000,
        offsetEnabled: true
    },

    setOffsetEnabled: function(e) {
        if( e != this.options.offsetEnabled ) {
            this.options.offsetEnabled = e;
            this._updateContainerOffset();
        }
    },

    _update: function() {
        if (this._url == null || !this._map) return;
        this._update_attribution();
        if( !this._offset0 ) this._offset0 = new L.Point(0, 0);
        this._refreshOffset();
        this._updateContainerOffset();
        L.TileLayer.prototype._update.apply(this, []);
    },

    _refreshOffset: function() {
        if( this._map.getZoom() < 15 )
            return;
        var currentPos = this._map.getCenter();
        if( this._lastOffsetPos && this._lastOffsetPos.distanceTo(currentPos) < this.options.offsetUpdateDistance )
            return;
        this._lastOffsetPos = currentPos;
        this._queryIODB(currentPos, this, function(ctx, data) {
            var found = null;
            for( var i = 0; i < data.length; i++ ) {
                if( data[i]['type'] == 'offset' && !data[i]['deprecated'] ) {
                    found = data[i];
                    break;
                }
            }
            var distance = 0;
            if( found ) {
                var from = new L.LatLng(found['lat'], found['lon']);
                var to = new L.LatLng(found['imlat'], found['imlon']);
                distance = from.distanceTo(to);
                ctx._offset = ctx._map.project(to, 22).subtract(ctx._map.project(from, 22));
            } else
                ctx._offset = ctx._offset0;
            ctx._updateContainerOffset();
            ctx.fire('offset', { distance: distance, found: found });
        });
    },

    _updateContainerOffset: function() {
        if( !this._offset ) return;
        var style = this._container.style,
            zoom = this._map.getZoom(),
            offset = zoom < 15 || !this.options.offsetEnabled ? this._offset0 : this._offset,
            zoomDiff = Math.pow(2, 22 - zoom);
        style.left = Math.round(-offset.x / zoomDiff) + 'px';
        style.top = Math.round(-offset.y / zoomDiff) + 'px';
    },

    _queryIODB: function (latlng, context, callback) {
        var url = this.options.offsetServer + 'get?format=json&imagery=bing&lat=' + latlng.lat + '&lon=' + latlng.lng;
        var http = null;
        if (window.XMLHttpRequest) {
            http = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // Older IE.
            http = new ActiveXObject("MSXML2.XMLHTTP.3.0");
        }
        http.onreadystatechange = function() {
            if( http.readyState != 4 || http.status != 200 ) return;
            var result = eval(http.responseText);
            callback(context, result);
        };
        http.open('GET', url, true);
        http.send(null);
    }
});
