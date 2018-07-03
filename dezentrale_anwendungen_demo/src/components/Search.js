import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import {TextField} from "@material-ui/core/index";
import Search from "@material-ui/icons/Search";

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 0,
    },
    menuButton: {
        marginLeft: 0,
        marginRight: 0,
    },
    search: {
        position: "absolute",
        backgroundColor: "white"
    },
    button: {},
    text: {
        color: "white !important"
    }
};
class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text : ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            text: e.target.value
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <AppBar className={classes.search}>
                    <Toolbar>
                        <TextField
                            className={classes.text}
                            onChange={this.handleChange}
                        />
                        <Button variant="fab" className={classes.button} onClick={() => { this.props.onClick(this.state.text)}} mini>
                            <Search/>
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }

}

SearchBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchBar);