import { Comment, User } from '@prisma/client';

export type UserSelection = Pick<User, 'nickname' | 'id' | 'email'>;
export type CommentSelection = Pick<
  Comment,
  'comment' | 'createdAt' | 'updatedAt'
>;
export type Review = CommentSelection & { user: UserSelection };
