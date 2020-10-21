# Email Sender Project
Email sender project using nodemailer, Ejs and AWS-sdk libraries

## Running tests         
    ```yarn test```

## Required necessary envs in AWS
    LOG_LEVEL
    EMAIL_HOST
    EMAIL_PORT
    EMAIL_SECURE
    EMAIL_TLS
    EMAIL_USER
    EMAIL_USER_PASS
    
## Apis
    POST /email/send
    Request Body usando template da AWS
    ```
    {
        "name": "Test",
        "from": "test@test.com",
        "to": "test1@test.com",
        "subject": "This is a test",
        "template": {
            "name": "aws.template.ejs",
            "source": "AWS",
            "bucketName": "bucket.test"
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
