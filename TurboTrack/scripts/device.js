(function (global) {
    var DeviceViewModel,
        app = global.app = global.app || {};

    DeviceViewModel = kendo.data.ObservableObject.extend({
        deviceDataSource: null,

        init: function () {
            var that = this,
               
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            dataSource = new kendo.data.DataSource({
               /* transport: {
                    read: {
                        //url:"data/device.json",
                        data: {"description":"","simPhoneNumber":"","lastEventTimeStamp":"" },
                        dataType:"json"
                    }
                }*/
            });
            that.set("deviceDataSource", dataSource);
        },
		onClick: function(e){
            var that =this;
            
     
		},
        
    });
 
    app.deviceService = {
        viewModel: new DeviceViewModel()
    };
})(window);

