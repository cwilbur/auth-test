$(document).ready(function() {

  $('#login-button').on('click', function() {
    window.location.href = '/auth/github';
  });

  $('#logout-button').on('click', function() {
    window.location.href = '/auth/logout';
  });

});
