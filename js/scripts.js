const title = 'Cheat Sheeter';

const exampleCard = '# Header 1\n' +
    '## Header 2\n' +
    '### Header 3\n' +
    '#### Header 4\n' +
    '##### Header 5\n' +
    '###### Header 6\n' +
    '\n' +
    'Type bare words!\n' +
    'New line...\n' +
    '\n' +
    'Double new line.\n' +
    '\n' +
    '* Lists work too\n' +
    '* They have banded rows\n' +
    '* This makes it easier to read\n' +
    '* In fact, cards often look nice when they have only a list\n' +
    '* Can we have sublists?\n' +
    '    * Why yes.\n' +
    '    * Yes we can\n' +
    '    * with `* Text` (indent with spaces)\n' +
    '\n' +
    '---\n' +
    '\n' +
    'Dividers (`---`) are cool!\n' +
    '\n' +
    'We can also have tables...\n' +
    '\n' +
    '| Format | Symbols |\n' +
    '|:------:|:-------:|\n' +
    '| **bold** | `**bold**` |\n' +
    '| _italics_ | `_italics_` |\n' +
    '| ~~strikethrough~~ | ```~~strikethrough~~``` |\n' +
    '| **_~~all of it~~_** | `**_~~all of it~~_**` |\n' +
    '| `code` | ``` `code` ``` |\n' +
    '\n' +
    '_(strikethroughs are currently broken. GitHub issue posted)_\n' +
    '\n' +
    '---\n' +
    '\n' +
    'End page with `/end`\n' +
    '\n' +
    '/end\n' +
    '\n' +
    '* Will also reflow new cards (thanks to flex-boxes!)\n' +
    '* &nbsp;\n' +
    '* For now, color is permanent\n' +
    '* But eventually I\'d like to implement custom color schemes\n' +
    '* &nbsp;\n' +
    '* Also, you can input a blank list item (like above) with `&nbsp;`\n' +
    '\n' +
    '/end\n' +
    '\n' +
    '# Save data\n' +
    '* Currently login uses localStorage (saves to browser cache)\n' +
    '    * So don\'t put anything sensitive here!\n' +
    '    * And data can\'t be accessed from another browser/computer\n' +
    '    * Plans are to use personal MongoDB Atlas cluster eventually\n' +
    '## Features\n' +
    '* Login with an existing account, or register for a new one\n' +
    '* Only 1 save slot (save externally for multiple saves)\n' +
    '\n' +
    '/end\n' +
    '\n' +
    '# Future plans\n' +
    '* Use actual database for users & save data\n' +
    '* Add custom colors/theme\n' +
    '* Add print stylesheet\n' +
    '* Select number of columns (auto, 1, 2, ...)\n' +
    '* Evenly-sized columns\n' +
    '* Allow cards to span multiple columns\n' +
    '* Multiple save slots\n' +
    '* Multiple pages in single save';

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

    $scope.cardData = exampleCard;

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
