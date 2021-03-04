import { HttpService, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { mockKeycloakAccountResponse, userId } from '../../../../test/utils';
import { MockType } from '../../../../utils/types';
import { KeycloakService } from './keycloak.service';

const httpMockFactory: () => MockType<HttpService> = () => ({
  get: jest.fn(),
  post: jest.fn(),
});

describe('KeycloakService', () => {
  let service: KeycloakService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeycloakService,
        {
          provide: HttpService,
          useFactory: httpMockFactory,
        },
      ],
    }).compile();
    service = module.get<KeycloakService>(KeycloakService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getToken', () => {
    it('should return an authentication token', async () => {
      http.post = jest
        .fn()
        .mockReturnValue(of({ data: { access_token: 'Auth bearer' } }));
      const token = await service.getToken();
      expect(token).toEqual('Auth bearer');
    });
    it('should throw an error at getting auth token', async () => {
      http.post = jest.fn().mockReturnValueOnce(throwError(new Error()));
      await expect(service.getToken()).rejects.toThrowError(new Error());
    });
  });
  describe('setRole', () => {
    it('should return a resolved promised after setting roles at Keycloak', () => {
      http.post = jest.fn().mockReturnValueOnce(of(Promise.resolve()));
      service.getToken = jest.fn().mockReturnValueOnce('tokensito');

      expect(service.getToken).not.toHaveBeenCalled();
      expect(
        service.setRole(userId, [
          { id: 'c47fec2e-ed3a-4e18-a6dc-0b45b56f957d', name: 'erasmus' },
        ]),
      ).toEqual(Promise.resolve());
      expect(service.getToken).toHaveBeenCalled();
    });
    it('should throw an error at setting roles to the user', async () => {
      http.post = jest
        .fn()
        .mockReturnValueOnce(
          throwError(new NotFoundException(`No user found with id ${userId}`)),
        );
      service.getToken = jest.fn().mockReturnValueOnce('tokensito');

      expect(service.getToken).not.toHaveBeenCalled();
      await expect(
        service.setRole(userId, [
          { id: 'c47fec2e-ed3a-4e18-a6dc-0b45b56f957d', name: 'erasmus' },
        ]),
      ).rejects.toThrowError(
        new NotFoundException(`No user found with id ${userId}`),
      );
      expect(service.getToken).toHaveBeenCalled();
    });
  });
  describe('getUserInfo', () => {
    it("should return the Keycloak's user info", async () => {
      http.get = jest
        .fn()
        .mockReturnValue(of({ data: mockKeycloakAccountResponse }));
      service.getToken = jest.fn().mockReturnValueOnce('tokensito');

      expect(service.getToken).not.toHaveBeenCalled();
      const result = await service.getUserInfo(userId);
      expect(service.getToken).toHaveBeenCalled();
      expect(result).toEqual(mockKeycloakAccountResponse);
    });
    it('should throw an error as it cannot find the user in Keycloak', async () => {
      http.get = jest
        .fn()
        .mockReturnValueOnce(
          throwError(new NotFoundException(`No user found with id ${userId}`)),
        );
      service.getToken = jest.fn().mockReturnValueOnce('tokensito');

      await expect(service.getUserInfo(userId)).rejects.toThrowError(
        new NotFoundException(`No user found with id ${userId}`),
      );
    });
  });
});
