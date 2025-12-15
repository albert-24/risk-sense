# Sugarcane App - Complete Deployment Package

## 📦 What's Included

This deployment package contains everything needed to deploy the Sugarcane Loss Assessment application to AWS S3 and CloudFront.

### Core Files

| File | Purpose |
|------|---------|
| `deployment/cloudformation-template.yaml` | Infrastructure as Code - defines all AWS resources |
| `deployment/deploy.sh` | Automated deployment script |
| `deployment/quick-start.sh` | Interactive setup wizard (recommended for first-time) |
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD pipeline |

### Documentation

| Document | Purpose |
|----------|---------|
| `DEPLOYMENT_SUMMARY.md` | Quick overview and summary |
| `deployment/DEPLOYMENT_GUIDE.md` | Comprehensive step-by-step guide |
| `deployment/DEPLOYMENT_CHECKLIST.md` | Pre/post deployment checklist |
| `deployment/README.md` | Deployment folder overview |
| `DEPLOYMENT_INDEX.md` | This file |

### Configuration

| File | Purpose |
|------|---------|
| `deployment/.env.example` | Environment variables template |

## 🚀 Quick Start (3 Steps)

### Step 1: Prerequisites
```bash
# Verify you have:
- AWS Account with credentials configured
- Node.js v18+
- pnpm v10+
- Gemini API Key
```

### Step 2: Run Interactive Setup
```bash
chmod +x deployment/quick-start.sh
./deployment/quick-start.sh
```

### Step 3: Verify Deployment
```bash
# Visit the CloudFront URL provided in the output
# Test all features in your browser
```

## 📋 Documentation Guide

### For First-Time Deployment
1. Start with: `DEPLOYMENT_SUMMARY.md`
2. Then read: `deployment/DEPLOYMENT_GUIDE.md` (Prerequisites section)
3. Run: `./deployment/quick-start.sh`
4. Use: `deployment/DEPLOYMENT_CHECKLIST.md` to verify

### For Automated Deployment (GitHub Actions)
1. Read: `deployment/DEPLOYMENT_GUIDE.md` (GitHub Actions section)
2. Configure: GitHub Secrets
3. Push to: `main` branch to deploy

### For Troubleshooting
1. Check: `deployment/DEPLOYMENT_GUIDE.md` (Troubleshooting section)
2. Review: `deployment/DEPLOYMENT_CHECKLIST.md`
3. Verify: AWS CloudFormation events in AWS Console

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Users                           │
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

## 📊 Deployment Options

### Option 1: Interactive (Recommended)
```bash
./deployment/quick-start.sh
```
- ✅ Guided step-by-step
- ✅ Checks prerequisites
- ✅ Collects configuration
- ✅ Best for first-time users

### Option 2: Automated Script
```bash
./deployment/deploy.sh production us-east-1
```
- ✅ Fast deployment
- ✅ Requires pre-configuration
- ✅ Good for CI/CD

### Option 3: GitHub Actions
```bash
git push origin main
```
- ✅ Fully automated
- ✅ Requires GitHub setup
- ✅ Best for teams

## 🔧 Configuration

### Environment Variables
Copy and edit `.env` file:
```bash
cp deployment/.env.example deployment/.env
# Edit with your values
```

### GitHub Secrets (for CI/CD)
Add to GitHub repository:
- `AWS_ROLE_ARN` - IAM role for GitHub Actions
- `VITE_GEMINI_API_KEY` - Gemini API key
- `SLACK_WEBHOOK` - (Optional) Slack notifications

## 📈 Deployment Workflow

```
1. Build Application
   └─ pnpm run build

2. Create AWS Infrastructure
   └─ CloudFormation Stack
      ├─ S3 Bucket
      ├─ CloudFront Distribution
      └─ Origin Access Identity

3. Upload Files to S3
   ├─ Static assets (1-year cache)
   └─ index.html (no cache)

4. Invalidate CloudFront Cache
   └─ Serve latest content globally

5. Verify Deployment
   └─ Test application
```

## 💰 Cost Estimation

| Component | Monthly Cost |
|-----------|--------------|
| S3 Storage (100 MB) | $0.02 |
| S3 Requests (100K) | $0.50 |
| CloudFront (1 GB) | $0.085 |
| **Total** | **~$0.60** |

*Costs vary by region and usage. See AWS pricing calculator for accurate estimates.*

## 🔒 Security Features

- ✅ S3 bucket: Private with public access blocked
- ✅ CloudFront: Origin Access Identity (OAI)
- ✅ HTTPS: Enforced by default
- ✅ IAM: Role-based access control
- ✅ Versioning: S3 versioning enabled for rollback
- ✅ Secrets: Stored in GitHub Secrets, never committed

## 📞 Support Resources

### Documentation
- `deployment/DEPLOYMENT_GUIDE.md` - Comprehensive guide
- `deployment/DEPLOYMENT_CHECKLIST.md` - Verification checklist
- `DEPLOYMENT_SUMMARY.md` - Quick reference

### AWS Documentation
- [S3 Documentation](https://docs.aws.amazon.com/s3/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)

### Reference
- [AWS React SPA Deployment Pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/deploy-a-react-based-single-page-application-to-amazon-s3-and-cloudfront.html)

## ✅ Deployment Checklist

Before deploying, ensure:
- [ ] AWS account created and configured
- [ ] AWS CLI installed and configured
- [ ] Node.js v18+ installed
- [ ] pnpm v10+ installed
- [ ] Gemini API key obtained
- [ ] Repository cloned locally
- [ ] Dependencies installed: `pnpm install`
- [ ] Application builds successfully: `pnpm run build`

## 🎯 Next Steps

1. **Read** `DEPLOYMENT_SUMMARY.md` for overview
2. **Review** `deployment/DEPLOYMENT_GUIDE.md` for details
3. **Run** `./deployment/quick-start.sh` to deploy
4. **Verify** using `deployment/DEPLOYMENT_CHECKLIST.md`
5. **Monitor** CloudFront metrics in AWS Console

## 📝 File Structure

```
sugarcane-app/
├── deployment/
│   ├── cloudformation-template.yaml    # Infrastructure
│   ├── deploy.sh                       # Deployment script
│   ├── quick-start.sh                  # Interactive setup
│   ├── .env.example                    # Environment template
│   ├── DEPLOYMENT_GUIDE.md             # Comprehensive guide
│   ├── DEPLOYMENT_CHECKLIST.md         # Verification checklist
│   └── README.md                       # Folder overview
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Actions
├── src/                                # Application source
├── dist/                               # Built files (generated)
├── DEPLOYMENT_SUMMARY.md               # Quick summary
├── DEPLOYMENT_INDEX.md                 # This file
└── package.json
```

## 🚨 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

### Deployment Fails
```bash
# Check AWS credentials
aws sts get-caller-identity

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

## 📞 Questions?

Refer to the appropriate documentation:
- **Getting Started**: `DEPLOYMENT_SUMMARY.md`
- **Detailed Steps**: `deployment/DEPLOYMENT_GUIDE.md`
- **Verification**: `deployment/DEPLOYMENT_CHECKLIST.md`
- **Troubleshooting**: `deployment/DEPLOYMENT_GUIDE.md` (Troubleshooting section)

---

**Version**: 1.0  
**Last Updated**: December 2025  
**Status**: Production Ready  
**Maintained By**: Development Team
