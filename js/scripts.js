const title = 'Cheat Sheeter';

//=========================================================

const app = angular.module('cheatsheetapp', ['ngSanitize','ng-showdown']);

// Markdown -> HTML
//=========================================================

const showdownOpts = {
    'tables': true,
    'strikethrough': true,
    'underline': true,
    'simpleLineBreaks': true,
    'requireSpaceBeforeHeadingText': true,
    'headerLevelStart': 2,
    'parseImgDimensions': true
};

app.config(['$showdownProvider', function($showdownProvider) {
    for (let k in showdownOpts) {
        $showdownProvider.setOption(k, showdownOpts[k]);
    }
}]);

app.directive('markdown', function($showdown, $sanitize, $sce) {
    // noinspection JSUnusedGlobalSymbols
    return {
        restrict: 'A',
        link: function (scope) {
            scope.$watch('model', function (newValue) {
                let showdownHTML;
                if (typeof newValue === 'string') {
                    showdownHTML = $showdown.makeHtml(newValue);
                    scope.trustedHtml = ($showdown.getOption('sanitize')) ? $sanitize(showdownHTML) : $sce.trustAsHtml(showdownHTML);
                } else {
                    scope.trustedHtml = typeof newValue;
                }
            });
        },
        scope: {
            model: '=markdown'
        },
        template: '<div class="invisibleWrapper" bind-html-compile="trustedHtml"></div>'
    };
});

app.directive('bindHtmlCompile', function($compile) {
    // noinspection JSUnusedGlobalSymbols
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch(function() {
                // noinspection JSUnresolvedVariable
                return scope.$eval(attrs.bindHtmlCompile);
            }, function(value) {
                element.html(value);
                $compile(element.contents())(scope);
            });
        }
    };
});

// Controller
//=========================================================

app.controller('mainCtrl', function ($scope) {
    $scope.title = title;

    $scope.cardData = '# Example\n\nType with markdown here!';

    $scope.proxy = LocalProxy;

    $scope.loggedIn = false;

    $scope.getCardList = function() {
        let data = [];
        const cardList = $scope.cardData.split('\n/end');

        for (let i in cardList) {
            const x = cardList[i];
            if (x !== "") {
                data = data.concat(x);
            }
        }

        return data;
    };

    $scope.save = function() {
        $scope.ensureLogin();
        $scope.proxy.store($scope.cardData);
    };

    $scope.load = function() {
        $scope.ensureLogin();
        try {
            $scope.cardData = $scope.proxy.getCards();
        }
        catch(err) {
            console.log($scope.proxy.getCards());
        }
    };

    $scope.register = function() {
        let usr = prompt('Username...');
        if (usr === null)
            return;
        let pwd = prompt('Password...');
        if (pwd === null)
            return;

        $scope.proxy.register(usr, pwd);
        $scope.proxy.ensureLogin(usr, pwd);
        $scope.loggedIn = true;
    };

    $scope.ensureLogin = function() {
        if (!$scope.proxy.isLoggedIn()) {
            let usr = prompt('Username...');
            if (usr === null)
                return;
            let pwd = prompt('Password...');
            if (pwd === null)
                return;

            if (!$scope.proxy.hasLogIn(usr, pwd)) {
                alert('No login found.');
            }

            $scope.loggedIn = $scope.proxy.login(usr, pwd);
        }
    };

    $scope.logout = function () {
        if ($scope.proxy.isLoggedIn()) {
            $scope.proxy.logout();
            $scope.loggedIn = false;
        }
    }
});
