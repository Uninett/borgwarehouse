//Lib
import React from 'react';
import classes from '../WizardStep1/WizardStep1.module.css';
import { IconDeviceDesktopAnalytics, IconTerminal2 } from '@tabler/icons-react';
import CopyButton from '../../UI/CopyButton/CopyButton';
import lanCommandOption from '../../../helpers/functions/lanCommandOption';

function WizardStep1(props) {
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
                <IconTerminal2 className={classes.icon} />
                Command Line Interface
            </h1>
            <div className={classes.description}>
		When applying CLI two approaches are relevant.
	    </div>	    
            <h2>
                Install and configure <i>borgmatic</i>
            </h2>
            <div className={classes.description}>
		For more all-in-one management of backups install <b>borgmatic</b> on client side.<br/> 
		Note that borgmatic runs <b>borg</b> under-the-hood. <br/>
		(See <a href='https://torsion.org/borgmatic/docs/how-to/set-up-backups/'>
		detailed installation instructions</a>.)
		
		<li>Debian / Ubuntu&nbsp;
		<div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
                        sudo apt install borgmatic
                    </div>
                    <CopyButton
                        dataToCopy={`sudo apt install borgmatic`}
                    />
                </div>
		</li>
		<li>Redhat<br />
		<div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
                        sudo dnf install borgmatic
                    </div>
                    <CopyButton
                        dataToCopy={`sudo dnf install borgmatic`}
                    />
                </div>
		</li>
		<li>NetBSD<br />
		<div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                > (To be added)
                </div>
		</li>
		<li>Mac OS<br />
		    Make sure the <a href="https://brew.sh/">Homebrew package manager</a> is installed.
		    <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
                        brew install borgmatic
                    </div>
                    <CopyButton
                        dataToCopy={`brew install borgmatic`}
                    />
                </div>
		</li>
	    </div>
	    <h3 name="config">Create config file</h3>
	    
	    <p>Copy the yaml configuration given below into <i>/etc/borgmatic/config.yaml</i> on your client.<br/>
	    <i><b>Important:</b></i> Make sure to adjust the list of folders and files to include
	    in backups specified under <i>source_dirctories:</i> as well as the list of <i>exclude_patterns:</i></p>
	    <p><b>Note:</b> Make sure to <a href="/manage-repo/add">create</a> and select (top of page) a repository before copying config.</p>
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
            <h2>
                Install basic <i>borg</i> backup client
            </h2>
            <div className={classes.description}>
		Install the basic borg backup client on your OS. <br />
		(See <a href='https://borgbackup.readthedocs.io/en/stable/installation.html'>detailed installation instructions</a>.)

		<li>Debian / Ubuntu&nbsp;
		<span
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
                        sudo apt install borgbackup
                    </div>
                    <CopyButton
                        dataToCopy={`sudo apt install borgbackup`}
                    />
                </span>
		</li>
		<li>Redhat<br />
		<div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
                        sudo dnf install borgbackup
                    </div>
                    <CopyButton
                        dataToCopy={`sudo dnf install borgbackup`}
                    />
                </div>
		</li>
		<li>NetBSD<br />
		<div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
                        pkg_add py-borgbackup
                    </div>
                    <CopyButton
                        dataToCopy={`pkg_add py-borgbackup`}
                    />
                </div>
		</li>
		<li>Mac OS<br />
		    Make sure the <a href="https://brew.sh/">Homebrew package manager</a> is installed.
		<div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}
                >
                    <div className={classes.code}>
                        brew install borgbackup
                    </div>
                    <CopyButton
                        dataToCopy={`brew install borgbackup`}
                    />
                </div>
		</li>
	    </div>
	    {/*	      
	      Borgbackup relies on ssh for transport hence and ssh key pair is required genereated and installed
	      
	      Generate client side keypair (assuming under /root/.ssh) by 
	      
	      sudo ssh-keygen -t rsa -b 4096 -C "root@myhost.xx"
	      
	      Add public key and desired name of repository to backup-forskningsnett.uninett.no. **Note: You need to apply a ssh username with sudo access on backup-forskningsnett.uninett.no, e.g. your standard Sikt ldap user.**
	      
	      ssh -4t backup-forskningsnett.uninett.no sudo -u borgbackup borgbackup_add_repo.sh my-new-repo `sudo cat /root/.ssh/id_rsa.pub`
	      
	      Prepare a secret key-string to protect the new repository (to be applied by `borg` or `borgmatic`)
	      
	      sudo pwgen 40 1 > /root/my-new-repo.key
	      
	      ### Basic config of borgmatic on client side
	      
	      Borgmatic fetches most of its instructions from a configfile (default is /etc/borgmatic/config.yaml)
	      
	      Generate a new template config file with
	      
	      sudo generate-borgmatic-config
	      
	      * Edit the new configfile /etc/borgmatic/config.yaml to include the following
	      * A relevant list of source directories to includ in the backup, i.e. edit the `source_directories:` structure
	      * Under `repositories:` clean away the examples and add `borgbackup@backup-forskningsnett.uninett.no:/dynga/borgbackup/my-new-repo`
	      * Uncomment `storage:`
	      * Under storage uncommment `encryption_passcommand:` and add a command which feeds borgmatic with your secret key-string (applied during repo init) after
	      * E.g. `encryption_passcommand: cat /root/my-new-repo.key`
	      * Under storage uncomment `ssh_command:` and change it to `ssh_command: ssh -4`
	      * Note if you store your ssh keys somewhere else then /root/.ssh add `-i /path/to/ssh-keys`
	      
	      */}
	    
	    <h1>
                <IconDeviceDesktopAnalytics className={classes.icon} />
		Graphical User Interface
	    </h1>
	    <div className={classes.description}>
                <b>Vorta</b> is an opensource (GPLv3) backup client for Borg
                Backup.
                <br />
                It runs on Linux, MacOS and Windows (via Windows’ Linux
                Subsystem (WSL)). Follow the official {' '}
                <a
		    href='https://vorta.borgbase.com/'
		    target='_blank'
		    rel='noreferrer'
                >
		   installation instructions.
                </a>
                .
	    </div>
	    <img src='/vorta-demo.gif' alt='Vorta GIF' height="200"/>
        </div>
    );
}

