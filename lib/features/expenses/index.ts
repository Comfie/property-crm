/**
 * Expenses Feature Module
 * Exports all expense-related functionality
 */

// Repository
export { expenseRepository, ExpenseRepository } from './repositories/expense.repository';

// Service
export { expenseService, ExpenseService } from './services/expense.service';

// DTOs and Validators
export {
  createExpenseSchema,
  updateExpenseSchema,
  listExpensesSchema,
  expenseIdSchema,
  expenseStatisticsSchema,
  type CreateExpenseDTO,
  type UpdateExpenseDTO,
  type ListExpensesDTO,
  type ExpenseIdDTO,
  type ExpenseStatisticsDTO,
} from './dtos/expense.dto';
