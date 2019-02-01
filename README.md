<!--
title: 'AWS Serverless meraki Webhook Listener example in NodeJS'
description: 'This service will listen to Cisco Meraki webhooks fired by alerts defined on the Meraki platform'
layout: Doc
framework: v1
platform: AWS
language: nodeJS
authorLink: 'https://github.com/gjyoung1974'
authorName: 'Gordon Young'
authorAvatar: ''
-->
# Serverless Cisco Meraki Webhook listener

This service will listen to meraki webhooks fired by a given repository.

## Use Cases

* Custom Meraki notifications to AWS:CloudTrail
* etc.

## How it works

```
┌───────────────┐               ┌───────────┐
│               │               │           │
│  meraki event │               │   Meraki  │
│   alert, etc. │────Trigger───▶│  Webhook  │
│               │               │           │
└───────────────┘               └───────────┘
                                      │
                     ┌────POST────────┘
                     │
          ┌──────────▼─────────┐
          │ ┌────────────────┐ │
          │ │  API Gateway   │ │
          │ │    Endpoint    │ │
          │ └────────────────┘ │
          └─────────┬──────────┘
                    │
                    │
         ┌──────────▼──────────┐
         │ ┌────────────────┐  │
         │ │                │  │
         │ │     Lambda     │  │
         │ │    Function()  │  │
         │ │                │  │
         │ └────────────────┘  │
         └─────────────────────┘
                    │
                    │
                    ▼
         ┌────────────────────┐
         │                    │
         │      CloudTrail    │
         │          Etc.      │
         └────────────────────┘
```

## Setup

1. Set your webhook secret token in `serverless.yml` by replacing `REPLACE-WITH-YOUR-SECRET-HERE` in the environment variables `MERAKI_WEBHOOK_SECRET`.

  ```yml
  provider:
    name: aws
    runtime: nodejs8.10
    environment:
      MERAKI_WEBHOOK_SECRET: REPLACE-WITH-YOUR-SECRET-HERE
  ```

2. Deploy the service

Using [Serverless](https://serverless.com/)    

  ```yaml
  serverless deploy
  ```

  After the deploy has finished you should see something like:    
  
  ```sh
  Service Information
  service: meraki-webhook-listener
  stage: dev
  region: us-east-1
  api keys:
    None
  endpoints:
    POST - https://abcdefg.execute-api.us-east-1.amazonaws.com/dev/webhook
  functions:
    meraki-webhook-.....meraki-webhook-listener-dev-merakiWebhookListener
  ```

3. Configure your webhook in your meraki org settings. [Setting up a Webhook](https://documentation.meraki.com/zGeneral_Administration/Other_Topics/Webhooks)

  **(1.)** Plugin your API POST endpoint. (`https://abcdefg.execute-api.us-east-1.amazonaws.com/dev/webhook` in this example). Run `sls info` to grab your endpoint if you don't have it handy.

  **(2.)** Plugin your secret from `MERAKI_WEBHOOK_SECRET` environment variable

  **(3.)** Choose the types of events you want the meraki webhook to fire on

  ![webhook-steps](https://example.com/TODO).    


  You should see the event from meraki in the lambda functions logs.

**(4.)** Use your imagination and do whatever you need/want with the Meraki webhook listener! 🎉