function WizardStep1Org() {
    return (
        <div className={classes.container}>
            <h1>
                <IconTerminal2 className={classes.icon} />
                Command Line Interface
            </h1>
            <div className={classes.description}>
                We recommend using the official <b>BorgBackup</b> client which
                is supported by most Linux distributions.
                <br />
                More information about installation can be{' '}
                <a
                    href='https://borgbackup.readthedocs.io/en/stable/installation.html'
                    target='_blank'
                    rel='noreferrer'
                >
                    found here
                </a>
                .<br />
                To <b>automate your backup</b>, you can also use{' '}
                <a
                    href='https://torsion.org/borgmatic/'
                    target='_blank'
                    rel='noreferrer'
                >
                    Borgmatic
                </a>{' '}
                which is a{' '}
                <a
                    href='https://packages.debian.org/buster/borgmatic'
                    target='_blank'
                    rel='noreferrer'
                >
                    Debian package
                </a>
                . On the step 4, you will find a pattern of default config.
            </div>
            <div className={classes.separator}></div>
            <h1>
                <IconDeviceDesktopAnalytics className={classes.icon} />
                Graphical User Interface
            </h1>
            <div className={classes.description}>
                <b>Vorta</b> is an opensource (GPLv3) backup client for Borg
                Backup.
                <br />
                It runs on Linux, MacOS and Windows (via Windows’ Linux
                Subsystem (WSL)). Find the right way to install it{' '}
                <a
                    href='https://vorta.borgbase.com/'
                    target='_blank'
                    rel='noreferrer'
                >
                    just here
                </a>
                .
            </div>
            <img src='/vorta-demo.gif' alt='Vorta GIF' />
        </div>
    );
}

export default WizardStep1;
