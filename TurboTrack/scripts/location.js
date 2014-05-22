(function (global) {
    var map,
        geocoder,
        LocationViewModel,
    deger,
        app = global.app = global.app || {};

    LocationViewModel = kendo.data.ObservableObject.extend({
        _lastMarker: null,
        _isLoading: false,

        address: "",
        isGoogleMapsInitialized: false,

      
        onNavigateHome: function () {
            var that = this,
                position;
            

            that._isLoading = true;
            that.toggleLoading();
           

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    //position = new google.maps.LatLng(12.0480551,-4.0236111) 
                    //24.83475413428133,  9.348807011947656);
                    map.panTo(position);
                    that._putMarker(position);
                    
                    
                    that._isLoading = false;
                    that.toggleLoading();
                },
                function (error) {
                    //default map coordinates
                    position = new google.maps.LatLng(39.0480551,24.0236111); 
                  

                    that._isLoading = false;
                    that.toggleLoading();

                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                        function () { }, "Location failed", 'OK');
                },
                {
                    timeout: 30000,
                    enableHighAccuracy: true
                }
            );
        },

        onSearchAddress: function (e) {
            var that = this;
			
            
            geocoder.geocode(
                {
                    'address':that.get("address")
                },
                function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        navigator.notification.alert("Unable to find address. Deger:" + deger + ":",
                            function () { }, "Search failed", 'OK');

                        return;
                    }

                    map.panTo(results[0].geometry.location);
                    that._putMarker(results[0].geometry.location);
                });
        },

        toggleLoading: function () {
            if (this._isLoading) {
                kendo.mobile.application.showLoading();
            } else {
                kendo.mobile.application.hideLoading();
            }
        },

        _putMarker: function (position) {
            var that = this;

            if (that._lastMarker !== null && that._lastMarker !== undefined) {
                that._lastMarker.setMap(null);
            }

            that._lastMarker = new google.maps.Marker({
                map: map,
                position: position
            });
        }
    });

    app.locationService = {
        initLocation: function (e) {
            var mapOptions;

            if (typeof google === "undefined") {
                return;
            }

            app.locationService.viewModel.set("isGoogleMapsInitialized", true);

            mapOptions = {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
                },

                mapTypeControl: false,
                streetViewControl: false
            };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            geocoder = new google.maps.Geocoder();
            //app.locationService.viewModel.onNavigateHome.apply(app.locationService.viewModel, []);
            //navigator.notification.alert("app.locationservice.intilocation icinden:  " + e.view.params.deger);
            
           
        },

        show: function (e) {
            
            if (!app.locationService.viewModel.get("isGoogleMapsInitialized")) {
                return;
            }

            //resize the map in case the orientation has been changed while showing other tab
            google.maps.event.trigger(map, "resize");
            //position = new google.maps.LatLng(parseFloat(e.view.params.lat), e.view.params.lon);
            //position = new google.maps.LatLng(51.519375, -0.12697); //london
            position = new google.maps.LatLng(e.view.params.lat, e.view.params.lon);
            map.panTo(position);
            var marker = new google.maps.Marker({
                position: position,
                map: map
                
            });
        },

        hide: function () {
            //hide loading mask if user changed the tab as it is only relevant to location tab
            kendo.mobile.application.hideLoading();
        },

        onShowlatlang: function (e) {

            deger = e.view.params.lastValidLongitude;
            //var lng = e.view.params.lastValidLongitude; 

        },


        viewModel: new LocationViewModel()
    };
}
)(window);