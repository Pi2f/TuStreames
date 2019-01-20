const { JWT } = require('google-auth-library');
const config = require('./../config.js');

const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']

module.exports = {
    authorize : function() {
        return new Promise(resolve => {          
          const jwtClient = new JWT(
              config.google.GOOGLE_CLIENT_EMAIL,
              null,
              config.google.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 
              SCOPES
          );
  
          jwtClient.authorize(() => resolve(jwtClient));
        });
      },
}
