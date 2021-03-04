/**
* User information gotten from the Auth Token
* @link `auth/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`
* @example {
    "sub": "uuid",
    "email_verified": true,
    "name": "ExampleName ExampleLastName",
    "preferred_username": "username",
    "given_name": "ExampleName",
    "locale": "en",
    "family_name": "ExampleLastName",
    "email": "testadmin@keycloak.com"
}
*/
export interface UserFromAuthTokenDTO {
  sub: string;
  email: string;
  email_verified: boolean;
  preferred_username: string;
  name: string;
  given_name: string;
  family_name: string;
  locale: string;
}

/**
 * User information from the Admin REST API
 * @link `/auth/admin/realms/${KEYCLOAK_REALM}/users/${userid}`
 * @example
 * {
    "id": "userid",
    "createdTimestamp": 1613330243858,
    "username": "username",
    "enabled": true,
    "totp": false,
    "emailVerified": true,
    "firstName": "firstName",
    "lastName": "lastName",
    "email": "testnest@keycloak.com",
    "attributes": {
        "locale": [
            "es"
        ]
    },
    "disableableCredentialTypes": [],
    "requiredActions": [],
    "notBefore": 0,
    "access": {
        "manageGroupMembership": true,
        "view": true,
        "mapRoles": true,
        "impersonate": true,
        "manage": true
    }
}
 */
export interface KeycloakUserDTO {
  id: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  firstName: string;
  lastName: string;
  username: string;
  attributes: { [key: string]: any };
  createdTimestamp: number;
}
