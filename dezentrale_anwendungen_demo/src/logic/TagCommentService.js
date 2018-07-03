class TagCommentService {
    constructor(db) {
        this.db = db;
    }
    putComment(hash, comment) {
        return this.db.postComment(hash, comment);
    }

    putTag(hash, tag) {
        return this.db.postTag(hash, tag);
    }

    getComments(hash) {
        return this.db.getComments(hash);
    }

    getTags(hash) {
        return this.db.getTags(hash);
    }
}

export default TagCommentService;