var leafletMap = AwBase.extend({    
    /**
     * Initialise the map.  Call this to go!
     * 
     * @param {Object} args Constructor arguments
     * 
     * @returns {null}
     */
    init: function(args) {
        // Get options
        this.options = this.paramsextend({}, this.getDefaults(), args);
        
        this.map = L.map(this.options.container).setView(
            this.options.center,
            this.options.zoom
        );

        this.tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
        }).addTo(this.map);
    },
    
    /**
     * Get the map defaults
     * 
     * @returns {Array}
     */
    getDefaults: function() {
        return {
            center: [
                51.505,
                -0.09
            ],
            zoom: 10,
            container: 'map'
        };
    },
    
    /**
     * Return the map object
     * 
     * @returns {L.map}
     */
    getMap: function() {
        return this.map;
    }
});