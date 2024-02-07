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

    return (
        <div className={classes.container}>
            <h1>
                <IconWand className={classes.icon} />
                Automate your backup
            </h1>
            <h2>Borgmatic</h2>
            <div className={classes.description}>
		Select and apply an&nbsp;
                <a
                    href='https://torsion.org/borgmatic/docs/how-to/set-up-backups/#autopilot'
                    rel='noreferrer'
                    target='_blank'
                >
                    automation alternative&nbsp;
                </a> from the borgmatic documentation.
            </div>
	    <h2>Borg</h2>
            <div className={classes.description}>
                The official borgbackup project provides a&nbsp;
                <a
                    href='https://borgbackup.readthedocs.io/en/stable/quickstart.html#automating-backups'
                    rel='noreferrer'
                    target='_blank'
                >
                    scripts in its documentation
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

        </div>
    );
}

export default WizardStep4;
