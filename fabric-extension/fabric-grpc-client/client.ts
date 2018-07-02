import {Config} from 'shared';
import { SignedProposal, ChaincodeHeaderExtension, Proposal, ChaincodeProposalPayload } from './_protos/peer/proposal_pb';
import { ProposalResponse } from './_protos/peer/proposal_response_pb';
import { ChannelHeader, HeaderType, SignatureHeader, Header } from './_protos/common/common_pb';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { ChaincodeID, ChaincodeInvocationSpec, ChaincodeSpec, ChaincodeInput } from './_protos/peer/chaincode_pb';
import { SerializedIdentity } from './_protos/msp/identities_pb';

import { EndorserClient } from './_protos/peer/peer_pb_service';
import * as crypto from 'crypto';

let elliptic = require('elliptic');
let jsrsa = require('jsrsasign');
let BN = require('bn.js');

export class Client {
    private config: Config;
    private peers = new Array<EndorserClient>();

    constructor(config: Config) {
        this.config = config;
        for (let peer of config.Network.Peers) {
            this.peers.push(new EndorserClient(peer));
        }

        // this.orderers = new Client(config.Network.Orderer, ChannelCredentials.createInsecure() );
    }

    private _getTimestamp(): Timestamp {
        let now = new Date();
        let timestamp = new Timestamp();
        timestamp.setSeconds(Math.floor(now.getTime() / 1000));
        timestamp.setNanos((now.getTime() % 1000) * 1000000);
        return timestamp;
    }

    private _getSerializedIdentity(): SerializedIdentity {
        let identity = new SerializedIdentity();
        identity.setMspid(this.config.Identity.Msp);
        identity.setIdBytes(Buffer.from(this.config.Identity.Certificate));
        return identity;
    }

    private _getTransactionId(nonce: Buffer, identity: SerializedIdentity): string {
        let creator_bytes = Buffer.from(identity.serializeBinary());
        let trans_bytes = Buffer.concat([nonce, creator_bytes]);
        let hash = crypto.createHash('sha256').update(trans_bytes).digest('hex');

        return Buffer.from(hash).toString();
    }

    private async _sendProposal(chaincodeId: string, functionName: string, params: string[]= []): Promise<Array<ProposalResponse>> {
        let args = new Array<Buffer>();

        args.push(Buffer.from(functionName ? functionName : 'invoke', 'utf8'));
        params.forEach(element => args.push(Buffer.from(element, 'utf8')));

        // build signed proposal
        let nonce = crypto.randomBytes(24);
        let identity = this._getSerializedIdentity();
        let txid = this._getTransactionId(nonce, identity);

        // Chaincode to call
        let chaincodeID = new ChaincodeID();
        chaincodeID.setName(chaincodeId);

        // Channel Header
        let channelHeader = new ChannelHeader();
        channelHeader.setType(HeaderType.ENDORSER_TRANSACTION);
        channelHeader.setChannelId(this.config.Network.Channel);
        channelHeader.setVersion(1);
        channelHeader.setTimestamp(this._getTimestamp());
        channelHeader.setTxId(txid);

        // Extension of Channel Header specific to Chaincode invocations
        let headerExt = new ChaincodeHeaderExtension();
        headerExt.setChaincodeId(chaincodeID);
        channelHeader.setHeaderExtension(headerExt.serializeBinary());

        // Header for signature
        let signatureHeader = new SignatureHeader();
        signatureHeader.setCreator(identity.serializeBinary());
        signatureHeader.setNonce(nonce);

        // Global Header to compose signature and channel header
        let header = new Header();
        header.setChannelHeader(channelHeader.serializeBinary());
        header.setSignatureHeader(signatureHeader.serializeBinary());

        // chaincode specific inputs
        let chaincodeInput = new ChaincodeInput();
        chaincodeInput.setArgsList(args);

        let ccs = new ChaincodeSpec();
        ccs.setChaincodeId(chaincodeID);
        ccs.setInput(chaincodeInput);
        ccs.setType(ChaincodeSpec.Type.GOLANG);

        let cis = new ChaincodeInvocationSpec();
        cis.setChaincodeSpec(ccs);

        let cpp = new ChaincodeProposalPayload();
        cpp.setInput(cis.serializeBinary());

        // build proposal for distributed ledger updates
        // contains the header and payload depending on request type
        let proposal = new Proposal();
        proposal.setHeader(header.serializeBinary());
        proposal.setPayload(cpp.serializeBinary());

        // hash the proposal with sha256 hash algorithm
        let proposalBytes = proposal.serializeBinary();
        let proposalHash = crypto.createHash('sha256').update(proposalBytes).digest('hex');

        // retrives the private key from pem encoded private key string
        let key = jsrsa.KEYUTIL.getKey(this.config.Identity.Key);

        // sign the hash of the proposal
        let ecdsa = new elliptic.ec(elliptic.curves['p256']);
        let signKey = ecdsa.keyFromPrivate(key.prvKeyHex, 'hex');
        let sig = ecdsa.sign(Buffer.from(proposalHash, 'hex'), signKey);

        let halfOrder = elliptic.curves['p256'].n.shrn(1);
        if (sig.s.cmp(halfOrder) === 1) {
            let bigNum = new BN(key.ecparams.n.toString(16), 16);
            sig.s = bigNum.sub(sig.s);
        }

        let signature = sig.toDER();

        // compose the signed proposal with the plain proposal
        // and the signature of the hash
        let signedProposal = new SignedProposal();
        signedProposal.setProposalBytes(proposalBytes);
        signedProposal.setSignature(Buffer.from(signature));

        // execute requests
        let promises = new Array<Promise<ProposalResponse>>();
        for (let peer of this.peers) {
            let promise = new Promise<ProposalResponse>((resolve) => {
                peer.processProposal(signedProposal, (error, response) => {
                    if (error) throw error;
                    if (!response) throw new Error('NO_RESPONSE');
                    resolve(response);
                });
            });
            promises.push(promise);
        }
        return await Promise.all(promises);
    }

    public async QueryByChaincode(chaincodeId: string, functionName: string, params: string[] = []): Promise<any> {
        let responses = await this._sendProposal(chaincodeId, functionName, params);
        if (responses.length === 0)
            return null;

        let result = responses[0].getResponse();
        if (!result)
            return null;

        let payload = result.getPayload();
        if (!payload || !(payload instanceof Uint8Array) || payload.length <= 0)
            return null;

        return JSON.parse(Buffer.from(payload).toString('utf8'));
    }
}