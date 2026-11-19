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

const optionalText = z.string().trim().max(10000).optional().nullable();

export const productTranslationSchema = z.object({
  name: z.string().trim().min(1).max(300),
  shortDescription: optionalText,
  composition: optionalText,
  formulation: optionalText,
  benefits: optionalText,
  targetCrops: optionalText,
  targetPests: optionalText,
  dosage: optionalText,
  applicationMethod: optionalText,
  technicalInfo: optionalText,
  packaging: optionalText,
  recommendation: optionalText,
});

export const productRangeSchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  imageUrl: z.string().url().optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  translations: z.object({
    en: z.object({ name: z.string().trim().min(1).max(200), description: optionalText }),
    hi: z.object({ name: z.string().trim().optional().default(''), description: optionalText }),
    har: z.object({ name: z.string().trim().optional().default(''), description: optionalText }),
  }),
});

export const productSchema = z.object({
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().min(1),
  primaryImageUrl: z.string().url().optional().nullable(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).default(0),
  translations: z.object({
    en: productTranslationSchema,
    hi: productTranslationSchema.partial(),
    har: productTranslationSchema.partial(),
  }),
});

export const productRangePatchSchema = productRangeSchema.partial().extend({
  translations: productRangeSchema.shape.translations.partial().optional(),
});

export const productPatchSchema = productSchema.partial().extend({
  translations: z.object({
    en: productTranslationSchema.partial().optional(),
    hi: productTranslationSchema.partial().optional(),
    har: productTranslationSchema.partial().optional(),
  }).partial().optional(),
});
