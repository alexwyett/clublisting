var leafletClusterMap = leafletMap.extend({
    init: function(args) {
        this._super(args);
        this.markerClusters = L.markerClusterGroup({
            iconCreateFunction: (typeof this.options.iconCreateFunction === 'function') ? this.options.iconCreateFunction : false,
            showCoverageOnHover: false
        });
        this.getMap().addLayer(this.markerClusters);
    },
    
    fitBounds: function() {
        if (this.markerClusters.getLayers().length > 0) {
            bnds = [];
            this.markerClusters.eachLayer(function(layer) {
                bnds.push(layer.getLatLng());
            });
            this.map.fitBounds(
                L.latLngBounds(bnds),
                this.getBoundsSettings()
            );
        }
    },
    
    getCluster: function() {
        return this.markerClusters;
    },
    
    getBoundsSettings: function() {
        return {
            padding: [20, 20]
        };
    },
    
    getMarkerClusters: function() {
        return this.markerClusters;
    },
    
    getMarkers: function() {
        return this.getMarkerClusters().getLayers();
    }
});