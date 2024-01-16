import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(email: string, password: string): Promise<void> {
    try {
      const user = this.userRepository.create({ email, password });
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email is allready used');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email: email });
  }
}
