(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        username: "",
        password: "",

        onLogin: function () {
          
            //original Code//////////////
            var that = this,
                username = that.get("username").trim(),
                password = that.get("password").trim();
				
            	username= "kazim@ipnordic.dk";
           	 password= "secure4Kazim";
            	
            
            var logindataSource = new kendo.data.DataSource({
  				transport: {
    			      read: {
         	 			  url: 'http://win1.ipnordic.dk/ws-turbomobile/TurboTrackService.svc/checkuser',
                          //url: 'http://localhost:55939/TurboTrackService.svc/checkuser',
                          data: {"username":"" + username + "","password":"" + password + ""},		
                          contentType: "application/json; charset=utf-8", // tells the web service to serialize JSON
                          type: "GET", //use HTTP POST request as the default GET is not allowed for ASMX
          				dataType: "json",
                          processdata: false,
                          
        			  },
                   
  				},
  				
			});
            
            logindataSource.fetch(function(){
                var data = this.data();
	
                //if (username===data[0].Login && password === data[0].Password) {
                if (data.ID === null || data.ID ==="" ) {
                    navigator.notification.alert("Invalid Username or Password!",function () { }, "Login failed", 'OK');
	                return;  
             	}
                else{
                  that.set("isLoggedIn", true);
                    //navigator.notification.alert(data[0].ID + data[0].Name, function () { }, "Login Successful", 'OK');
                    var app = new kendo.mobile.Application();
                    app.navigate("#tabstrip-company");
                    $("#CompanyList").data("kendoMobileListView").setDataSource(logindataSource);  
                }
	            if (username === "" || password === "") {
                   navigator.notification.alert("Both fields are required!",function () { }, "Login failed", 'OK');
	                return;
    	        }
  			return;
			});
           
        },
        
        
        onLogout: function () {
            var that = this;

            that.clearForm();
            that.set("isLoggedIn", false);
           $("#CompanyList").data("kendoMobileListView").setDataSource("companyDataSource");

           /* var app = new kendo.mobile.Application();
            var tabstrip = app.view().footer.find(".km-tabstrip").data("kendoMobileTabStrip");
            tabstrip.clear();*/
        },

        clearForm: function () {
            var that = this;

            that.set("username", "");
            that.set("password", "");
        },

        checkEnter: function (e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        }
    });

    app.loginService = {
        viewModel: new LoginViewModel()
    };
})(window);