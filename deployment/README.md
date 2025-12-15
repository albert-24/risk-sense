# Deployment Configuration

This directory contains all the necessary files and scripts for deploying the Sugarcane Loss Assessment application to AWS S3 and CloudFront.

## Files Overview

### Core Deployment Files

- **`cloudformation-template.yaml`** - CloudFormation Infrastructure as Code template
  - Defines S3 bucket with versioning and public access blocking
  - Creates CloudFront distribution with optimized caching
  - Sets up Origin Access Identity for secure S3 access
  - Includes custom error handling for SPA routing

- **`deploy.sh`** - Main deployment script
  - Builds the React application
  - Creates or updates CloudFormation stack
  - Uploads files to S3 with appropriate cache headers
  - Invalidates CloudFront cache
  - Provides deployment summary

- **`quick-start.sh`** - Interactive quick start script
  - Guides through deployment step-by-step
  - Checks prerequisites
  - Collects configuration interactively
  - Suitable for first-time deployments

### Configuration Files

- **`.env.example`** - Environment variables template
  - Copy to `.env` and fill in your values
  - Contains AWS, application, and deployment settings

### Documentation

- **`DEPLOYMENT_GUIDE.md`** - Comprehensive deployment guide
  - Prerequisites and setup instructions
  - Architecture overview
  - Manual and automated deployment steps
  - Troubleshooting guide
  - Monitoring and maintenance

## Quick Start

### Option 1: Interactive Quick Start (Recommended for First-Time)

```bash
chmod +x deployment/quick-start.sh
./deployment/quick-start.sh
```

This will guide you through:
1. Checking prerequisites
2. Collecting configuration
3. Building the application
4. Creating AWS infrastructure
5. Uploading files
6. Invalidating cache

### Option 2: Manual Deployment Script

```bash
chmod +x deployment/deploy.sh
./deployment/deploy.sh production us-east-1
```

### Option 3: Automated GitHub Actions

Push to your repository branches:
- `main` → deploys to production
- `staging` → deploys to staging
- `develop` → deploys to development

## Prerequisites

Before deploying, ensure you have:

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **Node.js** (v18+) and **pnpm** installed
4. **Gemini API Key** for the application

## Architecture

```
GitHub Repository
       ↓
   [Push Code]
       ↓
GitHub Actions (CI/CD)
       ↓
   [Build & Test]
       ↓
   [Deploy to AWS]
       ↓
   ┌─────────────────────────┐
   │   CloudFormation Stack  │
   │  ┌─────────────────────┐│
   │  │   S3 Bucket         ││
   │  │ (React SPA Files)   ││
   │  └─────────────────────┘│
   │  ┌─────────────────────┐│
   │  │   CloudFront CDN    ││
   │  │ (Global Cache)      ││
   │  └─────────────────────┘│
   └─────────────────────────┘
       ↓
   [Global Users]
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp deployment/.env.example deployment/.env
# Edit deployment/.env with your values
```

Key variables:
- `AWS_REGION` - AWS region for deployment
- `ENVIRONMENT` - deployment environment (production/staging/development)
- `VITE_GEMINI_API_KEY` - Gemini API key for the application
- `CUSTOM_DOMAIN` - (Optional) custom domain for CloudFront

## Deployment Environments

### Development
- Branch: `develop`
- URL: `https://dev-sugarcane-app-ACCOUNT_ID.cloudfront.net`
- Cache: Minimal caching for rapid iteration

### Staging
- Branch: `staging`
- URL: `https://staging-sugarcane-app-ACCOUNT_ID.cloudfront.net`
- Cache: Standard caching for testing

### Production
- Branch: `main`
- URL: `https://sugarcane-app-ACCOUNT_ID.cloudfront.net` or custom domain
- Cache: Optimized caching for performance

## Monitoring

### CloudWatch Metrics
- Monitor CloudFront requests and errors
- Track S3 bucket size and operations
- Set up alarms for high error rates

### CloudFront Logs
- Enable logging to S3 for detailed analytics
- Analyze user access patterns
- Debug distribution issues

## Cost Estimation

Typical monthly costs (rough estimates):

| Service | Usage | Cost |
|---------|-------|------|
| S3 Storage | 100 MB | $0.02 |
| S3 Requests | 100K requests | $0.50 |
| CloudFront | 1 GB transfer | $0.085 |
| **Total** | | **~$0.60** |

*Costs vary by region and usage. See AWS pricing calculator for accurate estimates.*

## Troubleshooting

### Common Issues

**Issue**: "Access Denied" when uploading to S3
```bash
# Check IAM permissions
aws s3 ls s3://your-bucket-name
```

**Issue**: Old content still showing
```bash
# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

**Issue**: Build fails with missing API key
```bash
# Ensure environment variable is set
export VITE_GEMINI_API_KEY=your_key_here
pnpm run build
```

See `DEPLOYMENT_GUIDE.md` for more troubleshooting steps.

## Security Best Practices

1. **IAM Permissions**: Use least privilege principle
2. **S3 Bucket**: Block all public access (enabled by default)
3. **CloudFront**: Use Origin Access Identity
4. **HTTPS**: Always use HTTPS (enforced by default)
5. **API Keys**: Store in GitHub Secrets, never commit to repo
6. **Versioning**: Enable S3 versioning for rollback capability

## Rollback

To rollback to a previous version:

```bash
# List previous versions
aws s3api list-object-versions --bucket your-bucket-name

# Restore specific version
aws s3api get-object \
  --bucket your-bucket-name \
  --key index.html \
  --version-id VERSION_ID \
  index.html

# Upload restored version
aws s3 cp index.html s3://your-bucket-name/

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## Support

For detailed information, see:
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- AWS Documentation: https://docs.aws.amazon.com/
- GitHub Actions: https://docs.github.com/en/actions

## Next Steps

1. ✅ Review this README
2. ✅ Read `DEPLOYMENT_GUIDE.md`
3. ✅ Set up AWS account and credentials
4. ✅ Run `./deployment/quick-start.sh`
5. ✅ Test the deployed application
6. ✅ Set up monitoring and alerts
