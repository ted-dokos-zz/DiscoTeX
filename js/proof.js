(function(){
  var app = angular.module('proof-directive',[]);

  app.directive('dtProof', function(){
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'templates/proofElement.html',
      scope: {},
      link: function(scope,elem,attrs){
        scope.startCollapsed = false;
        scope.useName = false;
        if (attrs.hasOwnProperty('startCollapsed')) {
          scope.startCollapsed = true;
        }
        scope.isOpen=!scope.startCollapsed;
        if ('name' in attrs) {
          scope.useName = true;
          scope.name = attrs['name'];
        }
      },
    };
  });
})();