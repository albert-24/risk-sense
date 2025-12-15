# Deployment Checklist

Use this checklist to ensure all steps are completed before deploying to production.

## Pre-Deployment

### AWS Account Setup
- [ ] AWS account created
- [ ] IAM user created with programmatic access
- [ ] IAM policies attached:
  - [ ] AmazonS3FullAccess
  - [ ] CloudFrontFullAccess
  - [ ] CloudFormationFullAccess
- [ ] AWS CLI installed (v2+)
- [ ] AWS CLI configured with credentials
- [ ] AWS credentials verified: `aws sts get-caller-identity`

### Local Environment
- [ ] Node.js v18+ installed: `node --version`
- [ ] pnpm v10+ installed: `pnpm --version`
- [ ] Repository cloned locally
- [ ] Dependencies installed: `pnpm install`
- [ ] Environment variables configured
- [ ] Gemini API key obtained and stored securely

### Application Readiness
- [ ] Code reviewed and tested
- [ ] All tests passing: `pnpm run test`
- [ ] Linting passes: `pnpm run lint`
- [ ] Build succeeds locally: `pnpm run build`
- [ ] dist/ folder generated with all files
- [ ] No console errors or warnings
- [ ] Environment variables set correctly

## Deployment Configuration

### Environment Variables
- [ ] `.env` file created from `.env.example`
- [ ] AWS_REGION set correctly
- [ ] ENVIRONMENT set to target environment
- [ ] VITE_GEMINI_API_KEY configured
- [ ] VITE_API_BASE_URL set (if applicable)
- [ ] No sensitive data in version control

### AWS Configuration
- [ ] AWS region selected (default: us-east-1)
- [ ] Stack name defined
- [ ] S3 bucket naming convention decided
- [ ] CloudFront distribution name decided
- [ ] Custom domain configured (if applicable)
- [ ] ACM certificate created (if using custom domain)

## Deployment Execution

### Infrastructure Setup
- [ ] CloudFormation template reviewed
- [ ] CloudFormation stack created successfully
- [ ] S3 bucket created and verified
- [ ] CloudFront distribution created
- [ ] Origin Access Identity configured
- [ ] Bucket policy applied correctly

### File Upload
- [ ] Build files ready in dist/
- [ ] Static assets uploaded to S3
- [ ] index.html uploaded with no-cache headers
- [ ] File permissions verified
- [ ] S3 bucket contents verified

### CloudFront Configuration
- [ ] CloudFront distribution enabled
- [ ] Cache behaviors configured correctly
- [ ] Error responses configured (404 → index.html)
- [ ] HTTPS enforced
- [ ] Compression enabled
- [ ] Cache invalidation completed

## Post-Deployment

### Verification
- [ ] CloudFront URL accessible
- [ ] Application loads without errors
- [ ] All pages accessible
- [ ] Navigation works correctly
- [ ] API calls functioning
- [ ] PDF generation working
- [ ] No console errors in browser

### Testing
- [ ] Test on desktop browser
- [ ] Test on mobile browser
- [ ] Test on tablet
- [ ] Test with slow network (DevTools)
- [ ] Test with offline mode
- [ ] Test all features:
  - [ ] Chat functionality
  - [ ] Map display
  - [ ] PDF generation
  - [ ] File downloads

### Performance
- [ ] Page load time acceptable (<3s)
- [ ] CloudFront cache working (check headers)
- [ ] Static assets cached properly
- [ ] No unnecessary requests
- [ ] Compression enabled

### Security
- [ ] HTTPS enforced
- [ ] S3 bucket private (no public access)
- [ ] CloudFront OAI configured
- [ ] No sensitive data exposed
- [ ] API keys not visible in frontend
- [ ] CORS configured correctly

## Monitoring Setup

### CloudWatch
- [ ] CloudFront metrics enabled
- [ ] S3 metrics enabled
- [ ] Alarms configured:
  - [ ] High error rate (>1%)
  - [ ] Slow response times
  - [ ] Unusual traffic patterns

