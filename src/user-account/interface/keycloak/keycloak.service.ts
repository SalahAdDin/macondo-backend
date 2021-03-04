import { HttpService, Injectable, Logger, NotFoundException } from '@nestjs/common';
import qs from 'querystring';
import { map } from 'rxjs/operators';
import { KeycloakUserDTO } from '../dto/keycloakDTO';

interface IKeycloakRole {
  id: string;
  name: string;
}

const settings = {
  username: 'admin',
  password: 'password',
  grant_type: 'password',
  client_id: 'admin-cli',
  realm: 'master',
};

const tokenUrl = 'protocol/openid-connect/token';

@Injectable()
export class KeycloakService {
  private logger = new Logger('KeycloakService');

  constructor(private httpService: HttpService) {}

  /**
   * Requesting token for the admin-cli client admin user on master realm.
   * @return {string} authToken Bearer token for the admin-cli client user.
   * */
  async getToken(): Promise<string> {
    try {
      const response = await this.httpService
        .post(`realms/${settings.realm}/${tokenUrl}`, qs.stringify(settings), {
          baseURL: `${process.env.KEYCLOAK_SERVER_URL}/`,
          headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        })
        .pipe(map((res) => res.data))
        .toPromise();
      return response.access_token as string;
    } catch (error: any) {
      this.logger.error(`Error at requesting Keycloak auth token: ${error}`);
      return Promise.reject(error);
    }
  }

  /**
   * Set a given real-level role to a given user.
   * @param {string} id User's id (required by Keycloak).
   * @param {string[]} roles Roles to assign to the user.
   * */
  async setRole(id: string, roles: IKeycloakRole[]): Promise<void> {
    this.logger.log(`Giving roles ${JSON.stringify(roles)} to user id ${id}`);
    try {
      const authToken = await this.getToken();
      await this.httpService
        .post(
          `admin/realms/${process.env.KEYCLOAK_REALM}/users/${id}/role-mappings/realm`,
          roles,
          {
            baseURL: `${process.env.KEYCLOAK_SERVER_URL}/`,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              Authorization: `Bearer ${authToken}`,
            },
          },
        )
        .toPromise();
      return Promise.resolve();
    } catch (error: any) {
      this.logger.error(`Error at requesting setting user's role: ${error.message}`);
      throw new NotFoundException(`No user found with id ${id}`);
    }
  }

  /**
   * Get the user's information from Keycloak
   * @param {string} id User's id (required by Keycloak)
   * @return {KeycloakUserDto} response.data Data formed by required fields.
   * */
  async getUserInfo(id: string): Promise<KeycloakUserDTO> {
    this.logger.log(`Getting user information for user id ${id}`);
    try {
      const authToken = await this.getToken();

      const response = await this.httpService
        .get(
          `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${id}`,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              Authorization: `Bearer ${authToken}`,
            },
          },
        )
        .pipe(map((res) => res.data))
        .toPromise();
      return response as KeycloakUserDTO;
    } catch (e) {
      // TODO: i18n to this message
      throw new NotFoundException(`No user found with id ${id}`);
    }
  }
}
