import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: "left",
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2
    }),
});

function PaperSheet(props) {
    const { classes } = props;
    return (
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography component="p">
                    {props.message}
                </Typography>
            </Paper>
        </div>
    );
}

PaperSheet.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperSheet);