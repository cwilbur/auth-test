# How to set up Passport Local Authentication 

## Make sure you have an error handling route.

Every callback in every library that every bit of middleware uses accepts an error parameter.  Sooner or later, someone is going to call one of those.  In our code so far, we pass the error up as far as the routing middleware.  But what happens then?

Our error handler handles it  Which is why we need one.

Add this code to your app.js file, after you have defined all your routes but before you start the server:

```javascript
app.use(function(err, req, res, next) {
  console.log(err.message);
  console.error(err.stack);
  res.sendStatus(500);
});
```

How this works:

The four-parameter list marks this as error-handling middleware.  (Remember, ordinary middleware takes three parameter (`req`, `res`, and `next`), while terminal middleware takes two (just `res` and `req`).

So when any chunk of middleware ends by calling `done(err)`, and `err` evaluates to a truthy value (with the sole exception of the string 'route', for historical and convenience reasons), the next handler invoked is *not* the next one defined for that method and endpoint, but the first registered error handler.

The actual handler we use is very simple. It logs the error and returns an HTTP
status code of 500 (Internal Server Error) to the client. For development and
basic production, that's really all it needs to do.

## Make sure you're keeping logs.

The debugging tools available in production environments are depressingly few and limited.  You won't have easy access to debuggers or REPLs; you might not have access to anything but logfiles.  So: improve your logfiles.

The basic logging module for express is `morgan`.  Install it in the usual way:

```shell
npm install --save morgan
```.  

Add the following lines to your app.js file. 

```javascript
var morgan = require('morgan');
app.use(morgan('dev'));
```

 They don't have to remain together as long as the require line happens before the use line, because morgan attaches a handler to the response object so that logging data is not considered complete and log line is not written until the response is sent.

 Morgan has an insane amount of configurability, and there are lots of plugins. You can rabbit-hole for weeks. 

## Set up sessions and a backing store for them.

In old school web development, session were one of the architectural problems that new developers ran into first.  With the more modern approach we've used in this class, we haven't had much use for them yet.  Still, even though API clients don't, users still balk at having to re-enter their username and password for each page load.

Fortunately for us, because sessions have been a problem for a while, they are well understood and a lot of the solutions have been automated.

The most common module for session management with Express is called, surprisingly enough, `express-session`,

Now we need to install `express-session`, middleware to manage sessions, and `connect-mongodb-session`, middleware to persist session data. Both of these are useful in web programming, but essential for authentication.  There's a broad choice of storage modules for it; because we're already using MongoDB, we're going to use MongoDb as a backing store, with the module `connect-mongodb-session` to wire everything up.

  Install them in the usual way:

```shell
 npm install --save express-session
 npm install --save connect-mongodb-session
```

And then the following code in your `app.js` file:
  
```javascript 
var session = require('express-session');
var MongoSessionDB = require('connect-mongodb-session')(session);

var mongoStore = new MongoSessionDB({
  uri: 'MONGO_URL',
  collection: 'webSessions'
});

app.use(session({
  store: mongoStore,
  secret: 'SESSION_KEY',
  resave: false,
  saveUninitialized: true
}));
```

Because `express-session` uses cookies, we have to configure some cookie settings.  The only one you have to worry about for development is the session key. This is a large random number that is used to encrypt the contents of the cookie we send to the user to protect their cookie data in transit.  It does need to be configured on a per-server basis, though if you lose the random key all it really means is that the session data is lost.  Since the only data we are currently storing there is sesion data, the cost of losing the key is that your users will have to log in.

One of the annoying parts of app configuration is that production is often much more tightly nailed down than development.   What makes it even more annoying at migration time is that some of the tings that actually do contribute to security  -- like https -- are time-consuming, expensive, or annoying to install and configure for development.

Our next configuration details fall into that category.  Cookies are more secure if they can be restricted to only those clients who have established an https connection.  Https requires certificates signed by a certificate authority that the web browser has been configured to recognize, which means that setting it up for development is expensive (if you buy certificates from the same certification authority as you do for production), tie-consuming (if you set up your own development-only certification authority), or annoying (if you don't bother with a certification authority and have to deal with your browser telling you that the certificate is insecure and unsigned).
So because we set up https only in production, we can only restrict cookies to https only in production.  

To make a long story short:  in production, the configuration object passed to `session` should include the attribute

```javascript
secure: true
```


More annoyingly, Heroku's configuration for development involves using HTTPS through prosy servers. The client speaks https to the proxy server, which handles all of the configuration issues involved in https, and the proxy relays the actual content to the web host over http.  This means that the cookies that we get are technically insecure cookies -- we're receiving them over an http connection -- but we can trust them if the most recent proxy server will vouch for them as having come from a secure connection.  So we add:

```javascript
app.set('trust proxy', 1);
```

to tell Express that it should trust anything coming from the proxy server one hop away.

### Rabbithole: `var obj = require('something')(somethingElse);`

Peculiarities here: this may be the first time we have seen a require statement that looks like the one for `connect-mongodb-session`.  It's shorthand that's used when a module needs extra configuration.

Because `connect-mongodb-session` is basically a plugin for `express-session`, their innards are tangled together, and the simplest way to configure both is to let them have access to each other. So the `connect-mongodb-session` package exports a function that takes the session object (which came from `require('express-session')` as an argument.

So the second line of the code block above could be expanded thus:

```javascript
var mongoSessionDBFactory = require('connect-mongodb-session');
var MongoSessionDB = "SessionDbFactory(session);"
```

An important thing to note is that this also lets the function exported by  `connect-mongo-session` modify the session object. 

(And deep, deep down inside that rabbit-hole: why is there a capitalization discrepancy between `mongoSessionDBFactory` and ``MongoSessionDB``?  The answer is that because, by convention, only constructor functions have an initial capital letter, and mongoSessionDBFactory is not a constructor but a factory.)  
      
## Authentication with Passport and Local Strategy

### Step 1: Password security

First, a note: only crazy people, people with a high tolerance for drama, or people with hers of high-paid lawyers volunteer to store passwords for the general public.  Storing passwords is easy to do, and it's easy to do wrong. 
    
When I went looking for background material to get this point across, I quickly realized that building a custom solution for this would be well beyond the scope possible in the time we have.  So I'm going to emphasize three points and then we're going to bolt on a Node module that codifies the currently understood best practices with passwords.

1. Never store passwords if you can get away with it; let Github and Facebook
and Twitter and Google do it for you.

2. If you must store passwords, transfer them from plaintext to hashed as soon
as you can and forget the plaintext version.

3.  Never, ever not even once, not even if you win th lottery, not even if
you're in Vegas and Lady Luck is with you and nobody will ever find out:
**NEVER** store or record or even write down a plaintext password.

(The only exception to rule 3 is when you're first setting up authentication.  Sometimes you need to do that for debugging purposes.)

### Make the necessary changes to your model classe.

The following code makes some assumptions.  If they are all true, you can simply drop this code into place.

*  Your user model class is called User.
*  Your user schema objectd is called userSchema.
*  Your user schema has 'username' and 'password' attributes.
*  You use the field `id` as an id.

(Notice I make no stipulation about any requirements or validations for the username and password fields.  I recommend thatb both be required and the pasword should have a default value of 'X' or 'none's or something  similar, to show that is present but not usable.)

We're going to be adding two methods to our Mongoose user objects, using the
`credential` package for Node.  Install it in the usual way:

```javascript
npm install --save credential
```

and then add the following code to your User model file.  (The
require line goes at the top of the file; the two new methods go between the
ending of your schema definition and the line where you turn it into a model.)

```javascript
var credential = require('credential');

userSchema.methods.setPassword = function(newPassword, next) {
  credential.hash(newPassword, function(error, hash) {
    if (error) {
      return next(error);
    } else {
      this.password = hash;
      this.save(next);
    }
  }).bind(this);
};

userSchema.methods.verifyPassword = function(testPasswrod, next) {
  credential.verify(this.password, testPasswrod, next);
};
```

(The `.bind(this)` bit is because we want `this` in the callback function to be the same `this` as the `this` in the outer function.)

### Step 2: Checking usernames and passwords

We use the `passport` module and its plugins for authentication.  The plugin for username and password authentication is `passport-local`.  Install them in the usual way:

```shell
npm install --save passport
npm install --save passport-local
```

Create a new file in your `./lib` directory called 'passport-local-auth.js'.

Start that file by requiring the code you depend on:

```javascript
var passport = require('passport');
var LocalAuthStrategy = require('passport-local').Strategy;

var User = require('./user.js');
```

The local strategy requires configuration, which is done by using a constructor function to build a configuration object.  This constructor expects an object containing configuration options and a function to verify a user's login.  This function accepts a username, password, and callback function, and calls the callback to indicate login success or failure.  We build these objects like so:

```javascript
var localAuthConfigOptions = {
    // we like the defaults, at least for now
};

var validateLogin = function(username, password, done) {

  User.findOne({
    username: username
  }, function(error, user) {
    if (error) {
      // an error occurred in database lookup; signal an error
      return done(error);
    } else if (!user) {
      // the username is not in the database; signal auth fail
      return done(null, false);
    } else {
      // we have a user - see if the password fits
      user.verifyPassword(password, function(error, isValid) {
        if (error) {
          // an error occurred during password verification; signal an error
          return done(error);
        } else if (!isValid) {
          // the password the user provided is wrong; signal auth fail
          return done(null, false);
        } else {
          // the password is correct; signal auth success by returning user
          done(null, user);
        }
      });
    }
  });
};
```

Now that we have all the bits we need for configuration, we create the configuration object and configure Passport with it:

```javascript
var localAuthStrategy = new LocalAuthStrategy(localAuthConfigOptions,validateLogin);

passport.use(localAuthStrategy);
```

### Step 3: Integrating with the Session

Passport interacts with the session at three times:

1. When the user is authenticated, Passport stores the user object in the session as `req.user`.  (This is the object that you returned from the validateLogin function.)

2. When the request is over and the response has been sent, Passport serializes the user object and stores the serialized object in the session database.

3. When a new request begins and the session has been restored in `req.session`, Passport checks for a serialized user object and deserializes it.

Since Passport doesn't know anything about your user objects, it expects you to provide the functions to serialize and deserialize the user object.  This is easier than it sounds:

```javascript
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({
    id: id
  }, function(error, user) {
    done(error, user);
  });
});
```

We serialize our object by reducing it to an ID, and we deserialize our serialized object by looking it up in the database.

Finally, we need to connect th work we've do

```javascript
module.exports = passport;
```

And in our `apps.js` file, we have to enable the serialization and deserializtion:

```javascript
var passport = require('./lib/passport-local-auth.js');

app.use(passport.initialize());
app.use(passport.session());
```

### Part 4: Routes and testing

These routes allow you to log in and out:

```javascript
router.post('/login', jsonParser);
router.post('/login', passportAuth.authenticate('localAuthStrategy'));
router.post('/login', function(req, res) {
  // at this point in the chain we are logged in
  // you can tell because req.user contains an object

  console.log(req.user);
  res.sendStatus(200);
}); 

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
```

Seed your database with clauses like this:

```javascript
User.create({
      githubId: 1832,
      username: 'cwilbur',
      displayName: 'Charlton Wilbur',
      profileUrl: 'https://www.github.com/cwilbur',
      emails: ['charlton.wilbur@generalassemb.ly']
    }, function(error, user) {
      console.log('user %s created', user.displayName);
      user.setPassword('abc123', done);
    });
```

Notice that you have to set the password in the callback function.  (Right here is an example of the ONE place you can record passwords.)

And test your login like so:

```javascript 
$.ajax({
  type: 'post',
  url: 'http://localhost:3000/login',
  contentType: 'application/json',
  data: JSON.stringify({
    username: 'cwilbur',
    password: 'secret_password'
  }),
}).done(function(res) {
  console.log('done');
}).fail(function(jqXHR, textStatus, errorThrown) {
  console.log('jqXHR: %j', jqXHR);
  console.log('textStatus: %j', textStatus);
  console.log('errorThrown: %j', errorThrown);
});
```

### Part 5: Registering a new user



