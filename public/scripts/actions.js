$(document).ready(function() {

  $('#login-button').on('click', function() {
    var username = $('#login-user').val();
    var password = $('#login-password').val();

    if (username.length && password.length) {
      var loginProc = $.ajax({
        type: 'post',
        url: '/login',
        contentType: 'application/json',
        data: JSON.stringify({
          username: username,
          password: password
        }),
      });
      loginProc.done(function(data, textStatus, jqXHR) {
        if (jqXHR.status === 200) {
          alert('login succeeded');
        } else if (jqXHR.status === 401) {
          alert('login failed');
        } else {
          alert('login status unknown, status code ' + jqXHR.status);
        }
      });
      loginProc.fail(function(jqXHR, textStatus, errorThrown) {
        console.log('jqXHR: %j', jqXHR);
        console.log('textStatus: %j', textStatus);
        console.log('errorThrown: %j', errorThrown);
      });
    }
  });

  $('#logout-button').on('click', function() {
    $.ajax({
      type: 'get',
      url: '/logout'
    });
  });

  $('#register-button').on('click', function() {
    var githubId = $('#github-id').val();
    var username = $('#username').val();
    var password = $('#password').val();
    var displayName = $('#display-name').val();
    var profileUrl = $('#profile-url').val();
    var email = $('#email').val();

    if (githubId.length && username.length && password.length &&
      displayName.length && profileUrl.lentgh && email.length) {
      $.ajax({
        type: 'post',
        url: '/register',
        contentType: 'application/json',
        data: JSON.stringify({
          githubId: githubId,
          username: username,
          password: password,
          displayName: displayName,
          profileUrl: profileUrl,
          email: email
        })
      }).done(function(data, textStatus, jqXHR) {
        if (confirm('account created successfully! reloading page all logged-in-ified....'));
        window.location.reload();
      }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log('jqXHR: %j', jqXHR);
        console.log('textStatus: %j', textStatus);
        console.log('errorThrown: %j', errorThrown);
      });
    }
  });

});
