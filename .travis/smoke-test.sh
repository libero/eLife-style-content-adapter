#!/bin/bash
set -e

function finish {
    docker-compose logs
    docker-compose down --volumes
}

trap finish EXIT

docker-compose up -d
.scripts/docker/wait-healthy.sh elifestylecontentadapterprototype_airflow_webserver_1 60
.scripts/docker/wait-healthy.sh elifestylecontentadapterprototype_airflow_scheduler_1 60
