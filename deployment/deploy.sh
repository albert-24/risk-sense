#!/bin/bash

# Sugarcane App Deployment Script
# Deploys React SPA to S3 and CloudFront

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
AWS_REGION=${2:-us-east-1}
STACK_NAME="sugarcane-app-${ENVIRONMENT}"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Sugarcane App Deployment Script${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "Environment: ${GREEN}${ENVIRONMENT}${NC}"
echo -e "AWS Region: ${GREEN}${AWS_REGION}${NC}"
echo -e "Stack Name: ${GREEN}${STACK_NAME}${NC}"

# Step 1: Build the React app
echo -e "\n${YELLOW}Step 1: Building React application...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completed successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Step 2: Check if CloudFormation stack exists
echo -e "\n${YELLOW}Step 2: Checking CloudFormation stack...${NC}"
STACK_EXISTS=$(aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --region "${AWS_REGION}" \
    --query 'Stacks[0].StackName' \
    --output text 2>/dev/null || echo "")

if [ -z "$STACK_EXISTS" ]; then
    echo -e "${YELLOW}Stack does not exist. Creating new stack...${NC}"
    aws cloudformation create-stack \
        --stack-name "${STACK_NAME}" \
        --template-body file://deployment/cloudformation-template.yaml \
        --parameters ParameterKey=EnvironmentName,ParameterValue="${ENVIRONMENT}" \
        --region "${AWS_REGION}" \
        --tags Key=Environment,Value="${ENVIRONMENT}" Key=Application,Value=SugarcaneApp
    
    echo -e "${YELLOW}Waiting for stack creation to complete...${NC}"
    aws cloudformation wait stack-create-complete \
        --stack-name "${STACK_NAME}" \
        --region "${AWS_REGION}"
    echo -e "${GREEN}✓ Stack created successfully${NC}"
else
    echo -e "${YELLOW}Stack exists. Updating stack...${NC}"
    aws cloudformation update-stack \
        --stack-name "${STACK_NAME}" \
        --template-body file://deployment/cloudformation-template.yaml \
        --parameters ParameterKey=EnvironmentName,ParameterValue="${ENVIRONMENT}" \
        --region "${AWS_REGION}" || echo "No updates to perform"
    
    echo -e "${YELLOW}Waiting for stack update to complete...${NC}"
    aws cloudformation wait stack-update-complete \
        --stack-name "${STACK_NAME}" \
        --region "${AWS_REGION}" || true
    echo -e "${GREEN}✓ Stack updated successfully${NC}"
fi

# Step 3: Get S3 bucket name and CloudFront distribution ID
echo -e "\n${YELLOW}Step 3: Retrieving deployment information...${NC}"
S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --region "${AWS_REGION}" \
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
    --output text)

CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --region "${AWS_REGION}" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --region "${AWS_REGION}" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
    --output text)

echo -e "S3 Bucket: ${GREEN}${S3_BUCKET}${NC}"
echo -e "CloudFront Distribution ID: ${GREEN}${CLOUDFRONT_ID}${NC}"
echo -e "CloudFront Domain: ${GREEN}${CLOUDFRONT_DOMAIN}${NC}"

# Step 4: Upload build files to S3
echo -e "\n${YELLOW}Step 4: Uploading build files to S3...${NC}"
aws s3 sync dist/ "s3://${S3_BUCKET}/" \
    --region "${AWS_REGION}" \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "index.html" \
    --exclude "*.map"

# Upload index.html with no-cache
aws s3 cp dist/index.html "s3://${S3_BUCKET}/index.html" \
    --region "${AWS_REGION}" \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html"

echo -e "${GREEN}✓ Files uploaded to S3${NC}"

# Step 5: Invalidate CloudFront cache
echo -e "\n${YELLOW}Step 5: Invalidating CloudFront cache...${NC}"
aws cloudfront create-invalidation \
    --distribution-id "${CLOUDFRONT_ID}" \
    --paths "/*" \
    --region "${AWS_REGION}"

echo -e "${GREEN}✓ CloudFront cache invalidated${NC}"

# Step 6: Display deployment summary
echo -e "\n${YELLOW}========================================${NC}"
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "\nDeployment Summary:"
echo -e "  Environment: ${GREEN}${ENVIRONMENT}${NC}"
echo -e "  S3 Bucket: ${GREEN}${S3_BUCKET}${NC}"
echo -e "  CloudFront URL: ${GREEN}https://${CLOUDFRONT_DOMAIN}${NC}"
echo -e "  Distribution ID: ${GREEN}${CLOUDFRONT_ID}${NC}"
echo -e "\nYour application is now live!"
echo -e "It may take a few minutes for CloudFront to propagate globally."
