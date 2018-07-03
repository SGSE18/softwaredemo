import React from "react";


class Medium extends React.Component {

    isVideo() {
        if(this.props.medium === undefined) {
            return false;
        }
        return this.props.medium.type.startsWith("video");
    }

    render() {
        if (this.isVideo()) {
            return (
                <div>
                    <video controls>
                        <source src={this.props.medium.content} style={{maxWidth : "100%"}}/>
                    </video>
                </div>
            )
        }
        return (

            <div>
                <img src={this.props.medium.content} alt="" style={{maxWidth : "100%"}}/>
            </div>

        )
    }

}

export default Medium;
