# Email Sender Project
Email sender project using nodemailer, Ejs and AWS-sdk libraries

## Running tests         
    ```yarn test```

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
    
## Apis
    POST /email/send
    Request Body usando template da AWS
    ```
    {
        "from": "test@test.com",
        "to": "test1@test.com",
        "cc": "test1@test.com,test2@test.com",
        "subject": "This is a test",
        "template": {
            "name": "aws.template.ejs",
            "source": "AWS",
            "bucketName": "bucket.test"
        },
        "renderData": {
            "name": "Data test"
        }
    }
    ```
    
    Request Body usando template LOCAL
    ```
    {
        "name": "Test",
        "from": "test@test.com",
        "to": "test1@test.com",
        "subject": "This is a test",
        "template": {
            "name": "local.template.ejs",
            "source": "LOCAL",
            "bucketName": ""
        }
    }
    ```
