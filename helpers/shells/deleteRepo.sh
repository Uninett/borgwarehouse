#!/usr/bin/env bash

# Shell created by Raven for BorgWarehouse.
# This shell takes 1 arg : [repositoryName] with 8 char. length only.
# This shell **delete the repository** in arg and **all his data** and the line associated in the authorized_keys file.

# DISABLED (until authentiation is improved) 2024-01-30 Otto J Wittner
if [ "$1" != "add-reponame-to-delete-here" ]; then
#if [ "$1" != "20ce5d38" ]; then
    echo -n "This feature is disabled"; exit 2
fi
# Exit when any command fails
set -e

# Load .env if exists
if [[ -f .env ]]; then
    source .env
fi

# Default value if .env not exists
: "${home:=/home/borgwarehouse}"

# Some variables
pool="${home}/repos"
authorized_keys="${home}/.ssh/authorized_keys"

# Check arg
#if [[ $# -ne 1 || $1 = "" ]]; then
if [[ $# -lt 1 || $1 = "" ]]; then
    echo -n "You must provide a repositoryName in argument."
    exit 1
fi

# Check if the repositoryName length is 8 char. With createRepo.sh our randoms have a length of 8 characters.
# If we receive another length there is necessarily a problem.
repositoryName=$1
if [ ${#repositoryName} != 8 ]; then
    echo -n "Error with the length of the repositoryName."
    exit 2
fi

# Delete the repository and the line associated in the authorized_keys file
if [ -d "${pool}/${repositoryName}" ]; then
        # Delete the repository
        rm -rf """${pool}""/""${repositoryName:?}"""
        # Delete the line in the authorized_keys file
        sed -i "/${repositoryName}/d" "${authorized_keys}"
        echo -n "The folder ""${pool}"/"${repositoryName}"" and all its data have been deleted. The line associated in the authorized_keys file has been deleted."
else
        # Delete the line in the authorized_keys file
        sed -i "/${repositoryName}/d" "${authorized_keys}"
        echo -n "The folder ""${pool}"/"${repositoryName}"" did not exist (repository never initialized or used). The line associated in the authorized_keys file has been deleted."
fi

HOSTNAME=$2
# Clean up firewall if client hostname is given
if [ "$HOSTNAME" ]; then
    RULENUMS=$(sudo ufw status numbered | grep "SSH from $HOSTNAME" | cut -f2 -d "[" | cut -f1 -d"]" | sort -nr)
    for r in $RULENUMS; do
	UFW_CMD="$UFW_CMD sudo ufw --force delete $r; "
    done
    # Run ufw command
    { bash -c "$UFW_CMD" >/dev/null ; } 2>&1 
fi

