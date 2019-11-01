#!/bin/sh

set -e

# Executable that waits for a port at an address to be open.
# For further details go to: https://github.com/ufoscout/docker-compose-wait
/wait

# copy single file to incoming bucket to quickly see results of dag
aws --endpoint-url http://s3:9000 s3 cp ./assets/biorxiv-685172.meca s3://dev-jats-ingester-incoming