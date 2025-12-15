#!/bin/bash

# Quick Start Deployment Script
# This script guides you through the deployment process step by step

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed"
        return 1
    fi
    print_success "$1 is installed"
    return 0
}

# Main script
print_header "Sugarcane App - Quick Start Deployment"

# Step 1: Check prerequisites
print_header "Step 1: Checking Prerequisites"

check_command "aws" || exit 1
check_command "node" || exit 1
check_command "pnpm" || exit 1

# Step 2: Get user input
print_header "Step 2: Configuration"

read -p "Enter AWS Region (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

read -p "Enter Environment (development/staging/production, default: production): " ENVIRONMENT
ENVIRONMENT=${ENVIRONMENT:-production}

read -p "Enter Gemini API Key: " GEMINI_API_KEY

read -p "Use custom domain? (y/n, default: n): " USE_CUSTOM_DOMAIN
if [[ $USE_CUSTOM_DOMAIN == "y" ]]; then
    read -p "Enter custom domain: " CUSTOM_DOMAIN
    read -p "Enter ACM Certificate ARN: " CERT_ARN
fi

# Step 3: Verify AWS credentials
print_header "Step 3: Verifying AWS Credentials"

if aws sts get-caller-identity &> /dev/null; then
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    print_success "AWS credentials verified (Account: $ACCOUNT_ID)"
else
    print_error "AWS credentials not configured"
    echo "Run: aws configure"
    exit 1
fi

# Step 4: Build application
print_header "Step 4: Building Application"

print_info "Installing dependencies..."
pnpm install

print_info "Building for production..."
VITE_GEMINI_API_KEY=$GEMINI_API_KEY pnpm run build

if [ -d "dist" ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Step 5: Create CloudFormation stack
print_header "Step 5: Creating AWS Infrastructure"

STACK_NAME="sugarcane-app-${ENVIRONMENT}"

print_info "Creating CloudFormation stack: $STACK_NAME"

if [ -n "$CUSTOM_DOMAIN" ]; then
    aws cloudformation create-stack \
        --stack-name ${STACK_NAME} \
        --template-body file://deployment/cloudformation-template.yaml \
        --parameters \
            ParameterKey=EnvironmentName,ParameterValue=${ENVIRONMENT} \
            ParameterKey=DomainName,ParameterValue=${CUSTOM_DOMAIN} \
            ParameterKey=CertificateArn,ParameterValue=${CERT_ARN} \
        --region ${AWS_REGION} \
        --tags Key=Environment,Value=${ENVIRONMENT} Key=Application,Value=SugarcaneApp
else
    aws cloudformation create-stack \
        --stack-name ${STACK_NAME} \
        --template-body file://deployment/cloudformation-template.yaml \
        --parameters ParameterKey=EnvironmentName,ParameterValue=${ENVIRONMENT} \
        --region ${AWS_REGION} \
        --tags Key=Environment,Value=${ENVIRONMENT} Key=Application,Value=SugarcaneApp
fi

print_info "Waiting for stack creation (this may take 5-10 minutes)..."
aws cloudformation wait stack-create-complete \
    --stack-name ${STACK_NAME} \
    --region ${AWS_REGION}

print_success "CloudFormation stack created"

# Step 6: Get stack outputs
print_header "Step 6: Retrieving Deployment Information"

S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${AWS_REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
    --output text)

CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${AWS_REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${AWS_REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
    --output text)

print_success "S3 Bucket: $S3_BUCKET"
print_success "CloudFront Distribution ID: $CLOUDFRONT_ID"
print_success "CloudFront Domain: $CLOUDFRONT_DOMAIN"

# Step 7: Upload files to S3
print_header "Step 7: Uploading Files to S3"

print_info "Uploading static assets..."
aws s3 sync dist/ s3://${S3_BUCKET}/ \
    --region ${AWS_REGION} \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "index.html" \
    --exclude "*.map"

print_info "Uploading index.html..."
aws s3 cp dist/index.html s3://${S3_BUCKET}/index.html \
    --region ${AWS_REGION} \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html"

print_success "Files uploaded to S3"

# Step 8: Invalidate CloudFront cache
print_header "Step 8: Invalidating CloudFront Cache"

aws cloudfront create-invalidation \
    --distribution-id ${CLOUDFRONT_ID} \
    --paths "/*" \
    --region ${AWS_REGION}

print_success "CloudFront cache invalidated"

# Step 9: Display summary
print_header "Deployment Complete!"

echo -e "${GREEN}Your application is now live!${NC}\n"
echo "Deployment Summary:"
echo "  Environment: ${GREEN}${ENVIRONMENT}${NC}"
echo "  AWS Region: ${GREEN}${AWS_REGION}${NC}"
echo "  S3 Bucket: ${GREEN}${S3_BUCKET}${NC}"
echo "  CloudFront URL: ${GREEN}https://${CLOUDFRONT_DOMAIN}${NC}"
echo "  Distribution ID: ${GREEN}${CLOUDFRONT_ID}${NC}"

if [ -n "$CUSTOM_DOMAIN" ]; then
    echo "  Custom Domain: ${GREEN}${CUSTOM_DOMAIN}${NC}"
fi

echo -e "\n${YELLOW}Note: It may take a few minutes for CloudFront to propagate globally.${NC}"
echo -e "\nNext steps:"
echo "  1. Visit: https://${CLOUDFRONT_DOMAIN}"
echo "  2. Test the application"
echo "  3. Set up monitoring and alerts in AWS Console"

if [ -n "$CUSTOM_DOMAIN" ]; then
    echo "  4. Update DNS records to point to CloudFront"
fi

echo -e "\nFor more information, see: deployment/DEPLOYMENT_GUIDE.md"
