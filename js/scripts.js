const title = 'Cheat Sheeter';

const exampleCard = "# Example\n\n" +
    "| Heads | Tails |\n" +
    "|:-----:|:-----:|\n" +
    "| 2     | 1     |";

//=========================================================

const app = angular.module('cheatsheetapp', ['ngSanitize','ng-showdown']);

// Markdown -> HTML
//=========================================================

const showdownOpts = {
    'tables': true,
    'strikethrough': true,
    'disableForced4SpacesIndentedSublists': true
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
