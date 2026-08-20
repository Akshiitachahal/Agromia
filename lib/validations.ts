import { z } from 'zod';

export const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  mobile: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  product: z.string().max(200).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
