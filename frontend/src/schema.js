import { z } from "zod";

// Constantes de configuración
const MAX_IMAGE_SIZE_MB = 5; // Máximo tamaño de imagen en MB
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024; // Convertir a bytes
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']; // Tipos de imagen aceptados

// Validación de imagen
const imageValidation = (file) => {
  if (!file) return true; // Si no hay archivo, es válido
  const isValidSize = file.size <= MAX_IMAGE_SIZE_BYTES; // Validar tamaño
  const isValidType = ACCEPTED_IMAGE_TYPES.includes(file.type); // Validar tipo
  return isValidSize && isValidType; // Retornar validación
};

// Esquema para la revisión
export const reviewSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Review should be at least 1 character long" }),
  rating: z.preprocess(
    (value) => (isNaN(value) ? 0 : value), // Preprocesar valor de rating
    z.coerce.number().int().gte(1).lte(5).refine(
      (val) => val >= 1 && val <= 5,
      { message: "Rating must be between 1 and 5" }
    )
  ),
});

// Esquema para la canción
export const songSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title must be at least 1 character long" }),
  image: z
    .any()
    .refine((file) => imageValidation(file), {
      message: `Image size must be less than ${MAX_IMAGE_SIZE_MB}MB and format must be one of: ${ACCEPTED_IMAGE_TYPES.join(", ")}`,
    })
    .optional(),
  artist: z
    .string()
    .trim()
    .min(3, { message: "Artist name must be at least 3 characters long" }),
});

// Esquema para el inicio de sesión
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Esquema para el usuario
export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
