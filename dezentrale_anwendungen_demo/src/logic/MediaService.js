var buffer = require('buffer/').Buffer;

class MediaService {
    constructor(db) {
        this.db = db;
    }

    getDummy() {
        return dummy;
    }

    getMedium(hash) {
        return this.db.getSpecific(hash).then(m => {
            return this._convertIPFSFile(m)
        });
    }

    getMediumList(tag = '', limit = -1) {
        let items = [];
        return this.db.getLast(tag, limit).then(data => {
            data.forEach(item => {
                items.push(this.getMedium(item));
            });
            return Promise.all(items);
        });
    }

    async getFiltered(tag, limit = -1) {

    }

    postFile(file) {
        let reader = new FileReader();
        let m = new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            reader.onload = () => {
                resolve(buffer.from(reader.result));
            };
            reader.readAsArrayBuffer(file)
        }).then((b => {
            return this.db.postFile([b], file);
        }));
        return m;
    }

    _convertIPFSFile(file) {
        return new Promise((resolve, reject) => {
                let blob = new Blob([file.content], {type: file.type});
                let reader = new FileReader();
                reader.onload = () => {
                    resolve({
                        content: reader.result,
                        hash: file.hash,
                        path: file.path,
                        type: file.type,
                        width: "100%"
                    })
                };
                reader.readAsDataURL(blob);
            }
        ).then(m => {
            return m;
        })
    }
}

export default MediaService;
const dummy = {
    path: 'image_dummy.png',
    content: require('../assets/image_dummy.png'),//'http://localhost:3001/static/media/dummy0.5c8d5aa3.jpg',
    hash: '-1',
    width: '100%',
    type: 'image'
};