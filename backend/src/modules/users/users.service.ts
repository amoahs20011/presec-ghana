import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async getUserTypes(): Promise<
    { code: string; label: string; category: string; description: string }[]
  > {
    return this.userRepository.query(
      `SELECT code, label, category, description
       FROM user_types
       ORDER BY sort_order ASC`,
    );
  }

  async findAll(params: {
    limit?: number;
    offset?: number;
    role?: string;
  }) {
    const qb = this.userRepository.createQueryBuilder('user');

    if (params.role) {
      qb.andWhere('user.role = :role', { role: params.role });
    }

    qb.orderBy('user.createdAt', 'DESC')
      .take(params.limit || 50)
      .skip(params.offset || 0);

    const [items, total] = await qb.getManyAndCount();

    return {
      items: items.map((u) => {
        const { passwordHash, ...safe } = u as any;
        return safe;
      }),
      total,
      limit: params.limit || 50,
      offset: params.offset || 0,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    const { passwordHash, ...safe } = user as any;
    return safe;
  }

  async updateRole(id: string, role: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role as any;
    await this.userRepository.save(user);
    return this.findOne(id);
  }

  async getStats() {
    const total = await this.userRepository.count();

    const byRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    return { total, byRole };
  }
}
