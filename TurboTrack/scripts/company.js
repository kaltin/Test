(function (global) {
    var CompanyViewModel,
        app = global.app = global.app || {};

    CompanyViewModel = kendo.data.ObservableObject.extend({
        companyDataSource: null,

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

            that.set("companyDataSource", dataSource);
        },

        onClick: function (e) {
            var that = this,
                 companyid,
               deviceDataSource;

            companyid = "123";
            // kendoConsole.log("event :: click (" + e.item.text() + ")", false, "#mobile-listview-events");
            //navigator.notification.alert(e.item.text());

            kendo.data.ObservableObject.fn.init.apply(that, []);
            deviceDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        //url: 'http://win1.ipnordic.dk/ws-turbomobile/TurboTrackService.svc/getdevices',
                        url: 'http://localhost:55939/TurboTrackService.svc/getdevices',
                        data: { "companyid": "" + companyid + "" },
                        contentType: "application/json; charset=utf-8", // tells the web service to serialize JSON
                        type: "GET", //use HTTP POST request as the default GET is not allowed for ASMX
                        dataType: "json",
                        processdata: false,
                    }
                }
            });

            $("#DeviceList").data("kendoMobileListView").setDataSource(deviceDataSource);
            var app = new kendo.mobile.Application();
            app.navigate("#tabstrip-device");
           
        }
         
    });
 
    app.companyService = {
        viewModel: new CompanyViewModel()
    };
})(window);

