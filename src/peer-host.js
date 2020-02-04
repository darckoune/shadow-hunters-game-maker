import Peer from 'peerjs';
import { } from './constants';

export class PeerHost {
    constructor() {
        this.peer = null;
        this.connections = [];
        this.players = [];
        this.createGame();
    }

    start() {
        return new Promise((resolve, reject) => {
            this.peer = new Peer();
            this.peer.on('open', function(id) {
                resolve(id);
            });
            this.peer.on('connection', (conn) => {
                console.log('new conn');
                this.connections.push(conn);
                this.players.push({
                    peerId: conn.peer,
                    playerId: this.players.length ? Math.max(this.players.map(p  => p.playerId)) + 1 : 1,
                    name: 'No name'
                });
                conn.on('data', (data) => {
                    if (data.request) {
                        this.handleRequest(conn, data.request);
                    }
                    if (data.action) {
                        this.handleAction(conn, data.action, data.data);
                    }
                });
                conn.on('close', () => {
                    this.players.splice(this.players.indexOf(this.getPlayerFromConnection(conn)), 1);
                    this.broadcastPlayers();
                });
                this.broadcastPlayers();
            });
        });
    }

    createGame() {
        
    }

    resetGame() {
        this.createGame();
        this.broadcastGameState();
    }

    handleRequest(conn, request) {
        switch (request) {
            case 'players':
                conn.send({
                    type: 'players',
                    data: this.getSendablePlayers()
                });
                break;
            default:
                console.error('Unable to handle request: ' + request);
                break;
        }
    }

    handleAction(conn, action, data) {
        const player = this.getPlayerFromConnection(conn);
        if (!player) return;
        switch (action) {
            case 'name':
                player.name = data.name;
                this.broadcastPlayers();
                break;
            default:
                console.error('Unable to handle action: ' + action);
                break;
        }
    }

    broadcastGameState() {
        this.connections.forEach(conn => {
            conn.send({
                type: 'state',
                data: this.getSendableGameState()
            });
        })
    }

    broadcastPlayers() {
        this.connections.forEach(conn => {
            conn.send({
                type: 'players',
                data: this.getSendablePlayers()
            })
        })
    }

    getSendablePlayers() {
        return this.players.map(player => {
            return {
                playerId: player.playerId,
                name: player.name
            }
        })
    }

    getPlayerFromConnection(conn) {
        return this.players.find(p => p.peerId === conn.peer);
    }

    playerCount() {
        return this.players.length;
    }
}