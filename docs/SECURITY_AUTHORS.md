# Security Guidelines for Author Data Access

## ⚠️ CRITICAL SECURITY NOTICE

The `authors` table contains sensitive email addresses that must NOT be exposed to public users.

## Safe Usage Patterns

### ✅ CORRECT - Explicit field selection (excludes email)
```typescript
// Blog pages and public-facing components
const { data } = await supabase
  .from('blog_posts')
  .select(`
    *,
    author:authors(name, avatar_url, bio, social_links)
  `)
```

### ✅ CORRECT - Using secure functions
```typescript
// For single author data
const { data } = await supabase.rpc('get_author_for_blog', { author_id: id })

// For multiple authors (public info only)
const { data } = await supabase.rpc('get_authors_public')
```

### ❌ WRONG - Selecting all fields (exposes email)
```typescript
// NEVER do this in public-facing code
const { data } = await supabase
  .from('authors')
  .select('*')  // This includes email addresses!
```

### ❌ WRONG - Including email in joins
```typescript
// NEVER do this in public-facing code
const { data } = await supabase
  .from('blog_posts')
  .select(`
    *,
    author:authors(name, email, avatar_url)  // Email field exposed!
  `)
```

## Admin Access

Only authenticated admin users should access full author data including emails:

```typescript
// Admin components only
const { isAdmin } = useAdminAccess()
if (isAdmin) {
  const { data } = await supabase
    .from('authors')
    .select('*')  // Full access allowed for admins
}
```

## Security Measures in Place

1. **Application-level security**: All public queries explicitly exclude email fields
2. **Audit logging**: Admin actions are logged for security monitoring
3. **Role-based access**: Only admins can access full author data
4. **Secure functions**: Utility functions provide safe data access patterns

## Developer Responsibilities

- Always use explicit field selection in public queries
- Never select `*` from authors table in public-facing code
- Use the provided secure utility functions when possible
- Test queries to ensure email fields are not exposed
- Follow the principle of least privilege in data access