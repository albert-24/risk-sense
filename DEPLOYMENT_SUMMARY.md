# Sugarcane App - AWS S3 & CloudFront Deployment Summary

## Overview

Complete deployment infrastructure for the Sugarcane Loss Assessment application to AWS S3 and CloudFront, with automated CI/CD via GitHub Actions.

## What's Included

### 📁 Deployment Files

```
deployment/
├── cloudformation-template.yaml    # Infrastructure as Code
├── deploy.sh                       # Main deployment script
├── quick-start.sh                  # Interactive setup wizard
├── .env.example                    # Environment variables template
├── DEPLOYMENT_GUIDE.md             # Comprehensive guide
└── README.md                       # Deployment folder overview
```

### 🔄 CI/CD Pipeline

```
.github/workflows/
└── deploy.yml                      # GitHub Actions workflow
```

## Quick Start

### 1. First-Time Setup (Recommended)

```bash
# Make scripts executable
chmod +x deployment/deploy.sh deployment/quick-start.sh

# Run interactive setup
./deployment/quick-start.sh
```

This will:
- ✅ Check prerequisites
- ✅ Collect configuration
- ✅ Build the application
- ✅ Create AWS infrastructure
- ✅ Upload files to S3
- ✅ Configure CloudFront
- ✅ Provide deployment summary

### 2. Manual Deployment

```bash
# Set environment variables
export ENVIRONMENT=production
export AWS_REGION=us-east-1

# Run deployment script
./deployment/deploy.sh production us-east-1
```

### 3. Automated Deployment (GitHub Actions)

```bash
# Push to trigger automatic deployment
git push origin main          # → Production
git push origin staging       # → Staging
git push origin develop       # → Development
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Global Users                         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │   CloudFront CDN               │
        │  (Global Distribution)         │
        │  - Caching                     │
        │  - Compression                 │
        │  - HTTPS/HTTP2                 │
        └────────────────┬───────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │   S3 Origin Bucket             │
        │  (React SPA Files)             │
        │  - index.html                  │
        │  - JavaScript bundles          │
        │  - CSS & Assets                │
        └────────────────────────────────┘
```

## Key Features

### ✅ Infrastructure as Code
- CloudFormation template for reproducible deployments
- Version controlled infrastructure
- Easy environment management (dev/staging/prod)

### ✅ Optimized Caching
- Static assets: 1-year cache
- HTML files: No cache (always fresh)
- Automatic cache invalidation

### ✅ Security
- S3 bucket: Private with public access blocked
- CloudFront: Origin Access Identity (OAI)
- HTTPS enforced
- IAM role-based access

### ✅ Automated CI/CD
- GitHub Actions workflow
- Automatic deployment on push
- Environment-based routing
- Slack notifications (optional)

### ✅ SPA Routing
- Custom error handling for 404/403
- Serves index.html for client-side routing
- Seamless navigation experience

## Prerequisites

### Required
- AWS Account with appropriate permissions
- AWS CLI v2 configured
- Node.js v18+
- pnpm v10+
- Gemini API Key

### Optional
- Custom domain with ACM certificate
- GitHub repository for CI/CD
- Slack workspace for notifications

## Deployment Steps

### Step 1: Prepare Environment

```bash
# Clone repository
git clone <your-repo>
cd sugarcane-app

# Install dependencies
pnpm install

# Copy environment template
cp deployment/.env.example deployment/.env

# Edit with your values
nano deployment/.env
```

### Step 2: Configure AWS

```bash
# Configure AWS CLI
aws configure

# Verify credentials
aws sts get-caller-identity
```

### Step 3: Deploy Infrastructure

```bash
# Option A: Interactive (Recommended)
./deployment/quick-start.sh

# Option B: Automated
./deployment/deploy.sh production us-east-1
```

### Step 4: Verify Deployment

```bash
# Get CloudFront URL
aws cloudformation describe-stacks \
  --stack-name sugarcane-app-production \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
  --output text

# Test the URL
curl -I https://your-cloudfront-domain.cloudfront.net
```

## Configuration

### Environment Variables

