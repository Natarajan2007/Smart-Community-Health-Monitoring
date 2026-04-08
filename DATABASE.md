# Database Setup & Configuration

## Overview

This guide covers database setup, ORM configuration, and migration strategies for the Smart Community Health Monitoring platform.

## Supported Databases

The application supports multiple database backends:

- **MongoDB** - Default (document-based, flexible schema)
- **PostgreSQL** - Relational (structured, ACID compliance)
- **MySQL** - Relational (popular, good for search)
- **SQLite** - Embedded (development, testing)

## Database Models

### 1. **User Model**

Stores user account information with security considerations.

```javascript
{
  id: "user_123",
  username: "john_doe",
  email: "john@example.com",
  phoneNumber: "9876543210",
  passwordHash: { algorithm, iterations, salt, hash },
  profile: {
    firstName: "John",
    lastName: "Doe",
    preferredLanguage: "en"
  },
  status: "active",
  roles: ["user"],
  emailVerified: true,
  lastLogin: "2026-04-08T10:30:00Z",
  createdAt: "2026-04-01T00:00:00Z"
}
```

**Sensitive Fields (Encrypted):**
- Email
- Phone Number
- Aadhaar Hash

---

### 2. **Session Model**

Tracks active user sessions for security and audit.

```javascript
{
  id: "session_xyz",
  userId: "user_123",
  token: "jwt_token_here",
  ipAddress: "192.168.1.1",
  deviceType: "desktop",
  browser: "Chrome 120",
  isActive: true,
  lastActivityAt: "2026-04-08T10:30:00Z",
  expiresAt: "2026-04-15T10:30:00Z"
}
```

**Features:**
- Auto-delete expired sessions (TTL index)
- Device and location tracking
- Last activity monitoring

---

### 3. **Chat Message Model**

Stores conversation history for analytics and compliance.

```javascript
{
  id: "msg_abc",
  sessionId: "session_xyz",
  userId: "user_123",
  role: "user",
  content: "What is DBT?",
  language: "en",
  responseTime: 245,
  tokens: { prompt: 10, completion: 50, total: 60 }
}
```

**Retention:** 365 days (configurable)

---

### 4. **Analytics Event Model**

Tracks user interactions for analytics.

```javascript
{
  id: "event_123",
  userId: "user_123",
  sessionId: "session_xyz",
  eventType: "page_view",
  action: "visit_home",
  metadata: { referrer: "google" },
  createdAt: "2026-04-08T10:30:00Z"
}
```

**Event Types:**
- page_view
- button_click
- form_submit
- chat_message
- quiz_complete
- eligibility_check

---

### 5. **Eligibility Check Model**

Stores verification results for DBT/Aadhaar eligibility.

```javascript
{
  id: "check_123",
  userId: "user_123",
  checkType: "dbt_eligible",
  status: "eligible",
  verifiedAt: "2026-04-08T10:30:00Z",
  expiresAt: "2027-04-08T10:30:00Z"
}
```

---

### 6. **Audit Log Model**

Comprehensive audit trail for compliance.

```javascript
{
  id: "audit_123",
  userId: "user_123",
  action: "USER_UPDATE",
  entity: "User",
  entityId: "user_123",
  changes: {
    before: { status: "active" },
    after: { status: "suspended" }
  },
  createdAt: "2026-04-08T10:30:00Z"
}
```

**Retention:** 2555 days (7 years for compliance)

---

## Setup Instructions

### MongoDB Setup

#### Local Development

```bash
# Install MongoDB
# On macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Connect to MongoDB
mongosh

# Create database
use healthMonitoring

# Create collections and indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
db.chatMessages.createIndex({ sessionId: 1, createdAt: -1 })
db.analyticsEvents.createIndex({ userId: 1, createdAt: -1 })
```

#### Environment Variables

```env
DATABASE_URL=mongodb://localhost:27017/healthMonitoring
DATABASE_TYPE=mongodb
MONGODB_DB=healthMonitoring
```

### PostgreSQL Setup

#### Local Development