### Logging
- [ ] CloudFront logging enabled
- [ ] S3 access logging enabled
- [ ] Logs stored in separate bucket
- [ ] Log retention policy set

### Notifications
- [ ] Slack webhook configured (optional)
- [ ] Email alerts configured
- [ ] On-call rotation established

## Documentation

### Deployment Records
- [ ] Deployment date recorded
- [ ] Deployed version/commit noted
- [ ] Deployment time recorded
- [ ] Deployed by (person) recorded
- [ ] Any issues encountered documented

### Runbooks
- [ ] Deployment runbook created
- [ ] Rollback procedure documented
- [ ] Troubleshooting guide available
- [ ] Emergency contacts listed
- [ ] Escalation procedures defined

## GitHub Actions Setup (Optional)

### Repository Configuration
- [ ] GitHub repository created
- [ ] Deployment files committed
- [ ] `.github/workflows/deploy.yml` added
- [ ] Branch protection rules configured
- [ ] Required status checks enabled

### Secrets Configuration
- [ ] AWS_ROLE_ARN added to secrets
- [ ] VITE_GEMINI_API_KEY added to secrets
- [ ] SLACK_WEBHOOK added to secrets (optional)
- [ ] Secrets verified (not exposed in logs)

### Workflow Testing
- [ ] Workflow file syntax valid
- [ ] Test deployment from develop branch
- [ ] Test deployment from staging branch
- [ ] Test deployment from main branch
- [ ] Workflow logs reviewed for errors

## Custom Domain Setup (If Applicable)

### DNS Configuration
- [ ] Domain registered
- [ ] ACM certificate requested
- [ ] Certificate validated
- [ ] Certificate ARN noted
- [ ] CloudFormation updated with certificate
- [ ] DNS records created:
  - [ ] CNAME record pointing to CloudFront
  - [ ] DNS propagation verified

### HTTPS Configuration
- [ ] SSL/TLS certificate installed
- [ ] HTTPS enforced
- [ ] HTTP redirects to HTTPS
- [ ] Certificate renewal automated
- [ ] Certificate expiration monitored

## Rollback Preparation

### Backup & Recovery
- [ ] Previous version backed up
- [ ] S3 versioning enabled
- [ ] Rollback procedure tested
- [ ] Recovery time objective (RTO) defined
- [ ] Recovery point objective (RPO) defined

### Disaster Recovery
- [ ] Disaster recovery plan created
- [ ] Backup locations documented
- [ ] Recovery procedures tested
- [ ] Team trained on recovery
- [ ] Regular DR drills scheduled

## Sign-Off

### Stakeholder Approval
- [ ] Product owner approved
- [ ] Security team approved
- [ ] Operations team approved
- [ ] Development team approved

### Final Verification
- [ ] All checklist items completed
- [ ] No outstanding issues
- [ ] Documentation complete
- [ ] Team notified of deployment
- [ ] Monitoring active

### Deployment Approval
- [ ] Deployment authorized by: ________________
- [ ] Date: ________________
- [ ] Time: ________________
- [ ] Notes: ________________

## Post-Deployment Monitoring (First 24 Hours)

- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Monitor traffic patterns
- [ ] Check user feedback
- [ ] Review CloudFront logs
- [ ] Review S3 access logs
- [ ] Verify all features working
- [ ] Check for any issues reported

## Success Criteria

✅ Deployment is successful when:
- [ ] Application is accessible via CloudFront URL
- [ ] All features working as expected
- [ ] No errors in browser console
- [ ] Performance metrics acceptable
- [ ] Security checks passed
- [ ] Monitoring and alerts active
- [ ] Team notified and ready to support

---

## Notes

Use this space for any additional notes or observations:

```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

## Deployment History

| Date | Environment | Version | Deployed By | Status | Notes |
|------|-------------|---------|-------------|--------|-------|
| | | | | | |
| | | | | | |
| | | | | | |

---

**Checklist Version**: 1.0
**Last Updated**: December 2025
**Next Review**: [Date]
