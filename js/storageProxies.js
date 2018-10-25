var LocalProxy = {
    usr: undefined,

    // All functions return success/fail messages for now
    //   (useful for console debugging)

    isLoggedIn : function() {
        return this.usr !== undefined;
    },
    hasLogIn : function(query) {
        return localStorage.getItem(query) !== null;
    },
    getLoginToken : function(username, password) {
        return username + password;
    },

    login : function(username, password) {
        // Only login if not currently logged inFailed to save data
        if (!this.isLoggedIn()) {
            // Concat username + password for usr login token
            let query = this.getLoginToken(username, password);

            // If user exists in localStorage, then set login token to the query
            if (this.hasLogIn(query)) {
                this.usr = query;

                return "Successful login";
            }
            else {
                return "That username/password combo does not exist";
            }
        }
        else {
            return "You are already logged in";
        }
    },
    register : function(username, password) {
        if (!this.isLoggedIn()) {
            let query = this.getLoginToken(username, password);

            if (!this.hasLogIn(query)) {
                localStorage.setItem(query, JSON.stringify([]));
                return "Successful registration";
            }
            else {
                return "That username/password combo already exists";
            }
        }
        else {
            return "Already logged in";
        }
    },

    store : function (data) {
        if (this.isLoggedIn()) {
            let usr_card_list = JSON.parse(localStorage.getItem(this.usr));
            usr_card_list = usr_card_list.concat(data);
            localStorage.setItem(this.usr, JSON.stringify(usr_card_list));
            return "Data successfully saved";
        }
        else {
            return "Not logged in";
        }
    },
    getCards : function () {
        if (this.isLoggedIn()) {
            return JSON.parse(localStorage.getItem(this.usr));
        }
        else {
            return "Not logged in";
        }
    }
};