import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import Medium from "./Medium";
import SideBar from "./SideBar";
import Tags from "./Tags";
import CommentContainer from "./CommentContainer";
import Database from "../logic/Database";
import MediaService from "../logic/MediaService";
import TagCommentService from "../logic/TagCommentService";

const drawerWidth = 250;

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        position: 'absolute',
        marginLeft: drawerWidth,
        //backgroundColor: "black",
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        height: "100%",
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
});


class ResponsiveDrawer extends React.Component {
    database = Database;
    mediaService = new MediaService(this.database);
    tagCommentService = new TagCommentService(this.database);
    state = {
        thumbnails: [],
        medium: this.mediaService.getDummy(),
        comments: [],
        tags: [],
        mobileOpen: false,
    };

    constructor(props) {
        super(props);
        this.mediumChanged = this.mediumChanged.bind(this);
        this.addComment = this.addComment.bind(this);
        this.addTag = this.addTag.bind(this);
        this.search = this.search.bind(this);
        this.showMore = this.showMore.bind(this);
        this.upload = this.upload.bind(this);
        this.init();
    }
    init() {
        if(!this.database.isReady()){
            setTimeout(() => {
                this.init();
            }, 1000)
        } else {
            this.showMore();
        }

    }

    uploadFile = (files) => {
        this.mediaService.postFile(files[0]).then((m => {
            this.upload(m);

        }));
    };

    addTag = (tag) => {
        this.tagCommentService.putTag(this.state.medium.hash, tag.trim()).then(() =>
            this.tagCommentService.getTags(this.state.medium.hash).then(t => {
                    this.setState({
                        tags: t
                    })
                }
            )
        )
    };

    addComment = (comment) => {
        this.tagCommentService.putComment(this.state.medium.hash, comment).then(() =>
            this.tagCommentService.getComments(this.state.medium.hash).then(c => {
                    this.setState({
                        comments: c
                    })
                }
            )
        )
    };

    upload = (medium) => {
        if (medium === undefined) {
            return;
        }
        this.mediaService.getMedium(medium.hash).then(m => {
            this.mediumChanged(m);
            this.state.thumbnails.unshift(m);
            this.setState({
                thumbnails: this.state.thumbnails
            });
        });
    };

    mediumChanged = (medium) => {
        console.log("Displayed medium hash: " + medium.hash);
        this.setState(() => ({
            medium: medium,
            comments: [],
            tags: [],
        }));

        this.tagCommentService.getComments(medium.hash).then(c => {
            this.tagCommentService.getTags(medium.hash).then(t => {
                this.setState(() => ({
                        comments: c,
                        tags: t
                    })
                )
            })
        })
    };

    showMore = () => {
        this.setState(() => ({
            medium: this.mediaService.getDummy(),
            thumbnails: [],
            comments: [],
            tags: [],
        }));
        this.mediaService.getMediumList().then(t => {
            this.setState(() => ({
                thumbnails: t
            }));
            if(t.length > 0) {
                this.mediumChanged(t[0]);
            }
        });
    };

    search = (tag) => {
        console.log("search " + tag);
        this.mediaService.getMediumList(tag.trim()).then((images => {
            this.setState(() => ({
                thumbnails: images,
                medium: images.length > 0 ? images[0] : this.state.medium
            }));
        }))

    };


    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };

    render() {
        const {classes, theme} = this.props;
        return (
            <div className={classes.root}>
                <AppBar className={classes.appBar}>
                    <Toolbar height="100%">
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerToggle}
                            className={classes.navIconHide}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="title" color="inherit" noWrap>
                            IPFS-Imagehoster
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Hidden mdUp>
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={this.state.mobileOpen}
                        onClose={this.handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        <div>
                            <div className={this.props.classes.toolbar}/>
                            <SideBar images={this.state.thumbnails}
                                     onClick={this.mediumChanged}
                                     onDrop={this.uploadFile}
                                     onMore={this.showMore}
                                     onSearch={this.search}
                            />
                        </div>
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        variant="permanent"
                        open
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <div>
                            <div className={this.props.classes.toolbar}/>
                            <SideBar images={this.state.thumbnails}
                                     onClick={this.mediumChanged}
                                     onDrop={this.uploadFile}
                                     onMore={this.showMore}
                                     onSearch={this.search}
                            />
                        </div>
                    </Drawer>
                </Hidden>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Medium medium={this.state.medium}/>
                    <Tags tags={this.state.tags} onClick={this.addTag}/>
                    <CommentContainer comments={this.state.comments} onClick={this.addComment}/>
                </main>

            </div>
        );
    }
}

ResponsiveDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};


export default withStyles(styles, {withTheme: true})(ResponsiveDrawer);