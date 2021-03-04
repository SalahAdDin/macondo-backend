const tokenRequester = require('keycloak-request-token');

/* This script requests a auth token from keycloak
* @param string realm realm target
* @param string clientId target realm's client id
* @param string username target user's username
* @param string password target user's password
* @example
* `yarn token:request macondo macondo/frontend testnest Denizli2935`
* `yarn token:request '' '' admin password`
* */

const realm = process.argv[2];
const clientId = process.argv[3];
const username = process.argv[4];
const password = process.argv[5];

const baseUrl = 'http://localhost:8080/auth';
const settings = {
  username: username || 'developer',
  password: password || 'developer',
  realmName: realm || 'master',
  client_id: clientId || 'admin-cli',
  grant_type: 'password',
};

tokenRequester(baseUrl, settings)
  .then((token) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log(JSON.stringify(headers));
  })
  .catch((error) => {
    console.group('Error requesting token.');
    console.log(baseUrl);
    console.log(settings);
    console.log('Error: ', error);
    console.groupEnd();
  });
