(function(){
  var app = angular.module('proof-directive',[]);

  app.directive('dtProof', function(){
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: function(elem, attrs){
        var type = 'Static';
        if (attrs.hasOwnProperty('collapsible')) { type = 'Collapse'};
        return 'templates/proof' + type + '.html';
      },
      scope: {},
      link: function(scope,elem,attrs){
        scope.collapsible = attrs.hasOwnProperty('collapsible');
        if (scope.collapsible) {
          scope.startCollapsed = attrs.hasOwnProperty('startCollapsed');
          scope.isOpen=!scope.startCollapsed;
        }
        scope.useName = false;
        if (attrs.hasOwnProperty('name')) {
          scope.useName = true;
          scope.name = attrs['name'];
        }
      },
    };
  });
})();