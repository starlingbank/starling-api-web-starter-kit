const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config');

const personalApp = require('./personal');
const sandboxApp = require('./sandbox');
const oauthApp = require('./oauth');

const transactionTaggingApp = require('./transactionTagging');

const ONE_DAY_MILLISECONDS = 24 * 3600 * 1000;

const bootstrapExampleApp = (express, app) => {

  /**
   * A simple in-memory session store to maintain user sessions using signed cookies.
   * The access and refresh tokens are stored for each user.
   * A client application would typically store these attributes in a database or distributed
   * session store that persists session state between application restarts.
   */
  app.use(session({
      secret: config.cookieSecret,
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: ONE_DAY_MILLISECONDS
      }
    })
  );

  app.use(bodyParser.json());

  app.use(express.static(path.resolve(__dirname, '../..', 'build')));

  /**
   * This destroys the user session while using the main.js server, but does nothing in Personal Access mode.
   */
  app.get('/api/logout', (req, res) => {
    const { session } = req;
    if (session) {
      session.destroy();
    }
    res.redirect('/');
  });

  transactionTaggingApp.start(app);

  personalApp.start(app);
  sandboxApp.start(app);
  oauthApp.start(app);
};

module.exports = bootstrapExampleApp;
