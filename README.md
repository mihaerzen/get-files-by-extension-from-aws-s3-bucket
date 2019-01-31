# Get files by extensions from aws s3 bucket

## How does it work?

1. It fetches a batch of 1000 items from the S3 bucket.
2. Filters out the items having the allowed file extension.
3. Writes the keys of the matching files to the stdout.

## How do I run it?

This script under the hood uses the javascript `aws-sdk`. For it to work you need
to have configured aws credentials.
Have a look here for more information: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html. 

Bash:
```bash
BUCKET='bucket-name' EXTENSIONS='csv,txt' node index.js
```

Fish (zsh):
```zsh
env BUCKET='bucket-name' EXTENSIONS='csv,txt' node index.js
```

`EXTENSIONS` env variable is optional. Don't define it and it will return all the files.

### Piping to a file

```bash
BUCKET='bucket-name' EXTENSIONS='csv,txt' node index.js > myfile.txt
```

Afterwards you can tail the fail to see the progress:
```bash
tail -f myfile.txt
```
