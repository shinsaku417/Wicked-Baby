describe('Routing', function () {
  var $route;
  beforeEach(module('wickedBaby'));

  beforeEach(inject(function($injector){
    $route = $injector.get('$route');
  }));

  it('Should have /student route, template, and controller', function () {
    expect($route.routes['/student']).toBeTruthy();
    expect($route.routes['/student'].controller).toBe('StudentCtrl');
    expect($route.routes['/student'].templateUrl).toBe('public/client/student.html');
  });

  it('Should have /teacher route, template, and controller', function () {
    expect($route.routes['/teacher']).toBeTruthy();
    expect($route.routes['/teacher'].controller).toBe('TeacherCtrl');
    expect($route.routes['/teacher'].templateUrl).toBe('public/client/teacher.html');
  });
});