# SKU Transformation Service

## Overview

The SKU Transformation Service automatically handles Canadian regulatory requirements by detecting invalid SKU+Province combinations and transforming them to compliant province-specific SKUs.

## Key Features

✅ **Automatic Detection** - Identifies invalid SKU+Province combinations  
✅ **Smart Retry** - Automatically fetches and applies province-specific SKU  
✅ **Audit Trail** - Complete compliance logging for regulatory requirements  
✅ **Multi-Province** - Supports all 13 Canadian provinces/territories  
✅ **Production Ready** - Full TypeScript, error handling, async/await  
✅ **Well Tested** - Comprehensive unit test suite included  
✅ **Flexible** - Multiple fallback strategies (escalate, fail, manual review)  

## Architecture

```
┌─────────────────────────────────┐
│   Enrollment Request            │
│  (Generic SKU + Province)       │
└────────────┬────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  Validation & Detection          │
│  (Check if combo is valid)       │
└────────┬─────────────────────────┘
         │
         ├─ VALID ─────────► Process Enrollment ✓
         │
         └─ INVALID ──────► SKU Transformation Service
                                 │
                                 ▼
                         SKU Mapping Lookup
                                 │
                         ├─ Found ──────► Retry with Transformed SKU ✓
                         │
                         └─ Not Found ──► Escalation/Manual Review
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npm run db:migrate

# 3. Configure environment
cp .env.example .env

# 4. Run tests
npm test

# 5. Start service
npm run dev
```

## Installation

### Prerequisites
- Node.js 18+
- MySQL 5.7+
- npm or yarn

### Steps

1. **Clone repository**
```bash
git clone https://github.com/SteveIngels/AI_Testing.git
cd AI_Testing
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Set up database**
```bash
npm run db:migrate
```

5. **Run tests**
```bash
npm test
```

6. **Start development server**
```bash
npm run dev
```

## Usage

### Basic Enrollment Request

```bash
curl -X POST http://localhost:3000/api/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "product_sku": "SKU-GENERIC-001",
    "province": "CA_ON",
    "customer_id": "CUST-12345",
    "plan_type": "BASIC_PLAN",
    "email": "customer@example.com"
  }'
```

### Response - Success (with transformation)

```json
{
  "success": true,
  "message": "Enrollment processed successfully",
  "data": {
    "customer_id": "CUST-12345",
    "original_sku": "SKU-GENERIC-001",
    "final_sku": "SKU-ON-001",
    "sku_transformed": true,
    "province": "CA_ON"
  }
}
```

### Response - Failure

```json
{
  "success": false,
  "error": {
    "code": "ESCALATION_REQUIRED",
    "message": "No province-specific SKU mapping found",
    "customer_id": "CUST-12345",
    "province": "CA_ON"
  }
}
```

## Configuration

### Environment Variables

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=enrollment_user
DB_PASSWORD=your_password
DB_NAME=enrollment_db
REDIS_HOST=localhost (optional)
NODE_ENV=development
LOG_LEVEL=info
```

### Fallback Strategies

**Escalate** (Recommended)
- Logs warning and marks for manual review
- Best for compliance-critical scenarios

**Fail**
- Throws error immediately
- Best for strict validation

**Manual Review**
- Queues to manual review system
- Best for customer service integration

## Database

### Schema

The solution includes two main tables:

**sku_province_mappings** - SKU lookup table
- generic_sku: Input SKU
- province: Canadian province code
- province_specific_sku: Transformed SKU
- plan_type: Plan classification
- effective_date, expiry_date: Validity dates

**sku_transformation_audit** - Audit trail
- customer_id: Customer identifier
- original_sku, transformed_sku: Transformation details
- status: success, failed, not_found
- created_at: Transaction timestamp

### Add New Mapping

```sql
INSERT INTO sku_province_mappings (
  generic_sku, province, province_specific_sku, plan_type, effective_date, created_by
) VALUES (
  'SKU-GENERIC-002', 'CA_AB', 'SKU-AB-002', 'PREMIUM_PLAN', NOW(), 'admin'
);
```

### View Transformation Audit

```sql
SELECT * FROM sku_transformation_audit
WHERE customer_id = 'CUST-12345'
ORDER BY created_at DESC;
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- sku-transformer.test.ts

# Watch mode
npm test -- --watch
```

## Deployment

### Build

```bash
npm run build
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Deployment Steps

- [ ] Database backups configured
- [ ] Audit logging enabled
- [ ] Cache strategy set to Redis
- [ ] Fallback strategy set to 'escalate'
- [ ] SSL/TLS certificates installed
- [ ] Environment variables secured
- [ ] Monitoring alerts configured

## Compliance & Audit

- 7-year audit log retention
- Complete transformation tracking
- Customer data privacy compliance
- Provincial regulatory adherence

## Support

For issues or questions:
1. Check logs: `logs/app.log`
2. Review implementation guide: `docs/IMPLEMENTATION_GUIDE.md`
3. Run test suite: `npm test`

## License

MIT