const { JWT } = require('google-auth-library');

var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']


module.exports = {
    authorize : function() {
        return new Promise(resolve => {          
          const jwtClient = new JWT(
              process.env.GOOGLE_CLIENT_EMAIL,
              null,
              process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 
              SCOPES
          );
  
          jwtClient.authorize(() => resolve(jwtClient));
        });
      },
}
