const LocalProxy = {
    token: undefined,
    username: undefined,

    // All functions return success/fail messages for now
    //   (useful for console debugging)

    isLoggedIn: function () {
        return this.token !== undefined;
    },
    hasLogIn: function (username, password) {
        query = this.getLoginToken(username, password);
        return localStorage.getItem(query) !== null;
    },
    getLoginToken: function (username, password) {
        return username + password;
    },

    login: function (username, password) {
        // Only login if not currently logged inFailed to save data
        if (!this.isLoggedIn()) {

            // If user exists in localStorage, then set login token to the query
            if (this.hasLogIn(username, password)) {
                this.token = this.getLoginToken(username, password);
                this.username = username;

                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    logout: function (username, password) {
        // Only login if not currently logged inFailed to save data
        this.token = undefined;
    },
    register: function (username, password) {
        if (!this.isLoggedIn()) {
            if (!this.hasLogIn(username, password)) {
                localStorage.setItem(this.getLoginToken(username, password), JSON.stringify([]));
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

    store: function (data) {
        if (this.isLoggedIn()) {
            localStorage.setItem(this.token, JSON.stringify(data));
            return "Data successfully saved";
        }
        else {
            return "Not logged in";
        }
    },
    getCards: function () {
        if (this.isLoggedIn()) {
            return JSON.parse(localStorage.getItem(this.token));
        }
        else {
            return "Not logged in";
        }
    }
};