import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    await this.verifyIfEmailIsAlreadyTaken({ email });
    return this.createCustomerRecordInRepository({ name, email });
  }

  private async verifyIfEmailIsAlreadyTaken({
    email,
  }: Omit<IRequest, 'name'>): Promise<void> {
    const customerExists = await this.customersRepository.findByEmail(email);

    if (customerExists) {
      throw new AppError('This e-mail is already assigned to a customer');
    }
  }

  private async createCustomerRecordInRepository({
    name,
    email,
  }: IRequest): Promise<Customer> {
    return this.customersRepository.create({ name, email });
  }
}

export default CreateCustomerService;
