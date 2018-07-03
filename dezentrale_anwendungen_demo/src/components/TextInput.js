import React from "react";
import {Button, TextField} from "@material-ui/core/index";
import {withStyles} from "@material-ui/core/styles/index";
import Add from "@material-ui/icons/Add";
import Chat from "@material-ui/icons/Chat";

const styles = {
    button: {},
    text: {
        color: "white !important",
    }
};


class TextInput extends React.Component {
    state = {text: ''}

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            text: e.target.value
        });
    }

    clearText() {
        this.setState({
            text: ""
        })
    }

    getType() {
        if (this.props.type === "add") {
            return (<Add/>)
        }
        return (<Chat/>)
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <TextField
                    className={classes.text}
                    value={this.state.text}
                    //value={this.state.tag}
                    onChange={this.handleChange}
                    //margin="normal"
                    multiline={this.props.type !== "add"}
                    style={{width: "80%"}}
                />
                <Button variant="fab" className={classes.button}
                        onClick={() => {
                            this.props.onClick(this.state.text);
                            this.clearText();
                        }

                        }
                        style={{maxWidth: "20%"}} mini>
                    {this.getType()}
                </Button>
            </div>
        )
    }
}

export default withStyles(styles)(TextInput);