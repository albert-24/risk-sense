# Deploy Your Sugarcane App with AWS Keys - Complete Guide

## 🎯 Overview

This guide shows you how to deploy your Sugarcane Loss Assessment application to AWS S3 and CloudFront using your AWS credentials.

## ⏱️ Time Required: ~15 minutes

## 📋 Prerequisites

- AWS Account (free tier eligible)
- AWS CLI installed
- Node.js v18+
- pnpm v10+
- Gemini API Key

## 🚀 Quick Start (5 Steps)

### Step 1: Get AWS Keys (5 min)

**Option A: AWS Console (Easiest)**
1. Go to: https://console.aws.amazon.com
2. Sign in with your AWS account
3. Go to: IAM → Users → Create User
4. Name: `sugarcane-app-deployer`
5. Attach policies:
   - AmazonS3FullAccess
   - CloudFrontFullAccess
   - CloudFormationFullAccess
6. Create access key
7. **Save your keys securely:**
   - Access Key ID
   - Secret Access Key

### Step 2: Configure AWS CLI (2 min)

```bash
# Run interactive setup
aws configure

# When prompted, enter:
# AWS Access Key ID: [your Access Key ID]
# AWS Secret Access Key: [your Secret Access Key]
# Default region name: us-east-1
# Default output format: json
```

### Step 3: Verify Configuration (1 min)

```bash
# Test your AWS credentials
aws sts get-caller-identity

# Should show your AWS account info
```

### Step 4: Update Environment (2 min)

```bash
# Copy environment template
cp deployment/.env.example deployment/.env

# Edit with your Gemini API key
nano deployment/.env
```

Update:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
AWS_REGION=us-east-1
ENVIRONMENT=production
```

### Step 5: Deploy (5 min)

```bash
# Make script executable
chmod +x deployment/quick-start.sh

# Run interactive deployment
./deployment/quick-start.sh

# Follow the prompts and wait for deployment to complete
```

## ✅ After Deployment

Your application will be live at the CloudFront URL displayed in the output.

```
Example: https://d123456789.cloudfront.net
```

## 📚 Detailed Documentation

### For AWS Setup
- **File**: `deployment/AWS_DEPLOYMENT_GUIDE.md`
- **Contains**: Step-by-step AWS configuration, troubleshooting

### For Quick Reference
- **File**: `deployment/QUICK_REFERENCE.md`
- **Contains**: Common commands, quick lookup

### For Complete Guide
- **File**: `deployment/DEPLOYMENT_GUIDE.md`
- **Contains**: Comprehensive deployment instructions

### For Verification
- **File**: `deployment/DEPLOYMENT_CHECKLIST.md`
- **Contains**: Pre/post deployment checklist

## 🔑 AWS Keys Explained

### What are AWS Keys?
- **Access Key ID**: Username for AWS API
- **Secret Access Key**: Password for AWS API
- Used to authenticate your CLI commands

### Where to Get Them
1. AWS Console → IAM → Users
2. Select your user
3. Security credentials tab
4. Create access key

### How to Store Them Safely
```bash
# Stored in: ~/.aws/credentials
# Never commit to Git
# Never share via email
# Rotate regularly
```

## 🏗️ What Gets Deployed

```
Your Application
    ↓
S3 Bucket (stores files)
    ↓
CloudFront CDN (serves globally)
    ↓
Your Users (fast access worldwide)
```

## 💰 Costs

| Service | Cost |
|---------|------|
| S3 Storage | $0.02/month |
| S3 Requests | $0.50/month |
| CloudFront | $0.085/month |
| **Total** | **~$0.60/month** |

## 🔒 Security

✅ Your code stays private in S3  
✅ CloudFront serves it globally  
✅ HTTPS enforced automatically  
✅ AWS manages security updates  

## 🐛 Troubleshooting

### "Unable to locate credentials"
```bash
# Run AWS configuration
aws configure
```

### "Access Denied"
```bash
# Check IAM permissions
aws iam list-attached-user-policies --user-name sugarcane-app-deployer
```

### "Stack already exists"
```bash
# Delete old stack
aws cloudformation delete-stack \
  --stack-name sugarcane-app-production \
  --region us-east-1
```

### "Old content still showing"
```bash
# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## 📞 Need Help?

1. **AWS Setup Issues**: Read `deployment/AWS_DEPLOYMENT_GUIDE.md`
2. **Deployment Issues**: Read `deployment/DEPLOYMENT_GUIDE.md`
3. **Quick Lookup**: Check `deployment/QUICK_REFERENCE.md`
4. **Verification**: Use `deployment/DEPLOYMENT_CHECKLIST.md`

## 🎯 Next Steps

1. ✅ Get AWS keys from AWS Console
2. ✅ Run `aws configure` with your keys
3. ✅ Verify with `aws sts get-caller-identity`
4. ✅ Update `deployment/.env`
5. ✅ Run `./deployment/quick-start.sh`
6. ✅ Visit your CloudFront URL
7. ✅ Test your application

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Your AWS Account                │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   S3 Bucket                      │  │
│  │  (React App Files)               │  │
│  └──────────────────────────────────┘  │
│           ↑                             │
│           │ (Origin)                    │
│  ┌──────────────────────────────────┐  │
│  │   CloudFront Distribution        │  │
│  │  (Global CDN)                    │  │
│  └──────────────────────────────────┘  │
│           ↓                             │
└─────────────────────────────────────────┘
           ↓
    ┌──────────────┐
    │  Your Users  │
    │  (Worldwide) │
    └──────────────┘
```

## ✨ Features

✅ **Automated Deployment** - One command to deploy  
✅ **Global CDN** - Fast access worldwide  
✅ **HTTPS** - Secure by default  
✅ **Scalable** - Handles traffic spikes  
✅ **Cost Effective** - ~$0.60/month  
✅ **Easy Rollback** - Version control built-in  

## 📝 Files Created

```
deployment/
├── AWS_DEPLOYMENT_GUIDE.md      ← AWS setup guide
├── QUICK_REFERENCE.md           ← Quick lookup
├── cloudformation-template.yaml  ← Infrastructure
├── deploy.sh                     ← Deployment script
├── quick-start.sh               ← Interactive setup
└── .env.example                 ← Environment template

Root:
├── DEPLOY_WITH_AWS_KEYS.md      ← This file
├── DEPLOYMENT_SUMMARY.md        ← Overview
├── DEPLOYMENT_INDEX.md          ← Navigation
└── .env.production              ← Production config
```

## 🎓 Learning Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [AWS CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [AWS React SPA Pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/deploy-a-react-based-single-page-application-to-amazon-s3-and-cloudfront.html)

---

**Version**: 1.0  
**Status**: Production Ready  
**Last Updated**: December 2025  
**Support**: See documentation files for detailed help
