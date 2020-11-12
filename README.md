# Email Sender Project
Email sender project using nodemailer, Ejs and AWS-sdk libraries

## Running tests         
    yarn test

## Required necessary envs in AWS
    // Application
    LOG_LEVEL
    
    // AWS
    AWS_SQS_QUEUE_URL
    
    // Email
    EMAIL_HOST
    EMAIL_PORT
    EMAIL_SECURE
    EMAIL_TLS
    EMAIL_TLS_REJECT_UNAUTHORIZED
    EMAIL_USER
    EMAIL_USER_PASS
    EMAIL_RETRIES // o padrão é 3
    
## Methods
### ENVIANDO_EMAIL
#### Request usando template da AWS
    {
        "from": "test@test.com",
        "to": "test1@test.com",
        "cc": "test1@test.com,test2@test.com",
        "subject": "This is a test",
        "attachements": [
        {
        
            "encoding": "base64",
            "contentType": "image/png",
            "content": qrcode,
            "href": qrcode,
            "filename": "qrcode.png",
            "cid": "qrcodeimgsrc"
        }
        ],
        "template": {
            "name": "aws.template.ejs",
            "source": "AWS",
            "bucketName": "bucket.test"
        },
        "renderData": {
            "name": "Data test"
        },
        "options": {
            "withSaiposLogo": true,
            "withSignature": true,
            "customEmail": true
        }
    }
    
#### Request Body usando template LOCAL
    {
        "from": "test@test.com",
        "to": "test1@test.com",
        "cc": "test1@test.com,test2@test.com",
        "subject": "This is a test",
        "attachements": [
        {
            "encoding": "base64",
            "contentType": "image/png",
            "content": qrcode,
            "href": qrcode,
            "filename": "qrcode.png",
            "cid": "qrcodeimgsrc"
        }
        ],
        "template": {
            "name": "aws.template.ejs",
            "source": "LOCAL"
        },
        "renderData": {
            "name": "Data test"
        },
        "options": {
            "withSaiposLogo": true,
            "withSignature": true,
            "customEmail": true
        }
    }
