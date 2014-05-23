(function (global) {
    var CompanyViewModel,
    companyid,
        app = global.app = global.app || {};

    CompanyViewModel = kendo.data.ObservableObject.extend({
        companyDataSource: null,

        init: function () {
            var that = this,
               
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            dataSource = new kendo.data.DataSource({
                /*transport: {
                    read: {
                        url:"data/company.json",
                        data : {"username":"","ID": ""},
                        dataType:"json"
                    }
                }*/
            });

            that.set("companyDataSource", dataSource);
        },

        onClick: function (e) {
            var that = this,
                 companyid,
               deviceDataSource;

            //companyid = "123";
            companyid=e.dataItem.ID;
            //navigator.notification.alert(e.item.text());
            //navigator.notification.alert(e.dataItem.ID);

            kendo.data.ObservableObject.fn.init.apply(that, []);
            deviceDataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'http://win1.ipnordic.dk/ws-turbomobile/TurboTrackService.svc/getdevices',
                        //url: 'http://localhost:55939/TurboTrackService.svc/getdevices',
                        data: { "companyid": "" + companyid + "" },
                        contentType: "application/json; charset=utf-8", // tells the web service to serialize JSON
                        type: "GET", //use HTTP POST request as the default GET is not allowed for ASMX
                        dataType: "json",
                        processdata: false,
                    }
                }
            });
            
            var app = new kendo.mobile.Application();
            app.navigate("#tabstrip-device");
            $("#DeviceList").data("kendoMobileListView").setDataSource(deviceDataSource);
           
        }
         
    });
 
    app.companyService = {
        viewModel: new CompanyViewModel()
    };
})(window);

