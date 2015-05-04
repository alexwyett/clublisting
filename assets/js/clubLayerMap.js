//
// Example of how to override default behaviour
//
//leafletClusterMap.prototype.getBoundsSettings = function() {
//    return {
//        maxZoom: 13
//    };
//};

var clubLayerMap = leafletClusterMap.extend({
    init: function() {
        this._super();
        that = this;
        loaded = false;
        
        jQuery.ajax({
            url: CLUBS.basePath + '/clubs.json',
            async: false,
            dataType: 'json',
            success: function(json) {
                that.geoJson = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return that.defineMarker(feature, latlng);
                    },
                    onEachFeature: function (feature, layer) {
                        that.definePopup(feature, layer);
                    }
                });

                that.resetCluster();
            }
        });
        
        that.tiles.on('load', function() {
            if (loaded === false) {
                that.fitBounds();
                loaded = true;
            }
        });
        
        _toggleCat = function(catname, action) {
            that.geoJson.eachLayer(function (layer) {
                hasCat = false;
                
                a = layer.feature.properties.tags;
                for (var i = 0; i < a.length; i++) {
                    if (catname === a[i].name) {
                        hasCat = true;
                    }
                }

                if (hasCat === true) {
                    if (action === 'add') {
                        that.markerClusters.addLayer(layer);
                    } else if (action === 'remove') {
                        that.markerClusters.removeLayer(layer);
                    }
                }
            });
        };
        
        // Call function which can be prototyped
        that.hook_init();
    },
    
    hook_init: function() {},
    
    removeCat: function(catname) {
        this.fireEvent('clubmap_removeCat_before');
        this.toggleCat(catname, 'remove');
        this.fireEvent('clubmap_removeCat_after');
    },
    
    addCat: function(catname) {
        this.fireEvent('clubmap_addCat_before');
        this.toggleCat(catname, 'add');
        this.fireEvent('clubmap_addCat_after');
    },
    
    toggleCat: function(catname, action) {
        this.fireEvent('clubmap_toggleCat_before');
        _toggleCat(catname, action);
        this.fitBounds();
        this.fireEvent('clubmap_toggleCat_after');
    },
    
    resetCluster: function() {
        that.fireEvent('clubmap_resetCluster_before');
        this.refreshLayers();
        that.fireEvent('clubmap_resetCluster_after');
    },
    
    refreshLayers: function() {
        that = this;
        that.markerClusters.clearLayers();
        that.geoJson.eachLayer(function (layer) {
            that.markerClusters.addLayer(layer);
        });
    },
    
    definePopup: function(feature, layer) {
        tag = '<p>' + feature.properties.venue.name + '</p>';
        layer.bindPopup(tag);
    },
    
    defineMarker: function(feature, latlng) {

        //Extend the Default marker class
        var icon = L.Icon.Default.extend({
            options: {
                //iconUrl: CLUBS.basePath + '/assets/css/images/marker-icon.png' 
            }
        });
        
        var ic = new icon();
        
        return L.marker(latlng, { icon: ic });
    }
});