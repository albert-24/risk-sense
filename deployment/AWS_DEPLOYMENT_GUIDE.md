# Deploy with AWS Keys - Step-by-Step Guide

## Step 1: Get Your AWS Keys

### Option A: Using AWS Console (Recommended for First-Time)

1. **Go to AWS Console**
   - Visit: https://console.aws.amazon.com
   - Sign in with your AWS account

2. **Create IAM User** (if you don't have one)
   - Go to: IAM → Users → Create User
   - Username: `sugarcane-app-deployer`
   - Check: "Provide user access to the AWS Management Console"
   - Click: Create User

3. **Attach Permissions**
   - Select the user you created
   - Click: "Add permissions" → "Attach policies directly"
   - Search and select:
     - `AmazonS3FullAccess`
     - `CloudFrontFullAccess`
     - `CloudFormationFullAccess`
   - Click: "Add permissions"

4. **Create Access Keys**
   - Go to: Security credentials tab
   - Click: "Create access key"
   - Select: "Command Line Interface (CLI)"
   - Check: "I understand..."
   - Click: "Create access key"
   - **SAVE THESE KEYS SECURELY:**
     - Access Key ID
     - Secret Access Key

### Option B: Using AWS CLI (If Already Installed)

```bash
# Create IAM user
aws iam create-user --user-name sugarcane-app-deployer

# Attach policies
aws iam attach-user-policy \
  --user-name sugarcane-app-deployer \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-user-policy \
  --user-name sugarcane-app-deployer \
  --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess

aws iam attach-user-policy \
  --user-name sugarcane-app-deployer \
  --policy-arn arn:aws:iam::aws:policy/CloudFormationFullAccess

# Create access keys
aws iam create-access-key --user-name sugarcane-app-deployer
```

## Step 2: Configure AWS CLI with Your Keys

### Option A: Interactive Configuration (Recommended)

```bash
# Run interactive setup
aws configure

# When prompted, enter:
# AWS Access Key ID: [paste your Access Key ID]
# AWS Secret Access Key: [paste your Secret Access Key]
# Default region name: us-east-1
# Default output format: json
```

### Option B: Manual Configuration

```bash
# Create/edit AWS credentials file
# On macOS/Linux:
nano ~/.aws/credentials

# On Windows:
notepad %USERPROFILE%\.aws\credentials
```

Add this content:
```
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```

Also create/edit config file:
```bash
# On macOS/Linux:
nano ~/.aws/config

# On Windows:
notepad %USERPROFILE%\.aws\config
```

Add this content:
```
[default]
region = us-east-1
output = json
```

### Option C: Environment Variables

```bash
# Set environment variables (temporary - only for current session)
export AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION=us-east-1

# On Windows (PowerShell):
$env:AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
$env:AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
$env:AWS_DEFAULT_REGION="us-east-1"
```

## Step 3: Verify AWS Configuration

```bash
# Test your AWS credentials
aws sts get-caller-identity

# Expected output:
# {
#     "UserId": "AIDAI...",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/sugarcane-app-deployer"
# }
```

If you see an error, your credentials are not configured correctly. Go back to Step 2.

## Step 4: Configure Environment Variables for Deployment

```bash
# Copy environment template
cp deployment/.env.example deployment/.env

# Edit with your values
nano deployment/.env
```

Update these values:
```env
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012  # From get-caller-identity output
ENVIRONMENT=production
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Step 5: Deploy Your Application

### Option A: Interactive Deployment (Recommended)

```bash
# Make script executable
chmod +x deployment/quick-start.sh

# Run interactive setup
./deployment/quick-start.sh

# Follow the prompts:
# 1. Enter AWS Region (default: us-east-1)
# 2. Enter Environment (production/staging/development)
# 3. Enter Gemini API Key
# 4. Choose custom domain (optional)
```

### Option B: Automated Deployment

```bash
# Make script executable
chmod +x deployment/deploy.sh

# Run deployment
./deployment/deploy.sh production us-east-1

# The script will:
# 1. Build your React app
# 2. Create CloudFormation stack
# 3. Upload files to S3
# 4. Invalidate CloudFront cache
# 5. Display deployment summary
```

## Step 6: Monitor Deployment Progress

```bash
# Watch CloudFormation stack creation
aws cloudformation describe-stacks \
  --stack-name sugarcane-app-production \
  --region us-east-1 \
  --query 'Stacks[0].StackStatus' \
  --output text

# Expected statuses:
# CREATE_IN_PROGRESS → CREATE_COMPLETE
```

## Step 7: Get Your CloudFront URL

```bash
# Retrieve CloudFront domain
aws cloudformation describe-stacks \
  --stack-name sugarcane-app-production \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
  --output text

# Output will be something like:
# d123456789.cloudfront.net
```

## Step 8: Test Your Deployment

```bash
# Test the URL
curl -I https://d123456789.cloudfront.net

# Open in browser
# https://d123456789.cloudfront.net
```

## Troubleshooting

### Error: "Unable to locate credentials"

**Solution**: Your AWS credentials are not configured. Go back to Step 2.

```bash
# Verify credentials file exists
cat ~/.aws/credentials  # macOS/Linux
type %USERPROFILE%\.aws\credentials  # Windows
```

### Error: "User: arn:aws:iam::... is not authorized"

**Solution**: Your IAM user doesn't have the required permissions.

```bash
# Verify policies are attached
aws iam list-attached-user-policies --user-name sugarcane-app-deployer
```

### Error: "Access Denied" when uploading to S3

**Solution**: Check S3 permissions

```bash
# Test S3 access
aws s3 ls

# Should list your S3 buckets
```

### Error: "Stack already exists"

**Solution**: Use a different stack name or delete the existing stack

```bash
# Delete existing stack
aws cloudformation delete-stack \
  --stack-name sugarcane-app-production \
  --region us-east-1

# Wait for deletion
aws cloudformation wait stack-delete-complete \
  --stack-name sugarcane-app-production \
  --region us-east-1
```

## Security Best Practices

### ✅ DO:
- Store AWS keys in `~/.aws/credentials` (not in code)
- Use IAM users instead of root account
- Rotate access keys regularly
- Use environment variables for CI/CD
- Enable MFA on AWS account

### ❌ DON'T:
- Commit AWS keys to Git
- Share AWS keys via email
- Use root account credentials
- Store keys in plain text files
- Hardcode keys in application code

## Next Steps

1. ✅ Get AWS keys from AWS Console
2. ✅ Configure AWS CLI with your keys
3. ✅ Verify configuration with `aws sts get-caller-identity`
4. ✅ Update `deployment/.env` with your settings
5. ✅ Run `./deployment/quick-start.sh`
6. ✅ Test your deployment at the CloudFront URL

## Support

If you encounter issues:

1. Check: `deployment/DEPLOYMENT_GUIDE.md` (Troubleshooting section)
2. Verify: AWS credentials with `aws sts get-caller-identity`
3. Review: CloudFormation events in AWS Console
4. Check: CloudFront distribution status

---

**Version**: 1.0
**Last Updated**: December 2025
