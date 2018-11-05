angular.module('app').component('sidebar', {
  templateUrl: 'app/views/sidebar.template.html',
  controller: sidebarCtrl,
});

function sidebarCtrl($scope, $element, $attrs) {
  ctrl = this;
  ctrl.toggle = function(){
    $('#sidebar').toggleClass('active');
    $(this).toggleClass('active');
  };
}
