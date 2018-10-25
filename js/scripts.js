const title = 'Cheat Sheeter';

const exampleCard = "# Example\n\n" +
    "| 1d6 | type    |\n" +
    "|:---:|:-------:|\n" +
    "| 1   | fire    |\n" +
    "| 2   | cold    |\n" +
    "| 3   | acid    |\n" +
    "| 4   | shock   |\n" +
    "| 5   | psychic |\n" +
    "| 6   | force   |\n" +
    "\n" +
    "_italics_ and **bold** and ~~strikethroughs~~ oh my!\n" +
    "\n" +
    "_**List of many things**_\n" +
    "* Thing 1\n" +
    "* Thing 2\n" +
    "    1. Subthing 1\n" +
    "       * 3 deep!\n" +
    "    1. Subthing 2";

//=========================================================

const app = angular.module('cheatsheetapp', ['ngSanitize','ng-showdown']);

// Markdown -> HTML
//=========================================================

const showdownOpts = {
    'tables': true,
    'strikethrough': true
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
        template: '<div bind-html-compile="trustedHtml"></div>'
    };
});

app.directive('bindHtmlCompile', function($compile) {
    // noinspection JSUnusedGlobalSymbols
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch(function() {
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

    $scope.cards = [exampleCard];
});
