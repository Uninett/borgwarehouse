//Lib
import React from 'react';
import classes from '../WizardStep1/WizardStep1.module.css';
import { IconWand } from '@tabler/icons-react';
import CopyButton from '../../UI/CopyButton/CopyButton';
import lanCommandOption from '../../../helpers/functions/lanCommandOption';

function WizardStep4(props) {
    ////Vars
    const wizardEnv = props.wizardEnv;
    const UNIX_USER = wizardEnv.UNIX_USER;
    //Needed to generate command for borg over LAN instead of WAN if env vars are set and option enabled.
    const { FQDN, SSH_SERVER_PORT } = lanCommandOption(
        wizardEnv,
        props.selectedOption.lanCommand
    );

    const configBorgmatic = `
#
# Note: This config only apply selecte features of borgmatic
#       Run 'generate-borgmatic-config --destination /tmp/config.yaml'
#       to create a template config file with full documentation
#
location:
    # List of source directories to backup.
    source_directories:
        - /etc
        #- /another/folder-to-backup

    repositories:
        # Paths of local or remote repositories to backup to.
        - ssh://${UNIX_USER}@${FQDN}:${SSH_SERVER_PORT}/./${props.selectedOption.repositoryName}

    # Run 'borg help patterns' for info about patterns
    exclude_patterns:
        - ~/*/.cache
        # - another/pattern-to-exclude
        

storage:
    archive_name_format: '{fqdn}-backup-{now}'
    # Apply repo-key or create one if none-existent
    # Key is avaiLable in /etc/borgmatic/${props.selectedOption.repositoryName}-repo.key
    encryption_passcommand: >
        /bin/bash -c "if [ -f /etc/borgmatic/${props.selectedOption.repositoryName}-repo.key ]; then
           cat /etc/borgmatic/${props.selectedOption.repositoryName}-repo.key;
        else
           pwgen 40 1 | tee /etc/borgmatic/${props.selectedOption.repositoryName}-repo.key;
           chmod 400 /etc/borgmatic/${props.selectedOption.repositoryName}-repo.key;
        fi"

    ssh_command: ssh -4 -i /root/.ssh/id_rsa

retention:
    # Retention policy for how many backups to keep.
    keep_daily: 7
    keep_weekly: 4
    keep_monthly: 6
    prefix: '{fqdn}-backup-'

consistency:
    # List of checks to run to validate your backups.
    checks:
        - repository
        - archives
    prefix: '{fqdn}-backup-'
`;

    return (
        <div className={classes.container}>
            <h1>
                <IconWand className={classes.icon} />
                Automate your backup
            </h1>
            <div className={classes.description}>
                The official borgbackup project provides a script in its
                documentation&nbsp;
                <a
                    href='https://borgbackup.readthedocs.io/en/stable/quickstart.html#automating-backups'
                    rel='noreferrer'
                    target='_blank'
                >
                    right here
                </a>
                .
            </div>

            <div className={classes.separator} />
            <h2>Vorta</h2>
            <div className={classes.description}>
                If you are using the Vorta graphical client, please refer
                to&nbsp;
                <a
                    href='https://vorta.borgbase.com/usage/#scheduling-automatic-backups'
                    rel='noreferrer'
                    target='_blank'
                >
                    this documentation
                </a>
                .
            </div>

            <h2>Borgmatic</h2>
            <div className={classes.description}>
                If you are using Borgmatic, <b>adapt</b> and copy the yaml document below into&nbsp;
		<i>/etc/borgmatic/config.yaml</i> and select an&nbsp;
                <a
                    href='https://torsion.org/borgmatic/docs/how-to/set-up-backups/#autopilot'
                    rel='noreferrer'
                    target='_blank'
                >
                    automation alternatives&nbsp;
                </a> from the borgmatic documentation.
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}
            >
                <div className={classes.code}>{configBorgmatic}</div>
                <div
                    style={{
                        margin: '15px 0 auto 0',
                        display: 'flex',
                        alignContent: 'center',
                    }}
                >
                    <CopyButton dataToCopy={configBorgmatic} size={32} />
                </div>
            </div>
	    <div className={classes.description}>
		<b>Note</b> that the config file will create (and later apply) a secret repo-key which is stored in <i>/etc/borgmatic/{props.selectedOption.repositoryName}-repo.key</i>.
	    </div>
        </div>
    );
}

export default WizardStep4;
