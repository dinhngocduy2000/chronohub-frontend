---
description: Security best practices and compliance requirements
applyTo: **/*.{ts,tsx}
---

# Security & Compliance Guidelines

You are responsible for maintaining security and compliance standards in the SmartHire Candidate Platform. Follow these guidelines to protect user data and prevent vulnerabilities.

## Security Principles

### 1. Defense in Depth
- Multiple layers of security controls
- Never rely on a single security measure
- Validate on both client and server
- Assume all input is malicious

### 2. Least Privilege
- Grant minimum required permissions
- Limit access to sensitive data
- Role-based access control
- Time-limited access tokens

### 3. Fail Securely
- Graceful failure without exposing sensitive data
- Default deny access
- Secure error messages (no stack traces in production)
- Log security events

## Environment Variables & Secrets

### ✅ Best Practices

**Environment Validation**:
```typescript
// ✅ Good - apps/api/src/shared/env.ts
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  ENCRYPT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
})

export const env = envSchema.parse(process.env)
```

**Frontend Environment** (apps/web):
```typescript
// ✅ Good - src/env.ts
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
})
```

**Important**: Frontend should NEVER have `DATABASE_URL`. Use `NEXT_PUBLIC_API_URL` for backend API calls.

### ❌ Anti-patterns

```typescript
// ❌ Bad - Hardcoded secrets
const JWT_SECRET = "my-super-secret-key"
const API_KEY = "sk-1234567890abcdef"

// ❌ Bad - Exposed in client bundle
const SECRET_KEY = process.env.SECRET_KEY // In client component

// ❌ Bad - No validation
const dbUrl = process.env.DATABASE_URL || "postgresql://localhost/db"

// ❌ Bad - Frontend with DATABASE_URL (security risk!)
// Frontend apps should NEVER connect directly to databases
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(), // ❌ Wrong! Frontend shouldn't access DB
  },
})

// ✅ Good - Use API_URL instead
export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(), // ✅ Correct! Frontend calls API
  },
})
```

### Secret Generation

```bash
# Generate secure secrets
openssl rand -base64 64

# Required secrets for apps/api/.env:
# - JWT_SECRET (64+ characters)
# - ENCRYPT_SECRET (64+ characters)
# - BETTER_AUTH_SECRET (32+ characters)
```

### Storage

- **Development**: `.env` files (never commit)
- **Production**: Environment variables (Docker, K8s secrets)
- **CI/CD**: GitHub Secrets

**Never**:
- Commit `.env` files
- Store secrets in code
- Log secrets
- Expose secrets in error messages
- Include secrets in client bundles

## Input Validation

### Zod Schema Validation

**✅ Server-Side Validation** (Required):

```typescript
// ✅ Good - modules/job/job.validator.ts
import { z } from "zod"

export const createJobSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  email: z.string().email(),
  salary: z.number().positive().max(1000000).optional(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]),
  description: z.string().max(5000).trim(),
})

export type CreateJobInput = z.infer<typeof createJobSchema>
```

**Route Handler**:
```typescript
// ✅ Good
import { zValidator } from "@hono/zod-validator"

app.post("/api/jobs", zValidator("json", createJobSchema), async (c) => {
  const data = c.req.valid("json") // Type-safe and validated
  // ... create job
})
```

**❌ Anti-patterns**:
```typescript
// ❌ Bad - No validation
app.post("/api/jobs", async (c) => {
  const data = await c.req.json()
  // Directly using unvalidated data!
  const job = await jobRepository.create(data)
})

// ❌ Bad - Trust client-side validation only
// Always validate on server even if client validates
```

### Sanitization Rules

1. **String Inputs**: `.trim()` to remove whitespace
2. **Email**: Use `.email()` validator
3. **URLs**: Use `.url()` validator
4. **Numbers**: Validate min/max ranges
5. **Enums**: Use `.enum()` for fixed values
6. **HTML Content**: Sanitize with DOMPurify (if needed)

## SQL Injection Prevention

### MikroORM Protection

**✅ MikroORM handles SQL injection automatically**:

```typescript
// ✅ Good - Parameterized queries (safe)
const users = await userRepository.find({
  email: userInput, // MikroORM escapes this
})

const results = await em.qb(Jobs)
  .where({ title: { $like: `%${searchTerm}%` } }) // Safe with MikroORM
  .getResult()
```

**❌ Avoid raw SQL**:
```typescript
// ❌ Dangerous - Raw SQL with string interpolation
const users = await em.execute(
  `SELECT * FROM users WHERE email = '${userInput}'` // SQL injection risk!
)

// ✅ Better - If raw SQL needed, use parameters
const users = await em.execute(
  `SELECT * FROM users WHERE email = ?`,
  [userInput]
)
```

### Best Practices

1. Use MikroORM query builder
2. Never concatenate user input into SQL
3. Use parameterized queries if raw SQL is necessary
4. Validate all input before database operations
5. Use ORM methods (find, findOne, etc.)

## XSS Prevention

### React Automatic Protection

React escapes values by default:

```typescript
// ✅ Safe - React escapes automatically
<div>{userInput}</div>
<input value={userInput} />
```

### Dangerous Patterns

```typescript
// ❌ Dangerous - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ If absolutely needed, sanitize first
import DOMPurify from "isomorphic-dompurify"

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput)
}} />
```

### URL Safety

```typescript
// ❌ Dangerous - JavaScript URLs
<a href={userInput}>Link</a>

// ✅ Good - Validate URL scheme
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

<a href={isValidUrl(userInput) ? userInput : '#'}>Link</a>
```

## Authentication & Authorization

### Better Auth Implementation

```typescript
// ✅ Good - shared/better-auth/index.ts
import { betterAuth } from "better-auth"
import { mikroOrmAdapter } from "better-auth/adapters/mikro-orm"

export const auth = betterAuth({
  database: mikroOrmAdapter(db.em),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    generateId: () => generateId(), // Custom ID generation
  },
})
```

### Protected Routes (Frontend)

```typescript
// ✅ Good - share/context/protected.tsx
"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "./auth-context"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) return <Loader />
  return isAuthenticated ? <>{children}</> : null
}
```

### Protected API Routes

```typescript
// ✅ Good - Require authentication
import { auth } from "#/shared/better-auth"

const requireAuth = async (c: Context<HonoEnv>, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    throw new HttpException(HttpStatus.UNAUTHORIZED, "Unauthorized")
  }

  c.set("session", session)
  await next()
}

app.use("/api/v1/candidates/*", requireAuth)
```

### Password Security

```typescript
// ✅ Good - Better Auth handles password hashing
// Uses bcrypt internally

// Password requirements in validation
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain uppercase letter")
  .regex(/[a-z]/, "Password must contain lowercase letter")
  .regex(/[0-9]/, "Password must contain number")
  .regex(/[^A-Za-z0-9]/, "Password must contain special character")
```

## CORS Configuration

### Proper CORS Setup

```typescript
// ✅ Good - apps/api/src/index.ts
import { cors } from "hono/cors"
import { appConfig } from "./configs"

app.use("*", cors({
  origin: appConfig.CORS_ORIGIN, // From environment
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 3600,
}))
```

### Environment Configuration

```bash
# apps/api/.env
CORS_ORIGIN=http://localhost:3000,https://app.example.com
```

**❌ Anti-patterns**:
```typescript
// ❌ Dangerous - Allow all origins
cors({ origin: "*" })

// ❌ Dangerous - Reflect origin without validation
cors({
  origin: (origin) => origin // Reflects any origin!
})
```

## Security Headers

### Configured Headers

```typescript
// ✅ Good - shared/security/security.headers.ts
import { secureHeaders } from "hono/secure-headers"

export const appSecurityHeaders = {
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
  },
  xFrameOptions: "DENY",
  xContentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
  },
}

// Apply in index.ts
app.use("*", secureHeaders(appSecurityHeaders))
```

### Headers Explained

- **CSP**: Prevents XSS by controlling resource loading
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME-sniffing
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Controls browser features

## Data Protection

### Sensitive Data Handling

```typescript
// ✅ Good - Never log sensitive data
logger.info({
  userId: user.id,
  action: "login",
  // ❌ Don't log: password, tokens, SSN, credit cards
}, "User logged in")

// ✅ Good - Exclude sensitive fields from responses
const sanitizeUser = (user: Users) => {
  const { password, refreshToken, ...safe } = user
  return safe
}
```

### Personal Identifiable Information (PII)

**PII includes**:
- Email addresses
- Phone numbers
- Full names
- Addresses
- SSN, passport numbers
- Credit card numbers
- IP addresses (in some jurisdictions)

**Protection Requirements**:
1. Encrypt at rest (database encryption)
2. Encrypt in transit (HTTPS/TLS)
3. Access logging
4. Data retention policies
5. Right to deletion (GDPR)
6. Consent management

### Database Encryption

```typescript
// ✅ Good - Encrypt sensitive fields
import { Property } from "@mikro-orm/core"
import { encrypt, decrypt } from "#/shared/crypto"

@Entity()
export class Users extends AppBaseEntity<Users> {
  @Property({ type: "text" })
  email!: string

  @Property({
    type: "text",
    onCreate: (user) => encrypt(user.ssn),
    serializer: (value) => decrypt(value),
  })
  ssn?: string // Encrypted at rest
}
```

## Rate Limiting

### API Rate Limiting

```typescript
// ✅ Good - Rate limit sensitive endpoints
import { rateLimiter } from "hono-rate-limiter"

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Max 100 requests per window
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "unknown",
})

// Apply to auth endpoints
app.use("/api/auth/*", limiter)

// Stricter limit for login
const loginLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5, // Only 5 login attempts per 15 min
})

app.post("/api/auth/login", loginLimiter, authController.login)
```

## File Upload Security

### Safe File Handling

```typescript
// ✅ Good - Validate file uploads
import { z } from "zod"

const fileUploadSchema = z.object({
  filename: z.string().regex(/^[\w\-. ]+$/), // Alphanumeric + common chars
  mimetype: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ]),
  size: z.number().max(5 * 1024 * 1024), // Max 5MB
})

// Validate before processing
const file = fileUploadSchema.parse(uploadedFile)

// Generate unique filename (don't trust user input)
const safeFilename = `${generateId()}.${getExtension(file.mimetype)}`
```

**❌ Dangerous practices**:
```typescript
// ❌ Using user-provided filename directly
const path = `/uploads/${userFilename}` // Path traversal risk!

// ❌ No file type validation
// ❌ No size limits
// ❌ Executing uploaded files
```

## Logging & Monitoring

### Security Event Logging

```typescript
// ✅ Good - Log security events
const logger = c.get("logger")

// Authentication events
logger.info({ userId, ip, userAgent }, "User login successful")
logger.warn({ email, ip, userAgent }, "Failed login attempt")

// Authorization failures
logger.warn({ userId, resource, action }, "Unauthorized access attempt")

// Data access
logger.info({ userId, candidateId }, "Candidate data accessed")

// Configuration changes
logger.info({ userId, setting, oldValue, newValue }, "Configuration updated")
```

### What to Log

✅ **Log**:
- Authentication attempts (success/failure)
- Authorization failures
- Data modifications (create, update, delete)
- Configuration changes
- Security errors
- Rate limit violations

❌ **Never Log**:
- Passwords
- API keys or tokens
- Credit card numbers
- Social security numbers
- Other PII or sensitive data

## Security Checklist

### Before Deployment

- [ ] All environment variables validated with Zod
- [ ] No hardcoded secrets in code
- [ ] CORS properly configured
- [ ] Security headers configured
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using MikroORM)
- [ ] XSS prevention (React + sanitization)
- [ ] Authentication required on protected routes
- [ ] File upload validation
- [ ] Error messages don't expose sensitive info
- [ ] Logging doesn't include sensitive data
- [ ] HTTPS/TLS enabled in production
- [ ] Database connections encrypted
- [ ] Regular security audits scheduled
- [ ] Dependencies up to date (run `pnpm audit`)

### Security Audit Commands

```bash
# Check for vulnerabilities in dependencies
pnpm audit

# Fix automatically fixable issues
pnpm audit --fix

# Check for outdated packages
pnpm outdated

# Run security linting
pnpm lint:security
```

## Incident Response

### If Security Breach Detected

1. **Immediate Actions**:
   - Isolate affected systems
   - Preserve evidence (logs, database snapshots)
   - Reset compromised credentials
   - Notify security team

2. **Investigation**:
   - Identify breach scope
   - Review access logs
   - Determine data exposure
   - Document findings

3. **Remediation**:
   - Patch vulnerabilities
   - Update security controls
   - Reset affected user credentials
   - Deploy fixes

4. **Communication**:
   - Notify affected users (if PII exposed)
   - File required breach reports
   - Update team on lessons learned
   - Implement preventive measures

## Compliance Requirements

### Data Protection (GDPR/CCPA)

1. **Right to Access**: Users can request their data
2. **Right to Deletion**: Soft delete implementation
3. **Right to Portability**: Export user data
4. **Consent Management**: Track user consents
5. **Data Minimization**: Collect only necessary data
6. **Purpose Limitation**: Use data only for stated purpose

### Implementation

```typescript
// ✅ Soft delete for GDPR compliance
@SoftDeletable(() => Users, "deletedAt", () => new Date())
export class Users extends AppBaseEntity<Users> {
  // Soft delete instead of hard delete
}

// User data export
export const exportUserData = async (userId: string) => {
  const user = await userRepository.findOne({ id: userId })
  const applications = await applicationRepository.find({ userId })
  // ... compile all user data
  return {
    user,
    applications,
    exportedAt: new Date().toISOString(),
  }
}
```

Remember:
- Security is everyone's responsibility
- Validate all input, sanitize all output
- Never trust client-side validation alone
- Keep dependencies updated
- Log security events, never sensitive data
- Plan for incidents, not if but when
