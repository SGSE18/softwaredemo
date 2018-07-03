const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');
const wrtc = require('wrtc')
const WStar = require('libp2p-webrtc-star')
const wstar = new WStar({wrtc: wrtc})

const ipfsOptions = {
    EXPERIMENTAL: {
        pubsub: true
    },
    start: true,
    config: {
        Addresses: {
            Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star']
        }
    }, libp2p: {
        modules: {
            transport : [wstar],
            discovery : [wstar.discovery]
        }
    }
};


class Database {

    constructor() {
        this.init = this.init.bind(this);
        this.repostLog = '';
        this.mediaLog = '';
        this.ipfs = '';
        this.node = '';
        this.orbitdb = '';
        this.state = false;
        this.init();
    }

    init() {
        this.ipfs = new IPFS(ipfsOptions);
        //this.daemon = ipfsAPI('localhost', '5001');

        this.ipfs.on('ready', async () => {
            this.orbitdb = new OrbitDB(this.ipfs);

            this.repostLog = await this.orbitdb.kvstore('repost');
            //await this.repostLog.drop();
            await this.repostLog.load();

            this.mediaLog = await  this.orbitdb.log('media');
            //await this.mediaLog.drop();
            await this.mediaLog.load();

            // Listen for updates from peers
            this.mediaLog.events.on('replicated', (address) => {
                console.log(this.mediaLog.iterator({limit: -1}).collect());
                console.log(address)
            });
            this.state = true;

            console.log("ipfs is ready");
        });

        this.ipfs.on('start',
            () => {
                console.log('Node started!');
                //Node Rechner: QmPos19Sy5j8S7XA7an7WqocvHpVECW9uvEdPE28DV76Kf
                //Node Laptop: QmdiX3ja8z9myZdj11DwCk1Kn1aWsLYvPEFvEgcwmRJ8uq
                this.ipfs.swarm.connect('/ip4/127.0.0.1/tcp/9999/ws/ipfs/QmdiX3ja8z9myZdj11DwCk1Kn1aWsLYvPEFvEgcwmRJ8uq')
                    .then(() => {
                        console.log(`Successfully connected to peer.`);
                        this.ipfs.swarm.peers(function (err, peerInfos) {
                            if (err) {
                                throw err
                            }
                            console.log(peerInfos)
                        })
                    })
                    .catch((err) => console.log('An error occurred when connecting to the peer.' + err))


            }

        );

    }

    isReady() {
        return this.state;
    }

    async getSpecific(hash) {
        return this.ipfs.files.cat(hash).then((content => {
            let data = this.repostLog.get(hash);
            data.content = content;
            return data;
        }));
    }

    async getLast(tag = '', limit = -1) {
        if (tag !== '') {
            let tagFilter = await
                this.orbitdb.log("tagfilter" + tag);
            await
                tagFilter.load();
            return await
                tagFilter.iterator({limit: limit, reversed: true}).collect().map((e) => e.payload.value)
        }
        return await
            this.mediaLog.iterator({limit: limit, reversed: true}).collect().map((e) => e.payload.value)
    }

    postFile(databuffer, medium) {
        return this.ipfs.files.add(databuffer).then((data => {
            let m = {
                content: medium.name,
                hash: data[0].hash,
                path: "/ipfs/" + data[0].hash,
                type: medium.type,
                width: "100%"
            };
            return this._postFile(m);
        }))
    }

    async _postFile(data) {
        const exist = this.repostLog.get(data.hash);
        if (exist === undefined) {
            return this.mediaLog.add(data.hash).then((h => {
                console.log("Item logged: " + data.hash);
                let d = {
                    hash: data.hash,
                    path: data.path,
                    type: data.type,
                    width: data.width
                };
                return this.repostLog.put(data.hash, d);
            })).then(() => {
                return data
            });
        }
        return data;
    }

    async postComment(hash, comment) {
        let commentLog = await
            this.orbitdb.log("comment" + hash);
        await
            commentLog.load();
        return commentLog.add(comment);
    }

    async getComments(hash) {
        let commentLog = await
            this.orbitdb.log("comment" + hash);
        await
            commentLog.load();
        return commentLog.iterator({limit: -1}).collect().map((e) => e.payload.value)
    }

    async postTag(hash, tag) {
        let tagLog = await
            this.orbitdb.log("tags" + hash);
        let tagFilter = await
            this.orbitdb.log("tagfilter" + tag);
        await
            tagFilter.load();
        tagFilter.add(hash);
        await
            tagLog.load();
        return tagLog.add(tag);
    }

    async getTags(hash) {
        let tagLog = await
            this.orbitdb.log("tags" + hash);
        await
            tagLog.load();
        return tagLog.iterator({limit: -1}).collect().map((e) => e.payload.value)
    }

}

export default (new Database());