```bash
# Install PostgreSQL
# On macOS with Homebrew
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database and user
createuser healthuser -P
createdb -O healthuser healthMonitoring

# Connect and setup
psql -U healthuser -d healthMonitoring

# Create tables
\i schema.sql
```

#### Environment Variables

```env
DATABASE_URL=postgresql://healthuser:password@localhost:5432/healthMonitoring
DATABASE_TYPE=postgresql
```

### SQLite (Development/Testing)

```env
DATABASE_URL=sqlite:./data/healthMonitoring.db
DATABASE_TYPE=sqlite
```

---

## ORM Configuration

### Using Mongoose (MongoDB)

```javascript
import mongoose from 'mongoose';

// Connect
await mongoose.connect(process.env.DATABASE_URL);

// Define schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Use
const user = await User.create({ username: 'john', email: 'john@example.com' });
```

### Using Sequelize (PostgreSQL/MySQL)

```javascript
import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING, unique: true },
  passwordHash: DataTypes.JSON
});

await sequelize.sync();
const user = await User.create({ username: 'john' });
```

### Using TypeORM (PostgreSQL/MySQL)

```typescript
import { createConnection, Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;
}

const connection = await createConnection();
const user = await connection.manager.save(User, { username: 'john' });
```

---

## Migrations

### Create Migration (Mongoose)

```javascript
// migration-001-initial-schema.js
export async function up(db) {
  await db.createCollection('users');
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
}

export async function down(db) {
  await db.collection('users').drop();
}
```

### Create Migration (Sequelize)

```bash
npx sequelize-cli migration:generate --name initial-schema
```

```javascript
// migrations/20240408-initial-schema.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.UUID, primaryKey: true },
      username: { type: Sequelize.STRING, unique: true },
      email: { type: Sequelize.STRING, unique: true },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  }
};
```

---

## Backup & Recovery

### MongoDB Backup

```bash
# Backup
mongodump --uri="mongodb://localhost:27017/healthMonitoring" \
          --out=./backups/healthMonitoring

# Restore
mongorestore --uri="mongodb://localhost:27017/healthMonitoring" \
             ./backups/healthMonitoring
```

### PostgreSQL Backup

```bash
# Backup
pg_dump -U healthuser healthMonitoring > backup.sql

# Restore
psql -U healthuser healthMonitoring < backup.sql
```

---

## Performance Optimization

### Indexing Strategy

```javascript
// High-priority indexes (query frequently)
Users: ['email', 'username', 'createdAt']
Sessions: ['userId', 'token', 'expiresAt', 'isActive']
ChatMessages: ['sessionId', 'userId', 'createdAt']
AnalyticsEvents: ['userId', 'eventType', 'createdAt']

// Compound indexes (for common queries)
Sessions: [['userId', 'isActive'], ['userId', 'createdAt']]
ChatMessages: [['sessionId', 'createdAt']]
```

### Query Optimization

```javascript
// Use projections to select only needed fields
db.users.find({}, { email: 1, username: 1 });

// Use pagination for large result sets
db.chatMessages.find({ sessionId: id })
  .sort({ createdAt: -1 })
  .skip(pageSize * (pageNum - 1))
  .limit(pageSize);

// Use aggregation for complex queries
db.chatMessages.aggregate([
  { $match: { sessionId: id } },
  { $group: { _id: '$role', count: { $sum: 1 } } }
]);
```

---

## Monitoring

### Database Health Checks

```javascript
export async function checkDatabaseHealth() {
  try {
    const startTime = Date.now();
    
    // Ping database
    await db.admin().ping();
    
    const duration = Date.now() - startTime;
    
    return {
      status: 'healthy',
      responseTime: `${duration}ms`,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}
```

---

## Best Practices

1. **Encrypt sensitive fields** (email, phone, Aadhaar)
2. **Use indexes** for frequently queried fields
3. **Implement soft deletes** for data retention
4. **Set TTL** on temporary collections (sessions, tokens)
5. **Backup regularly** (daily minimum)
6. **Monitor query performance** and slow queries
7. **Use transactions** for multi-document operations
8. **Validate data** before storage
9. **Implement logging** for all operations
10. **Archive old data** to reduce database size
