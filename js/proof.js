(function(){
  var app = angular.module('proof-directive',[]);

  app.directive('dtProof', function(){
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'templates/proofElement.html',
      scope: {},
      link: function(scope,elem,attrs){
        scope.collapsible = attrs.hasOwnProperty('collapsible');
        if (scope.collapsible) {
          scope.startCollapsed = attrs.hasOwnProperty('startCollapsed');
          scope.isOpen=!scope.startCollapsed;
        }
        scope.useName = false;
        if ('name' in attrs) {
          scope.useName = true;
          scope.name = attrs['name'];
        }
      },
    };
  });
})();