import {
  HttpModule,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import {
  mockAccount,
  mockKeycloakAccountResponse,
  mockUpdateAccountInput,
} from '../../../test/mocks';
import { userId } from '../../../test/utils';
import { MockType } from '../../../utils/types';
import { KeycloakService } from './keycloak/keycloak.service';
import { UserAccountEntity } from './user-account.entity';
import { UserAccountService } from './user-account.service';

const repositoryMockFactory: () => MockType<MongoRepository<any>> = jest.fn(() => ({
  create: jest.fn(),
  deleteOne: jest.fn((entity) => entity),
  findOne: jest.fn((entity) => entity),
  save: jest.fn((entity) => entity),
  updateOne: jest.fn(),
}));

describe('UserAccountService', () => {
  let service: UserAccountService;
  let repository: MockType<MongoRepository<UserAccountEntity>>;
  let keycloakService: KeycloakService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        UserAccountService,
        KeycloakService,
        {
          provide: getRepositoryToken(UserAccountEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UserAccountService>(UserAccountService);
    repository = module.get(getRepositoryToken(UserAccountEntity));
    keycloakService = module.get<KeycloakService>(KeycloakService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    it('calls repository.create() and return the result', async () => {
      keycloakService.setRole = jest.fn().mockResolvedValue({});
      keycloakService.getUserInfo = jest
        .fn()
        .mockResolvedValue(mockKeycloakAccountResponse);
      repository.create.mockReturnValueOnce(mockAccount);
      repository.save.mockReturnValueOnce(mockAccount);

      expect(repository.create).not.toHaveBeenCalled();
      const result = await service.createAccount({ role: 'erasmus' }, userId);
      expect(keycloakService.setRole).toHaveBeenCalledWith(userId, [
        { id: 'c47fec2e-ed3a-4e18-a6dc-0b45b56f957d', name: 'erasmus' },
      ]);
      expect(keycloakService.getUserInfo).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockAccount);
    });
    it('throws an internal server error as Keycloak fails to set role', () => {
      keycloakService.setRole = jest.fn().mockRejectedValueOnce({});
      expect(
        service.createAccount({ role: 'erasmus' }, userId),
      ).rejects.toThrowError(
        new InternalServerErrorException('Internal Server Error.'),
      );
    });
    it('throws an internal server error as Keycloak fails to get the user info', () => {
      keycloakService.setRole = jest.fn().mockResolvedValue({});
      keycloakService.getUserInfo = jest.fn().mockRejectedValueOnce({});

      expect(
        service.createAccount({ role: 'erasmus' }, userId),
      ).rejects.toThrowError(
        new InternalServerErrorException('Internal Server Error.'),
      );
    });
  });

  describe('findById', () => {
    it("calls repository.findOne() and successfully retrieve and return the account by it's user's id", async () => {
      repository.findOne.mockReturnValueOnce(mockAccount);

      const found = await service.findById(userId);
      expect(found).toEqual(mockAccount);

      expect(repository.findOne).toHaveBeenCalledWith({
        userId,
      });
    });

    it("throws an error as there is not an user account for the given user's id.", () => {
      repository.findOne.mockReturnValueOnce(null);
      expect(service.findById(userId)).rejects.toThrowError(
        new NotFoundException(`Account with user ID "${userId}" not found.`),
      );
    });
  });

  describe('updateAccount', () => {
    it('calls to service.findById() and gets a current entity', async () => {
      repository.updateOne.mockReturnValueOnce({ modifiedCount: 1 });
      service.findById = jest.fn().mockResolvedValue({
        ...mockAccount,
        ...mockUpdateAccountInput,
      });

      expect(service.findById).not.toHaveBeenCalled();

      const result = await service.updateAccount(mockUpdateAccountInput, userId);
      expect(service.findById).toHaveBeenCalled();

      expect(result).toEqual({ ...mockAccount, ...mockUpdateAccountInput });
    });
    it('throws an error as account by user id does not exist', () => {
      repository.updateOne.mockReturnValueOnce({ modifiedCount: 0 });

      expect(
        service.updateAccount(mockUpdateAccountInput, userId),
      ).rejects.toThrowError(
        new NotFoundException(`Account with user ID "${userId}" not found.`),
      );
    });
  });

  describe('deleteAccount', () => {
    it('calls repository.delete() to delete a task', async () => {
      repository.deleteOne.mockReturnValueOnce({ deletedCount: 1 });

      expect(repository.deleteOne).not.toHaveBeenCalled();
      const deleted: boolean = await service.deleteAccount(userId);
      expect(repository.deleteOne).toHaveBeenCalledWith({ userId });
      expect(deleted).toBe(true);
    });
    it('throws an error as account by user id does not exist', () => {
      repository.deleteOne.mockReturnValueOnce({ deletedCount: 0 });

      expect(service.deleteAccount(userId)).rejects.toThrowError(
        new NotFoundException(`Account for user with user ID ${userId} not found.`),
      );
    });
  });
});
