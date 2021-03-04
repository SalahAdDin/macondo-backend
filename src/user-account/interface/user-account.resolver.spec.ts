import { Test, TestingModule } from '@nestjs/testing';
import {
  mockAccount,
  mockCreatedAccount,
  mockKeycloakTokenUser,
  mockKeycloakUser,
  mockUpdateAccountInput,
} from '../../../test/mocks'
import {
  gqlContextMockFactory,
  getParamDecoratorFactory,
  userId,
} from '../../../test/utils';
import { MockType } from '../../../utils/types';
import { GetUser } from './decorators/get-user.decorator';
import { UserAccountResolver } from './user-account.resolver';
import { UserAccountService } from './user-account.service';

const serviceMockFactory: () => MockType<UserAccountService> = jest.fn(() => ({
  createAccount: jest.fn(() => mockCreatedAccount),
  findById: jest.fn(() => mockAccount),
  updateAccount: jest.fn(() => ({ ...mockAccount, ...mockUpdateAccountInput })),
  deleteAccount: jest.fn(() => ({ deleted: true })),
}));

describe('UserAccountResolver', () => {
  let resolver: UserAccountResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAccountResolver,
        { provide: UserAccountService, useFactory: serviceMockFactory },
      ],
    }).compile();

    resolver = module.get<UserAccountResolver>(UserAccountResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('GetUser (decorator)', () => {
    it('should get the user from the query context', () => {
      const { attributes, createdTimestamp, ...others } = mockKeycloakUser;
      const gqlContext = gqlContextMockFactory({
        req: { user: mockKeycloakTokenUser },
      });
      const factory = getParamDecoratorFactory(GetUser);
      const user = factory(null, gqlContext);
      expect(user).toStrictEqual(others);
    });
  });

  describe('getAccount', () => {
    it("should return the associated account by user's id", () => {
      expect(resolver.getAccount(userId)).toEqual(mockAccount);
    });
  });

  describe('createAccount', () => {
    it('should return a new created account', () => {
      expect(resolver.createAccount({ role: 'admin' }, mockKeycloakUser)).toEqual(
        mockCreatedAccount,
      );
    });
  });

  describe('updateAccount', () => {
    it('should return an updated account', () => {
      expect(
        resolver.updateAccount(mockUpdateAccountInput, mockKeycloakUser),
      ).toEqual({ ...mockAccount, ...mockUpdateAccountInput });
    });
  });

  describe('deleteAccount', () => {
    it('should return account by user id was deleted', () => {
      expect(resolver.deleteAccount(mockKeycloakUser)).toEqual({ deleted: true });
    });
  });
});
