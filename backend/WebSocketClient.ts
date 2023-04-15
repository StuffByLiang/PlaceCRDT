import * as Automerge from '@automerge/automerge';
import { createHash } from 'crypto';
import events from "events";

export default class Client<T> extends events.EventEmitter {
    // Fields
    open: boolean = false;
    syncState: Automerge.SyncState;
    client: WebSocket;
    documentId: string;
    doc: Automerge.Doc<T>;

    constructor(documentId: string, document: Automerge.Doc<T>, publish: boolean = false) {
        super();
        
        // Must have document
        if (!document) throw new Error("Document must be provided");

        // Handling documentId
        if (publish) {
            this.documentId = documentId;
        } else {
            // We hash the document Id so the server doesn't have access to everyone's documentIds
            let hash = createHash('sha256');
            hash.update(documentId);
            this.documentId = hash.digest('hex');
        }

        this.syncState = Automerge.initSyncState();
        this.doc = document;
        this.client = this._createClient();
    }

    _createClient(): WebSocket {
        this.syncState = Automerge.initSyncState();
        this.client = new WebSocket(`ws://localhost:8080/${this.documentId}`, 'echo-protocol');
        this.client.binaryType = 'arraybuffer';

        // Behavior when error
        this.client.onerror = () => {
            console.log('Connection Error');
        }

        // Behavior when open
        this.client.onopen = () => {
            console.log('WebSocket Client Connected');
            if (this.client.readyState === this.client.OPEN) {
                this.open = true;
                this.emit('open');  // let everyone know I'm open for business
                this.updatePeers(); // Update peer sync stuff
            }
        }

        // Behavior when closing
        this.client.onclose = () => {
            setTimeout(() => {
                this._createClient()
            }, 100)
        };

        // Behavior when receiving message
        this.client.onmessage = (e) => {
            let msg = new Uint8Array(e.data);
            let [ newDoc, newSyncState ] = Automerge.receiveSyncMessage(this.doc, this.syncState, msg);

            // Update me states
            this.doc = newDoc;
            this.syncState = newSyncState;

            // Updateeeee
            this.updatePeers();
        };

        return this.client;
    }

    localChange(newDoc: Automerge.Doc<T>) {
        this.doc = newDoc
        if (!this.open) {
          this.once('open', () => this.updatePeers())
          return
        }
        this.updatePeers()
      }
    
      updatePeers() {
        let [nextSyncState, msg] = Automerge.generateSyncMessage(
          this.doc,
          this.syncState
        );
        this.syncState = nextSyncState
        if (msg) {
          console.log('sending sync msg')
          this.client.send(msg)
        } else {
          console.log('no sync message to send')
        }
      }
    
      close() {
        console.log('Websocket client closed.')
        this.client.close()
      }
}