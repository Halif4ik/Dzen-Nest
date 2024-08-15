import { PartialType } from '@nestjs/swagger';
import { CreateCommitDto } from './create-commit.dto';

export class UpdateCommitDto extends PartialType(CreateCommitDto) {}
