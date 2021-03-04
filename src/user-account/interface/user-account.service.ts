import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import {
  DeleteWriteOpResultObject,
  MongoRepository,
  UpdateWriteOpResult,
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import { KeycloakUserDTO } from './dto/keycloakDTO';
import { KeycloakService } from './keycloak/keycloak.service';
import { CreateUserAccountInput } from './inputs/create-user-account.input';
import { UpdateUserAccountInput } from './inputs/update-user-account.input';
import { UserAccountEntity } from './user-account.entity';

enum Role {
  admin = 'd031841e-d38f-470a-bf89-8b95d60ee10d',
  erasmus = 'c47fec2e-ed3a-4e18-a6dc-0b45b56f957d',
  host = '36fcd519-ace8-4b5c-b3c4-383a0ced3a23',
}

@Injectable()
export class UserAccountService {
  constructor(
    @InjectRepository(UserAccountEntity)
    private accountRepository: MongoRepository<UserAccountEntity>,
    private keycloakService: KeycloakService,
  ) {}

  /**
   * Gets a role and a user's id, calls to Keycloak's REST API to assign a role to the given user by id, call to the same API to request the given user's information and creates a new user account based on.
   * @param {CreateUserAccountInput} createAccountInput with {string} role as role to assign
   * @param {string} id Keycloak's user's id.
   * @returns {function} Repository's save function for created account
   */
  async createAccount(
    createAccountInput: CreateUserAccountInput,
    id: string,
  ): Promise<UserAccountEntity> {
    const { role } = createAccountInput;
    try {
      await this.keycloakService.setRole(id, [{ id: Role[role], name: role }]);

      const keycloakUser: KeycloakUserDTO = await this.keycloakService.getUserInfo(
        id,
      );
      const {
        createdTimestamp,
        email,
        emailVerified,
        enabled,
        firstName,
        lastName,
        username,
        attributes,
      } = keycloakUser;
      // TODO: how to get phoneNumber, phoneNumberVerified from Keycloak

      let languages: string[];

      if ((attributes.locale as string[]) !== null) {
        languages = attributes.locale as string[];
      }

      const account = this.accountRepository.create({
        id: uuid4(),
        userId: id,
        username,
        email,
        // TODO: how to change/trigger a change over this at changing them(emailVerified, email, enabled) on Keycloak? GraphQL subscriptions(?)
        emailVerified,
        enabled,
        firstName,
        lastName,
        // TODO: Handling this as string or as Date?
        joiningDate: dayjs(createdTimestamp).toISOString(),
        languages,
      });
      return this.accountRepository.save(account);
    } catch (e) {
      // TODO: use i18n here
      // TODO: Handle error here.
      throw new InternalServerErrorException('Internal Server Error.');
    }
  }

  /**
   * Find an user's account by its user id.
   * @param {string} id User id.
   * @returns {UserAccountEntity} Found user account.
   */
  async findById(id: string): Promise<UserAccountEntity> {
    const found = await this.accountRepository.findOne({ userId: id });
    if (!found) {
      throw new NotFoundException(`Account with user ID "${id}" not found.`);
    }
    return found;
  }

  /**
   * Get a editable account's information and an user's id and update its user's account.
   * @param {UpdateUserAccountInput} updateAccountInput Editable account's information.
   * @param {string} id Given user's id.
   * @returns {UserAccountEntity} Updated user's account.
   */
  async updateAccount(
    updateAccountInput: UpdateUserAccountInput,
    id: string,
  ): Promise<UserAccountEntity> {
    const result: UpdateWriteOpResult = await this.accountRepository.updateOne(
      { userId: id },
      {
        $set: {
          ...updateAccountInput,
        },
      },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException(`Account with user ID "${id}" not found.`);
    }
    const updatedEntity: UserAccountEntity = await this.findById(id);
    return { ...updatedEntity };
  }

  /**
   * Deletes a user's account by user's id.
   * @param {string} id User's id which user's account will be delete.
   * @returns {boolean} result Either the user's  where deleted.
   * @throws {NotFoundException} Either user's account whit the id provided was not found.
   */
  async deleteAccount(id: string): Promise<boolean> {
    const result: DeleteWriteOpResultObject = await this.accountRepository.deleteOne(
      {
        userId: id,
      },
    );

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Account for user with user ID ${id} not found.`);
    }

    return result.deletedCount > 0;
  }
}
