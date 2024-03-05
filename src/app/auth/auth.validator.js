const {z} = require("zod");
let registerSchema = z.object({
    name: z.string().regex(/^[^0-9][a-zA-Z\s]+$/).max(50).min(2).nonempty(),
    email: z.string().email().nonempty(),
    role: z.string().regex(/admin|customer|seller/).nonempty(),
    address: z.string().nonempty(),
    phone: z.string().regex(/^(\+\d{1,3}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
})

let loginSchema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty()
})

let forgetPasswordSchema = z.object({
    email: z.string().email().nonempty(),
})

let userPasswordSchema = z.object({
    password: z.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/),
    confirmPassword: z.string().nonempty()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

module.exports = {
    registerSchema,
    userPasswordSchema,
    loginSchema,
    forgetPasswordSchema
}