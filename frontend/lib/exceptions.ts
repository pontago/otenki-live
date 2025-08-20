import { ValidationError } from '@/features/contact/types/contact';

export class ValidationErrors extends Error {
  constructor(public errors: ValidationError[]) {
    super(errors.map((error) => error.message).join('\n'));
  }
}

export class NotFoundError extends Error {
  constructor() {
    super('Not Found');
  }
}
