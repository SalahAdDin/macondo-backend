import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { mockUpdateAccountInput } from './mocks';

const tokenRequester = require('keycloak-request-token');

const baseUrl = 'http://localhost:8080/auth';
const settings = {
  username: 'testnest',
  password: 'Denizli2935',
  realmName: 'macondo',
  client_id: 'macondo/frontend',
  grant_type: 'password',
};

const getToken = async (): Promise<string> => {
  try {
    const token = await tokenRequester(baseUrl, settings);
    return `Bearer ${token}`;
  } catch (error) {
    console.log('Error: ', error);
  }
};

describe('UserAccountResolver (e2e)', () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  const createAccountQuery = `
  mutation{
    createAccount(createUserAccountInput: {
      role: "host"
    }){
      userId
      username
      email
      joiningDate
    }
  }`;

  it('createAccount', async () => {
    const bearerToken = await getToken();
    const { statusCode, body } = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: createAccountQuery,
      },
      headers: {
        Authorization: bearerToken,
      },
    });
    const data = JSON.parse(body).data.createAccount;
    expect(statusCode).toBe(200);
    expect(data.userId).toEqual('b5e44ad1-5d20-4821-968f-24514c0dc592');
    expect(data.username).toEqual('testnest');
    expect(data.email).toEqual('testnest@keycloak.com');
    expect(data.joiningDate).toEqual('2021-02-14T19:17:23.858Z');
  });

  const getAccountQuery = `
  query{
    account(id: "b5e44ad1-5d20-4821-968f-24514c0dc592"){
      userId
      username
      email
      joiningDate
    }
  }`;

  it('getAccount', async () => {
    const { statusCode, body } = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: getAccountQuery,
      },
    });
    const data = JSON.parse(body).data.account;
    expect(statusCode).toBe(200);
    expect(data.userId).toEqual('b5e44ad1-5d20-4821-968f-24514c0dc592');
    expect(data.username).toEqual('testnest');
    expect(data.email).toEqual('testnest@keycloak.com');
    expect(data.joiningDate).toEqual('2021-02-14T19:17:23.858Z');
  });

  const updateAccountObject = JSON.stringify(mockUpdateAccountInput).replace(
    /"([^(")]+)":/g,
    '$1:',
  );

  const updateAccountQuery = `
  mutation {
    updateAccount(updateUserAccountInput: ${updateAccountObject}) {
      age
      address
      languages
    }
  }`;

  it('updateAccount', async () => {
    const bearerToken = await getToken();
    const { statusCode, body } = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: updateAccountQuery,
      },
      headers: {
        Authorization: bearerToken,
      },
    });
    const data = JSON.parse(body).data.updateAccount;
    expect(statusCode).toBe(200);
    expect(data.age).toBe(mockUpdateAccountInput.age);
    expect(data.address).toBe(mockUpdateAccountInput.address);
    expect(data.languages).toStrictEqual(mockUpdateAccountInput.languages);
  });

  it('deleteAccount', async () => {
    const bearerToken = await getToken();
    const { statusCode, body } = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `mutation{
          deleteAccount
        }`,
      },
      headers: {
        Authorization: bearerToken,
      },
    });
    const deleted: boolean = JSON.parse(body).data.deleteAccount;
    expect(statusCode).toBe(200);
    expect(deleted).toBe(true);
  });
});
