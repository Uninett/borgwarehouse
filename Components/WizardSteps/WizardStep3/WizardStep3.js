//Lib
import React from 'react';
import classes from '../WizardStep1/WizardStep1.module.css';
import { IconChecks, IconPlayerPlay } from '@tabler/icons-react';
import CopyButton from '../../UI/CopyButton/CopyButton';
import lanCommandOption from '../../../helpers/functions/lanCommandOption';

function WizardStep3(props) {
    ////Vars
    const wizardEnv = props.wizardEnv;
    const UNIX_USER = wizardEnv.UNIX_USER;
    //Needed to generate command for borg over LAN instead of WAN if env vars are set and option enabled.
    const { FQDN, SSH_SERVER_PORT } = lanCommandOption(
        wizardEnv,
        props.selectedOption.lanCommand
    );

    return (
        <div className={classes.container}>
            <h1>
                <IconPlayerPlay className={classes.icon} />
                Launch a backup
            </h1>
            <div className={classes.description}>
                To launch a backup with <b>borgmatic</b> just run:
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
                        borgmatic
                    </div>
                    <CopyButton
                        dataToCopy={`borgmatic`}
                    />
                </div>
            </div>
            <div className={classes.description}>
                To launch with <b>borg</b> adapt <i>/your/pathToBackup</i> and run:
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
                        BORG_PASSPHRASE=`cat /etc/borg/{props.selectedOption.repositoryName}-repo.key`
			borg create ssh://
                        {UNIX_USER}@{FQDN}:{SSH_SERVER_PORT}/./
                        {props.selectedOption.repositoryName}
                        ::{"{hostname}-{user}-{now}"} /your/pathToBackup
                    </div>
                    <CopyButton
                        dataToCopy={`BORG_PASSPHRASE=\`cat /etc/borg/${props.selectedOption.repositoryName}-repo.key\` borg create ssh://${UNIX_USER}@${FQDN}:${SSH_SERVER_PORT}/./${props.selectedOption.repositoryName}::\{hostname\}-\{user\}-\{now\} /your/pathToBackup`}
                    />
                </div>
            </div>
            <div className={classes.separator}></div>
            <h1>
                <IconChecks className={classes.icon} />
                Check your backup{' '}
                <span style={{ color: '#494b7a4d', fontWeight: 'normal' }}>
                    &nbsp;(always)
                </span>
            </h1>
            <div className={classes.description}>
                BorgWarehouse <b>only stores</b> your backups. They are
                encrypted and <b>there is no way</b> for BorgWarehouse to know
                if the backup is intact.
                <br />
                You should regularly test your backups and check that the data
                is recoverable.{' '}
                <b>
                    BorgWarehouse cannot do this for you and does not guarantee
                    anything.
                </b>
                <br />
            </div>

            <h2>Borgmatic</h2>
            <div className={classes.description}>
                When you are using Borgmatic, regular consistency checks can be specified in the config file. See {' '}
                <a
                    href='https://torsion.org/borgmatic/docs/how-to/deal-with-very-large-backups/#consistency-check-configuration'
                    rel='noreferrer'
                    target='_blank'
                >
                    full documentation on for checks.
                </a>
            </div>
            <br />
	    
            <li>Check the integrity of a repository with :</li>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}
            >
                <div className={classes.code}>
                    borgmatic check
                </div>
                <CopyButton
                    dataToCopy={`borgmatic check`}
                />
            </div>
            <li>List the remote archives with :</li>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}
            >
                <div className={classes.code}>
                    borgmatic list 
                </div>
                <CopyButton
                    dataToCopy={`borgmatic list`}
                />
            </div>
            <li>List all files in latest archive with :</li>
            <div
                style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
                        borgmatic list --archive latest
                    </div>
                    <CopyButton
                        dataToCopy={`borgmatic list --archive latest`}
                    />
            </div>
            <li>Download latest archive with the following command :</li>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}
            >
                <div className={classes.code}>
                    borgmatic extract --archive latest --destination /path/to/destination/folder
                </div>
                <CopyButton
                    dataToCopy={`borgmatic extract --archive latest --destination /path/to/destination/folder`}
                />
            </div>
	    <div className={classes.separator}></div>
	    <h2>Borg</h2>
            <span className={classes.description}>
                Based on the Borg documentation, you have multiple ways to check
                that your backups are correct with your tools (tar, rsync, diff
                or other tools).
                <br />
		
                <li>Check the integrity of a repository with :</li>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
			BORG_PASSPHRASE=`cat /etc/borg/{props.selectedOption.repositoryName}-repo.key`
                        borg check -v --progress ssh://
                        {UNIX_USER}@{FQDN}:{SSH_SERVER_PORT}/./
                        {props.selectedOption.repositoryName}
                    </div>
                    <CopyButton
                        dataToCopy={`BORG_PASSPHRASE=\`cat /etc/borg/${props.selectedOption.repositoryName}-repo.key\` borg check -v --progress ssh://${UNIX_USER}@${FQDN}:${SSH_SERVER_PORT}/./${props.selectedOption.repositoryName}`}
                    />
                </div>
                <li>List the remote archives with :</li>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
			BORG_PASSPHRASE=`cat /etc/borg/{props.selectedOption.repositoryName}-repo.key`
                        borg list ssh://
                        {UNIX_USER}@{FQDN}:{SSH_SERVER_PORT}/./
                        {props.selectedOption.repositoryName}
                    </div>
                    <CopyButton
                        dataToCopy={`BORG_PASSPHRASE=\`cat /etc/borg/${props.selectedOption.repositoryName}-repo.key\` borg list ssh://${UNIX_USER}@${FQDN}:${SSH_SERVER_PORT}/./${props.selectedOption.repositoryName}`}
                    />
                </div>
                <li>Download a remote archive (adapt 'archive-name') with the following command :</li>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
                        BORG_PASSPHRASE=`cat /etc/borg/{props.selectedOption.repositoryName}-repo.key`                                                                                
                        borg export-tar --tar-filter="gzip -9" ssh://
                        {UNIX_USER}@{FQDN}:{SSH_SERVER_PORT}/./
                        {props.selectedOption.repositoryName}
                        ::archive-name archive-name.tar.gz
                    </div>
                    <CopyButton
                        dataToCopy={`BORG_PASSPHRASE=\`cat /etc/borg/${props.selectedOption.repositoryName}-repo.key\` borg export-tar --tar-filter="gzip -9" ssh://${UNIX_USER}@${FQDN}:${SSH_SERVER_PORT}/./${props.selectedOption.repositoryName}::archive-name archive-name.tar.gz`}
                    />
                </div>
                <li>
                    Mount an archive (adapt 'archive-name') to compare or backup some files without
                    download all the archive :
                </li>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
			BORG_PASSPHRASE=`cat /etc/borg/{props.selectedOption.repositoryName}-repo.key`
                        borg mount ssh://
                        {UNIX_USER}@{FQDN}:{SSH_SERVER_PORT}/./
                        {props.selectedOption.repositoryName}
                        ::archive-name /tmp/yourMountPoint
                    </div>
                    <CopyButton
                        dataToCopy={`BORG_PASSPHRASE=\`cat /etc/borg/${props.selectedOption.repositoryName}-repo.key\` borg mount ssh://${UNIX_USER}@${FQDN}:${SSH_SERVER_PORT}/./${props.selectedOption.repositoryName}::archive-name /tmp/yourMountPoint`}
                    />
                </div>
                <br />
                To verify the consistency of a repository and the corresponding
                archives, please refer to{' '}
                <a
                    href='https://borgbackup.readthedocs.io/en/stable/usage/check.html'
                    rel='noreferrer'
                    target='_blank'
                >
                    this documentation
                </a>
            </span>
            <div className={classes.separator}></div>
            <h2>Vorta</h2>
            <div className={classes.description}>
                If you are using the Vorta graphical client, please refer to{' '}
                <a
                    href='https://vorta.borgbase.com/usage/'
                    rel='noreferrer'
                    target='_blank'
                >
                    this documentation
                </a>
                .
            </div>
        </div>
    );
}

export default WizardStep3;
