var app = angular.module('BlogApp', ["ngRoute", "ngResource"]);

app.config(function($locationProvider, $routeProvider){
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/", {
            template : "<all-posts></all-posts>"
        })
        .when("/posts/:name", {
            template : "<single-post></single-post>"
        })
        .otherwise({
            template : "<all-posts></all-posts>"
        });
});

app.service('postService', function tcSpecsService($resource, $q){

    var allPosts;
    var deferred = $q.defer();

    var allPostSrc = $resource('/api/posts/all', {});
    var singlePostSrc = $resource('/api/posts/:name', {name:'@name'});

    function getAllPosts() {
        if (!allPosts) {
            return allPostSrc.get().$promise
                .then(function(data) {
                    allPosts = data;
                    return allPosts;
                })
        } else {
            return $q(function(resolve, reject) { resolve(allPosts) });
        }
        
    }

    

    return { allPostSrc: allPostSrc, getAllPosts: getAllPosts, singlePostSrc: singlePostSrc };

});

app.directive('dynamicElement', ['$compile', function ($compile) {
      return { 
        restrict: 'E', 
        scope: {
            text: "=",
            element: "="
        },
        replace: true,
        link: function(scope, element, attrs) {
            // var template = $compile(scope.message)(scope);
            var template = $compile(['<',scope.element,'>',scope.text,'</',scope.element,'>'].join(''))(scope);
            console.log(scope.element, scope.text)
            element.replaceWith(template);               
        }/*,
        controller: ['$scope', function($scope) {
           $scope.clickMe = function(){
                alert("hi")
           };
        }]*/
      }
}]);



app.component('allPosts', {
            bindings: {},
            templateUrl: 'front/allPosts.html',
            controller: function(postService) {
                var ctrl = this; 
                postService.getAllPosts()
                    .then(function(allPosts){
                        ctrl.allPosts = allPosts;
                        //ctrl.htmlString = "<h1>DYNAMIC TITLE</h1>"
                        console.log('|||||', ctrl.allPosts)
                    })
            }
})

app.component('singlePost', {
            bindings: {},
            templateUrl: 'front/singlePost.html',
            controller: function($window, $interval, $timeout, $location, $http, postService, $routeParams) {
                var ctrl = this;
                

                postService.singlePostSrc
                    .get({name: $routeParams.name})
                    .$promise
                    .then(function(data){
                        console.log('|||||', data)
                    })

                var mode = $location.search().mode;
                if (mode == 'r') {
                    ctrl.code = $location.search().code;
                    $window.location.href = 'https://www.amazon.com/exec/obidos/ASIN/'+ctrl.code;
                }
                if (!ctrl.code) {
                    ctrl.code = 1593275994;
                }
            }
})