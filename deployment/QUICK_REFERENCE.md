# AWS Deployment - Quick Reference Card

## 🚀 Deploy in 5 Minutes

### 1. Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter region: us-east-1
# Enter output format: json
```

### 2. Verify Configuration
```bash
aws sts get-caller-identity
# Should show your AWS account info
```

### 3. Update Environment
```bash
cp deployment/.env.example deployment/.env
# Edit deployment/.env with your Gemini API key
```

### 4. Deploy
```bash
chmod +x deployment/quick-start.sh
./deployment/quick-start.sh
```

### 5. Get Your URL
```bash
# CloudFront URL will be displayed at the end
# Visit: https://your-cloudfront-domain.cloudfront.net
```

---

## 📋 Common Commands

### Get AWS Account Info
```bash
aws sts get-caller-identity
```

### List S3 Buckets
```bash
aws s3 ls
```

### Check CloudFormation Stack
```bash
aws cloudformation describe-stacks \
  --stack-name sugarcane-app-production \
  --region us-east-1
```

### Get CloudFront URL
```bash
aws cloudformation describe-stacks \
  --stack-name sugarcane-app-production \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
  --output text
```

### Invalidate CloudFront Cache
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Delete Stack
```bash
aws cloudformation delete-stack \
  --stack-name sugarcane-app-production \
  --region us-east-1
```

---

## 🔑 AWS Keys Setup

### Get Keys from AWS Console
1. Go to: https://console.aws.amazon.com
2. IAM → Users → Create User
3. Attach policies: S3, CloudFront, CloudFormation
4. Create access key
5. Save Access Key ID and Secret Access Key

### Configure Locally
```bash
# Option 1: Interactive
aws configure

# Option 2: Manual
nano ~/.aws/credentials
# Add:
# [default]
# aws_access_key_id = YOUR_KEY
# aws_secret_access_key = YOUR_SECRET

# Option 3: Environment Variables
export AWS_ACCESS_KEY_ID=YOUR_KEY
export AWS_SECRET_ACCESS_KEY=YOUR_SECRET
```

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| "Unable to locate credentials" | Run `aws configure` |
| "Access Denied" | Check IAM permissions |
| "Stack already exists" | Use different name or delete old stack |
| "Old content showing" | Invalidate CloudFront cache |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `deployment/quick-start.sh` | Interactive deployment |
| `deployment/deploy.sh` | Automated deployment |
| `deployment/.env.example` | Environment template |
| `deployment/cloudformation-template.yaml` | Infrastructure |
| `.github/workflows/deploy.yml` | GitHub Actions |

---

## 🎯 Deployment Environments

| Environment | Branch | URL |
|-------------|--------|-----|
| Production | main | https://sugarcane-app-prod.cloudfront.net |
| Staging | staging | https://sugarcane-app-staging.cloudfront.net |
| Development | develop | https://sugarcane-app-dev.cloudfront.net |

---

## 💰 Estimated Costs

- S3 Storage: $0.02/month
- S3 Requests: $0.50/month
- CloudFront: $0.085/month
- **Total: ~$0.60/month**

---

## 📞 Need Help?

1. Read: `deployment/AWS_DEPLOYMENT_GUIDE.md`
2. Check: `deployment/DEPLOYMENT_GUIDE.md`
3. Review: `deployment/DEPLOYMENT_CHECKLIST.md`

---

**Version**: 1.0 | **Last Updated**: December 2025
