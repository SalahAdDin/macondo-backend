import {
  Column,
  Entity,
  ObjectIdColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

type identityType = 'license' | 'passport' | 'identity';

@Entity()
@Unique(['id', 'username'])
export class UserAccountEntity {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column({ unique: true })
  username: string;

  // TODO: If user registers with social media or phone, this should be empty
  @Column({ nullable: true })
  email: string;

  @Column({ default: false })
  emailVerified: boolean;

  // TODO: If user registers with social media or email, this should be empty
  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: false })
  phoneNumberVerified: boolean;

  /** TODO: File type
  * Just once identity is required
  @OneToOne(type => identity, identity => identity.id)
  @Column()
  identity: string;*/

  @Column({ default: false })
  identityVerified: boolean;

  @Column()
  joiningDate: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  /** TODO: File type
  @OneToOne(type => Photo, photo => photo.id)
  @Column()
    photo: string;*/

  @Column({ default: true })
  enabled: boolean;

  /**
   * Host reputation is calculated bases on its listing's review.
   * Erasmus reputation is calculated... where from?
   * */
  @Column({ nullable: true })
  reputation: number;

  @Column({ nullable: true })
  age: number;

  /**
   * Stringified array of strings: '["en","es",...]'
   * */
  @Column({ nullable: true })
  languages: string[];

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  biography: string;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  education: string;

  /** TODO: one to many to Listing
  @OneToMany(type => ListingEntity, favoriteListing => favoriteListing.erasmus)
  @Column()
  favoriteListing: Listing[];
  */
}
