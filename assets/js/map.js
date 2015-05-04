jQuery(document).ready(function() {
    var plugin = new clubLayerMap();
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