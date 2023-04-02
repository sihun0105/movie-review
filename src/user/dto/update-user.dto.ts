import { PartialType } from '@nestjs/mapped-types';
import { JoinDto } from './Join.dto';

export class UpdateUserDto extends PartialType(JoinDto) {}
