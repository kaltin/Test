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
                transport: {
                    read: {
                        url:"data/company.json",
                        dataType:"json"
                    }
                }
            });
            that.set("deviceDataSource", dataSource);
        },

    });
 
    app.deviceService = {
        viewModel: new DeviceViewModel()
    };
})(window);

