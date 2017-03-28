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
            element: "=",
            dynamicUrl: "@"
        },
        replace: true,
        link: function(scope, element, attrs) {
            var template = $compile(['<',scope.element,'>',scope.text,'</',scope.element,'>'].join(''))(scope);
            console.log(scope.element, scope.text)
            element.replaceWith(template);               
        }
      }
}]);

app.controller('config', function(postService) {
                var ctrl = this; 
                postService.getAllPosts()
                    .then(function(blogData){
                        ctrl.blogConfig = blogData.config;
                    })
            });

app.component('allPosts', {
            bindings: {},
            templateUrl: 'front/allPosts.html',
            controller: function(postService) {
                var ctrl = this; 
                postService.getAllPosts()
                    .then(function(blogData){
                        ctrl.allPosts = blogData.postData;
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
                    .then(function(singlePostData){
                        ctrl.singlePostData = singlePostData;
                    })
                    .then(postService.getAllPosts)
                    .then(function(blogData){
                        var mode = $location.search().mode;
                        if (mode == 'r') {
                            ctrl.code = $location.search().code;
                            $window.location.href = `${blogData.config.baseRedirect}${ctrl.code}?route_key=invite&v=OUT`;
                        }
                        if (!ctrl.code) {
                            ctrl.dynamicUrl = blogData.config.defaultRedirect;
                        }
                    })
            }
})