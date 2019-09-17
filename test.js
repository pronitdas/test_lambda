const aws = require('aws-sdk')
const s3 = new aws.S3()
const path = require('path')

const outputBucket = process.env.OUTPUT_BUCKET

exports.replicate = function main(event, context) {
  // Fail on mising data
  if (!outputBucket) {
    context.fail('Error: Environment variable OUTPUT_BUCKET missing')
    return
  }
  if (event.Records === null) {
    context.fail('Error: Event has no records.')
    return
  }

  let tasks = []
  for (let i = 0; i < event.Records.length; i++) {
    tasks.push(replicatePromise(event.Records[i], outputBucket))
  }

  Promise.all(tasks)
    .then(() => { context.succeed() })
    .catch(() => { context.fail() })
}
