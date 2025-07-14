import { z } from 'zod'
import 'dotenv/config'

const createPortSchema = (name: string) =>
    z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(
            z
                .number()
                .min(1, `${name} must be a positive number`)
                .max(65535, `${name} must be less than 65536`)
        )

const envSchema = z.object({
    PORT: createPortSchema('PORT'),
    DB_HOST: z.string().min(1, 'DB_HOST is required'),
    DB_PORT: createPortSchema('DB_PORT'),
    DB_USERNAME: z.string().min(1, 'DB_USERNAME is required'),
    DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
    DB_DATABASE: z.string().min(1, 'DB_DATABASE is required'),
    INITIALIZE_DB: z.enum(['true', 'false', ''], {
        message: 'INITIALIZE_DB must be true, false or empty',
    }),
})

try {
    envSchema.parse(process.env)
} catch (error) {
    if (error instanceof z.ZodError) {
        const missingVars = error.issues.map((err) => err.path.join('.'))
        throw new Error(
            `Missing or invalid environment variables: ${missingVars.join(', ')}`
        )
    }
    throw error
}
