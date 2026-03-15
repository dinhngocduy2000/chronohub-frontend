deploy-aws: 
	aws s3 sync ./dist/ s3://chronohub-frontend --delete 
invalidate-aws: 
	aws cloudfront create-invalidation  --distribution-id E1LUUO64247LSQ --paths "/index.html" "/assets/*" "/manifest.json"