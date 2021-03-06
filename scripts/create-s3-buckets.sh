#!/bin/sh

set -e

# Executable that waits for a port at an address to be open.
# For further details go to: https://github.com/ufoscout/docker-compose-wait
/wait

# create s3 buckets
aws --endpoint-url http://s3:9000 s3 mb s3://dev-jats-ingester-incoming
aws --endpoint-url http://s3:9000 s3 mb s3://dev-jats-ingester-expanded
aws --endpoint-url http://s3:9000 s3 mb s3://dev-jats-ingester-completed-tasks
aws --endpoint-url http://s3:9000 s3 mb s3://dev-jats-ingester-logs
