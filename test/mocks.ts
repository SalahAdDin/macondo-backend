import dayjs from 'dayjs';
import { v4 as uuid4 } from 'uuid';
import { UserAccountEntity } from '../src/user-account/interface/user-account.entity';
import { UpdateUserAccountInput } from '../src/user-account/interface/inputs/update-user-account.input';
import {
    KeycloakUserDTO,
    UserFromAuthTokenDTO,
} from '../src/user-account/interface/dto/keycloakDTO';
import { userId } from "./utils";

export const mockKeycloakTokenUser: UserFromAuthTokenDTO = {
    sub: userId,
    email: 'test@test.com',
    email_verified: false,
    preferred_username: 'johndoe',
    name: 'John Doe',
    given_name: 'John',
    family_name: 'Doe',
    locale: 'es',
  };
  
  export const mockKeycloakAccountResponse = {
    id: userId,
    createdTimestamp: 1613330243858,
    username: 'johndoe',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@test.com',
    attributes: {
      locale: ['es'],
    },
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 0,
    access: {
      manageGroupMembership: true,
      view: true,
      mapRoles: true,
      impersonate: true,
      manage: true,
    },
  };
  
  export const mockKeycloakUser: KeycloakUserDTO = {
    id: userId,
    email: 'test@test.com',
    emailVerified: false,
    enabled: true,
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    attributes: {
      locale: ['es'],
    },
    createdTimestamp: 1613330243858,
  };
  
  export const mockCreatedAccount: Partial<UserAccountEntity> = {
    id: uuid4(),
    userId,
    username: 'johndoe',
    email: 'test@test.com',
    emailVerified: false,
    enabled: true,
    firstName: 'John',
    lastName: 'Doe',
    joiningDate: dayjs(1613330243858).toISOString(),
    languages: ['es'],
    // phoneNumber: '+905123456789',
    // phoneNumberVerified: false,
    // identityVerified: false,
    // reputation: 5.6,
  };
  
  export const mockAccount: Partial<UserAccountEntity> = {
    _id: uuid4().replace(/-/g, ''),
    ...mockCreatedAccount,
  };
  
  export const mockUpdateAccountInput: UpdateUserAccountInput = {
    age: 25,
    languages: ['en', 'es', 'tr'],
    address: 'John Doe 123 Main St Anytown, USA',
    biography:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    occupation: 'Engineer',
    education: "Master' Degree in Computer Science.",
  };
  