```env
# AWS
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

# Application
VITE_GEMINI_API_KEY=your_key_here
VITE_API_BASE_URL=https://api.yourdomain.com

# Deployment
ENVIRONMENT=production
STACK_NAME=sugarcane-app-production

# Optional: Custom Domain
CUSTOM_DOMAIN=yourdomain.com
ACM_CERTIFICATE_ARN=arn:aws:acm:...
```

### GitHub Secrets (for CI/CD)

```
AWS_ROLE_ARN              # IAM role for GitHub Actions
VITE_GEMINI_API_KEY       # Gemini API key
SLACK_WEBHOOK             # (Optional) Slack notifications
```

## Monitoring

### CloudWatch Metrics
- CloudFront requests and errors
- S3 bucket operations
- Cache hit ratio

### CloudFront Logs
- Enable S3 logging for detailed analytics
- Analyze user access patterns
- Debug distribution issues

### Alarms
- High error rate (>1%)
- Slow response times (>1s)
- Unusual traffic patterns

## Cost Estimation

| Component | Monthly Cost |
|-----------|--------------|
| S3 Storage (100 MB) | $0.02 |
| S3 Requests (100K) | $0.50 |
| CloudFront (1 GB) | $0.085 |
| **Total** | **~$0.60** |

*Costs vary by region and usage. See AWS pricing calculator.*

## Troubleshooting

### Build Fails
```bash
# Check Node version
node --version  # Should be v18+

# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Build with verbose output
pnpm run build --debug
```

### Deployment Fails
```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify IAM permissions
aws s3 ls

# Check CloudFormation events
aws cloudformation describe-stack-events \
  --stack-name sugarcane-app-production
```

### Old Content Still Showing
```bash
# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

See `deployment/DEPLOYMENT_GUIDE.md` for more troubleshooting.

## Security Best Practices

1. **IAM**: Use least privilege principle
2. **S3**: Block all public access (default)
3. **CloudFront**: Use Origin Access Identity
4. **HTTPS**: Always enforced
5. **Secrets**: Store in GitHub Secrets, never commit
6. **Versioning**: Enable S3 versioning for rollback

## Rollback Procedure

```bash
# List previous S3 versions
aws s3api list-object-versions --bucket your-bucket

# Restore specific version
aws s3api get-object \
  --bucket your-bucket \
  --key index.html \
  --version-id VERSION_ID \
  index.html

# Upload and invalidate cache
aws s3 cp index.html s3://your-bucket/
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## Maintenance

### Regular Tasks
- Monitor CloudFront metrics
- Review S3 bucket size
- Update dependencies
- Test disaster recovery

### Periodic Reviews
- Analyze CloudFront logs
- Optimize cache settings
- Review security policies
- Update IAM permissions

## Support Resources

- **Deployment Guide**: `deployment/DEPLOYMENT_GUIDE.md`
- **AWS S3 Docs**: https://docs.aws.amazon.com/s3/
- **AWS CloudFront Docs**: https://docs.aws.amazon.com/cloudfront/
- **AWS CloudFormation Docs**: https://docs.aws.amazon.com/cloudformation/
- **React Deployment Pattern**: https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/deploy-a-react-based-single-page-application-to-amazon-s3-and-cloudfront.html

## Next Steps

1. ✅ Review this summary
2. ✅ Read `deployment/DEPLOYMENT_GUIDE.md`
3. ✅ Set up AWS account and credentials
4. ✅ Run `./deployment/quick-start.sh`
5. ✅ Test the deployed application
6. ✅ Set up monitoring and alerts
7. ✅ Configure custom domain (optional)
8. ✅ Set up GitHub Actions (optional)

## File Structure

```
sugarcane-app/
├── deployment/
│   ├── cloudformation-template.yaml
│   ├── deploy.sh
│   ├── quick-start.sh
│   ├── .env.example
│   ├── DEPLOYMENT_GUIDE.md
│   └── README.md
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
├── dist/                    # Built files (generated)
├── package.json
├── pnpm-lock.yaml
└── DEPLOYMENT_SUMMARY.md    # This file
```

## Questions?

For detailed information on any aspect of deployment, refer to:
- `deployment/README.md` - Overview and quick reference
- `deployment/DEPLOYMENT_GUIDE.md` - Comprehensive guide with examples
- AWS documentation links above

---

**Last Updated**: December 2025
**Version**: 1.0
**Status**: Production Ready
