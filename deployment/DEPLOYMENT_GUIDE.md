# Sugarcane App - AWS S3 & CloudFront Deployment Guide

This guide provides step-by-step instructions for deploying the Sugarcane Loss Assessment application to AWS S3 and CloudFront.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Manual Deployment](#manual-deployment)
4. [Automated Deployment (GitHub Actions)](#automated-deployment-github-actions)
5. [Configuration](#configuration)
6. [Troubleshooting](#troubleshooting)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

### Required Tools

- **AWS CLI** (v2.x or higher)
  ```bash
  # Install AWS CLI
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install
  ```

- **Node.js** (v18 or higher)
  ```bash
  # Using nvm (recommended)
  nvm install 18
  nvm use 18
  ```

- **pnpm** (v10 or higher)
  ```bash
  npm install -g pnpm@10
  ```

### AWS Account Setup

1. **Create an AWS Account** (if you don't have one)
   - Visit https://aws.amazon.com/

2. **Create IAM User with Programmatic Access**
   - Go to IAM Console → Users → Create User
   - Attach policies:
     - `AmazonS3FullAccess`
     - `CloudFrontFullAccess`
     - `CloudFormationFullAccess`
   - Create access keys and save them securely

3. **Configure AWS CLI**
   ```bash
   aws configure
   # Enter your Access Key ID
   # Enter your Secret Access Key
   # Enter default region (e.g., us-east-1)
   # Enter default output format (json)
   ```

4. **Verify Configuration**
   ```bash
   aws sts get-caller-identity
   ```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CloudFront CDN                        │
│                   (Global Distribution)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    S3 Origin Bucket                          │
│  (React SPA - index.html, JS, CSS, Assets)                 │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

- **S3 Bucket**: Stores the built React application files
- **CloudFront**: CDN that caches and serves content globally
- **Origin Access Identity (OAI)**: Restricts S3 access to CloudFront only
- **CloudFormation**: Infrastructure as Code for automated setup

## Manual Deployment

### Step 1: Build the Application

```bash
# Install dependencies
pnpm install

# Build for production
pnpm run build

# Verify build output
ls -la dist/
```

### Step 2: Create AWS Infrastructure

```bash
# Set environment variables
export ENVIRONMENT=production
export AWS_REGION=us-east-1
export STACK_NAME=sugarcane-app-${ENVIRONMENT}

# Create CloudFormation stack
aws cloudformation create-stack \
  --stack-name ${STACK_NAME} \
  --template-body file://deployment/cloudformation-template.yaml \
  --parameters ParameterKey=EnvironmentName,ParameterValue=${ENVIRONMENT} \
  --region ${AWS_REGION} \
  --tags Key=Environment,Value=${ENVIRONMENT} Key=Application,Value=SugarcaneApp

# Wait for stack creation
aws cloudformation wait stack-create-complete \
  --stack-name ${STACK_NAME} \
  --region ${AWS_REGION}

echo "Stack created successfully!"
```

### Step 3: Get Stack Outputs

```bash
# Retrieve S3 bucket name
S3_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --region ${AWS_REGION} \
  --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
  --output text)

# Retrieve CloudFront Distribution ID
CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --region ${AWS_REGION} \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

# Retrieve CloudFront Domain
CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --region ${AWS_REGION} \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
  --output text)

echo "S3 Bucket: $S3_BUCKET"
echo "CloudFront ID: $CLOUDFRONT_ID"
echo "CloudFront Domain: $CLOUDFRONT_DOMAIN"
```

### Step 4: Upload Files to S3

```bash
# Upload static assets with long cache TTL
aws s3 sync dist/ s3://${S3_BUCKET}/ \
  --region ${AWS_REGION} \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --exclude "*.map"

# Upload index.html with no-cache
aws s3 cp dist/index.html s3://${S3_BUCKET}/index.html \
  --region ${AWS_REGION} \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"

echo "Files uploaded to S3!"
```

### Step 5: Invalidate CloudFront Cache

```bash
# Invalidate all files in CloudFront
aws cloudfront create-invalidation \
  --distribution-id ${CLOUDFRONT_ID} \
  --paths "/*" \
  --region ${AWS_REGION}

echo "CloudFront cache invalidated!"
```

### Step 6: Verify Deployment

```bash
# Test the CloudFront URL
curl -I https://${CLOUDFRONT_DOMAIN}

# Open in browser
echo "https://${CLOUDFRONT_DOMAIN}"
```

## Automated Deployment (GitHub Actions)

### Step 1: Create IAM Role for GitHub Actions

```bash
# Create trust policy file
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_ORG/sugarcane-app:*"
        }
      }
    }
  ]
}
EOF

# Create IAM role
aws iam create-role \
  --role-name GitHubActionsDeployRole \
  --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name GitHubActionsDeployRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-role-policy \
  --role-name GitHubActionsDeployRole \
  --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess

aws iam attach-role-policy \
  --role-name GitHubActionsDeployRole \
  --policy-arn arn:aws:iam::aws:policy/CloudFormationFullAccess
```

### Step 2: Add GitHub Secrets

Go to GitHub Repository → Settings → Secrets and Variables → Actions

Add the following secrets:

- `AWS_ROLE_ARN`: ARN of the IAM role created above
- `VITE_GEMINI_API_KEY`: Your Gemini API key
- `SLACK_WEBHOOK`: (Optional) Slack webhook for notifications

### Step 3: Push to Trigger Deployment

```bash
# Push to main branch to deploy to production
git push origin main

# Push to staging branch to deploy to staging
git push origin staging

# Push to develop branch to deploy to development
git push origin develop
```

## Configuration

### Environment Variables

Create `.env.production` for production environment:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_BASE_URL=https://your-api-domain.com
```

### CloudFront Cache Behavior

The deployment includes optimized cache behaviors:

- **Static Assets** (`/static/*`): 1 year cache
- **HTML Files**: No cache (always fresh)
- **API Responses**: Configurable based on needs

### Custom Domain Setup

To use a custom domain:

1. **Request ACM Certificate**
   ```bash
   aws acm request-certificate \
     --domain-name yourdomain.com \
     --validation-method DNS \
     --region us-east-1
   ```

2. **Update CloudFormation Stack**
   ```bash
   aws cloudformation update-stack \
     --stack-name ${STACK_NAME} \
     --template-body file://deployment/cloudformation-template.yaml \
     --parameters \
       ParameterKey=EnvironmentName,ParameterValue=${ENVIRONMENT} \
       ParameterKey=DomainName,ParameterValue=yourdomain.com \
       ParameterKey=CertificateArn,ParameterValue=arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERT_ID \
     --region ${AWS_REGION}
   ```

3. **Update Route 53 DNS Records**
   - Create CNAME record pointing to CloudFront domain

## Troubleshooting

### Issue: "Access Denied" when uploading to S3

**Solution**: Verify IAM permissions
```bash
aws s3 ls s3://${S3_BUCKET}
```

### Issue: CloudFront returns 403 Forbidden

**Solution**: Check Origin Access Identity
```bash
aws cloudfront get-distribution --id ${CLOUDFRONT_ID}
```

### Issue: Old content still showing after deployment

**Solution**: Invalidate CloudFront cache
```bash
aws cloudfront create-invalidation \
  --distribution-id ${CLOUDFRONT_ID} \
  --paths "/*"
```

### Issue: Build fails with "VITE_GEMINI_API_KEY not found"

**Solution**: Ensure environment variable is set
```bash
export VITE_GEMINI_API_KEY=your_key_here
pnpm run build
```

## Monitoring and Maintenance

### Monitor CloudFront Performance

```bash
# Get CloudFront statistics
aws cloudfront get-distribution-statistics \
  --distribution-id ${CLOUDFRONT_ID}
```

### View S3 Bucket Size

```bash
aws s3 ls s3://${S3_BUCKET} --recursive --summarize
```

### Clean Up Old Deployments

```bash
# Delete old CloudFormation stack
aws cloudformation delete-stack \
  --stack-name ${STACK_NAME} \
  --region ${AWS_REGION}

# Wait for deletion
aws cloudformation wait stack-delete-complete \
  --stack-name ${STACK_NAME} \
  --region ${AWS_REGION}
```

### Cost Optimization

1. **Enable S3 Versioning** (already enabled in template)
2. **Set S3 Lifecycle Policies** for old versions
3. **Monitor CloudFront Usage** in AWS Console
4. **Use CloudFront Caching** effectively

## Support and Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [AWS CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [React Deployment Guide](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/deploy-a-react-based-single-page-application-to-amazon-s3-and-cloudfront.html)

## Next Steps

1. ✅ Set up AWS account and IAM user
2. ✅ Configure AWS CLI
3. ✅ Deploy infrastructure using CloudFormation
4. ✅ Upload application files to S3
5. ✅ Test CloudFront distribution
6. ✅ Set up custom domain (optional)
7. ✅ Configure monitoring and alerts
