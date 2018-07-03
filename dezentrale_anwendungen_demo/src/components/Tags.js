import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TextInput from "./TextInput";

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing.unit / 2,
    },
    chip: {
        margin: theme.spacing.unit / 2,
    },
});

class ChipsArray extends React.Component {

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                {this.props.tags.map(data => {
                    return (
                        <Chip
                            key={data}
                            label={data}
                            //onClick={this.handleDelete(data)}
                            className={classes.chip}
                        />
                    );
                })}
                <TextInput type="add" onClick={this.props.onClick}/>
            </Paper>
        );
    }
}

ChipsArray.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChipsArray);