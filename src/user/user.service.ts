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

  async createUser(email: string, password: string): Promise<User> {
    try {
      const user = this.userRepository.create({ email, password });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email is allready used');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email: email });
  }
  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ['todoLists'],
      select: {
        todoLists: {
          id: true,
        },
      },
    });
  }
}
