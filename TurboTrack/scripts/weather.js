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
                        //url: "data/weather.json",
                        data : {"username":"","ID": ""},
                        dataType: "json"
                    }
                }
            });

            //that.set("companyDataSource", dataSource);
        }
        
         
    });
 /*function companyClick(e){
            navigator.notification.alert(e.item + "tikladin ", function () { }, "Login Successful", 'OK');
           // new kendo.mobile.Application();
        }
       */
    app.companyService = {
        viewModel: new CompanyViewModel()
    };
})(window);



/*(function (global) {
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
                        url: "data/weather.json",
                        dataType: "json"
                    }
                }
            });

            //that.set("weatherDataSource", dataSource);
        }
    });

    app.companyService = {
        viewModel: new CompanyViewModel()
    };
})(window);


*/