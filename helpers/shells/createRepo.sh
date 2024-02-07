#!/usr/bin/env bash

# Shell created by Raven for BorgWarehouse.
# This shell takes 2 arguments : [SSH pub key] X [quota]
# Main steps are :
# - check if args are present
# - check the ssh pub key format
# - check if the ssh pub key is already present in authorized_keys
# - check if borgbackup package is install
# - generate a random repositoryName
# - add the SSH public key in the authorized_keys with borg restriction for repository and storage quota.
# This simple method prevents the user from connecting to the server with a shell in SSH.
# He can only use the borg command. Moreover, he will not be able to leave his repository or create a new one.
# It is similar to a jail and that is the goal.

# Limitation : all SSH pubkey are unique : https://github.com/borgbackup/borg/issues/7757

# Change log:
#  2024-01-31 Otto J Wittner: Added firewall management via "ufw"

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

# Check args
if [ "$1" == "" ] || [ "$2" == "" ];then
#    echo -n "This shell takes 2 arguments : SSH Public Key, Quota in Go [e.g. : 10] "
    echo -n "This shell takes at least 2 arguments : SSH Public Key, Quota in Go [e.g. : 10]. Client FQDN may set a arg no 3 [e.g. my.domain.org ]. "
    exit 1
fi

# Check if the SSH public key is a valid format
# This pattern validates SSH public keys for : rsa, ed25519, ed25519-sk
pattern='(ssh-ed25519 AAAAC3NzaC1lZDI1NTE5|sk-ssh-ed25519@openssh.com AAAAGnNrLXNzaC1lZDI1NTE5QG9wZW5zc2guY29t|ssh-rsa AAAAB3NzaC1yc2)[0-9A-Za-z+/]+[=]{0,3}(\s.*)?'
if [[ ! "$1" =~ $pattern ]]
then
    echo -n "Invalid public SSH KEY format. Provide a key in OpenSSH format (rsa, ed25519, ed25519-sk)"
    exit 2
fi

# Check if SSH pub key is already present in authorized_keys
if grep -q "$1" "$authorized_keys"; then
    echo -n "SSH pub key already present in authorized_keys"
    exit 3
fi

# Check if borgbackup is installed
if ! [ -x "$(command -v borg)" ]; then
  echo -n "You must install borgbackup package."
  exit 4
fi

# Generation of a random for repositoryName
randRepositoryName () {
    openssl rand -hex 4
}
repositoryName=$(randRepositoryName)

## Check if authorized_keys exists
if [ ! -f "${authorized_keys}" ];then
    echo -n "${authorized_keys} must be present"
    exit 5
fi

## Add ssh public key in authorized_keys with borg restriction for only 1 repository and storage quota
restricted_authkeys="command=\"cd ${pool};borg serve --append-only --restrict-to-path ${pool}/${repositoryName} --storage-quota $2G\",restrict $1"
echo "$restricted_authkeys" | tee -a "${authorized_keys}" >/dev/null

## If FQDN is given, attempte to add firewall rule
HOSTNAME=$3
if [ "$HOSTNAME" ]; then
    RULENUMS=$(sudo ufw status numbered | grep "SSH from $HOSTNAME" | cut -f2 -d "[" | cut -f1 -d"]" | sort -nr)
    if [ -z "$RULENUMS" ]; then
	# No firewall rules found for host. Proceed with adding.
	
	# Get IP addresses
	IP4=$(host "$HOSTNAME" | grep "has address" | awk '{ print $4 }')  
	IP6=$(host "$HOSTNAME" | grep "has IPv6 address" | awk '{ print $5 }')  
	
	if [ "$IP4" ]; then
	    # Add allow statement
	    UFW_CMD="$UFW_CMD sudo ufw allow proto tcp from $IP4 to any port 22 comment 'SSH from $HOSTNAME'; "
	fi		  
	if [ "$IP6" ]; then
	    # Add allow statement
	    UFW_CMD="$UFW_CMD sudo ufw allow proto tcp from $IP6 to any port 22 comment 'SSH from $HOSTNAME'"
	fi		  
	#T=$(date -Iseconds); echo "$T Running: $UFW_CMD" >> /tmp/bw.log
	# Run ufw command
	{ bash -c "$UFW_CMD" >/dev/null ; } 2>&1
    fi    
fi

## Return the repositoryName
echo "${repositoryName}"
