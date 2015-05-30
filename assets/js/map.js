var resizeListings = function() {
    var height = jQuery(window).height() - jQuery('.c-clubs_listing').offset().top;
    height = (height < 0) ? height * -1 : height;
    return jQuery('.c-clubs_listing').height(height);
};

jQuery(document).ready(function() {
    var plugin = new clubLayerMap({
        iconCreateFunction: function(cluster) {
            return new clubIcon2();
            //return new L.DivIcon({
            //    html: '<b>' + cluster.getChildCount() + '</b>'
            //});
        }
    });
    jQuery('.toggle-cat').click(function() {
        if (jQuery(this).hasClass('selected')) {
            jQuery(this).removeClass('selected');
            plugin.removeCat(jQuery(this).text());
        } else {
            jQuery(this).addClass('selected');
            plugin.addCat(jQuery(this).text());
        }
        
        return false;
    });
    
    resizeListings();
    window.addEventListener('resize', function(){
        resizeListings();
    }, true);
    
    jQuery('.go-to-venue').on('click', function() {
        var id = jQuery(this).attr('href').slice(1);
        jQuery.each(plugin.getMarkers(), function(i, v) {
            if (parseInt(v.feature.properties.venue.id) === parseInt(id)) {
                plugin.markerClusters.zoomToShowLayer(v, function() {
                    v.openPopup();
                    plugin.getMap().panTo(v.getLatLng());
                });
            }
        });
    });
    
    jQuery('body').on('click', '.show-venue', function() {
        jQuery('.c-club').removeClass('highlight');
        var target = jQuery(this).attr('href');
        jQuery(target).addClass('highlight');
        jQuery(".c-clubs_listing").scrollTo(target, 1000);
        return false;
    });
    
    document.addEventListener("tpmb_toggleCat_after", function(e) {
        if (plugin.getCluster().getLayers().length == 0) {
            plugin.resetCluster();
        }
    });
    
    document.addEventListener("tpmb_resetCluster_before", function(e) {
        alert('No places left, markers will be reset.');
    });
    
    document.addEventListener("tpmb_resetCluster_after", function(e) {
        jQuery('.toggle-cat').addClass('selected');
    });
});