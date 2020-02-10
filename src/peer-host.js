import Peer from 'peerjs';
import { BehaviorSubject } from 'rxjs';

export class PeerHost {
    constructor() {
        this.peer = null;
        this.connections = [];
        this.players = [];
        this.players$ = new BehaviorSubject(this.players);
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
                    playerId: this.players.length ? Math.max(...this.players.map(p  => p.playerId)) + 1 : 1,
                    name: 'No name',
                    card: null
                });
                console.log('players', this.players);
                conn.on('data', (data) => {
                    if (data.request) {
                        this.handleRequest(conn, data.request);
                    }
                    if (data.action) {
                        this.handleAction(conn, data.action, data.data);
                    }
                });
                conn.on('close', () => {
                    this.removePlayerUsingConn(conn);
                });
            });
        });
    }

    startGame(gameConfig) {
        console.log('should start game with', gameConfig);
        const cards = gameConfig.cards;
        const shuffledPlayers = this.shuffleArray(this.players);

        const shadows = shuffledPlayers.slice(0, gameConfig.shadowHunters);
        const hunters = shuffledPlayers.slice(gameConfig.shadowHunters, gameConfig.shadowHunters * 2);
        const neutrals = shuffledPlayers.slice(gameConfig.shadowHunters * 2);

        console.log(shadows, hunters, neutrals);

        const shadowCards = this.shuffleArray(cards.filter(c => c.team === 'shadow'));
        const hunterCards = this.shuffleArray(cards.filter(c => c.team === 'hunter'));
        const neutralCards = this.shuffleArray(cards.filter(c => c.team === 'neutral'));

        shadows.forEach((player, index) => {
            player.card = shadowCards[index];
        });
        hunters.forEach((player, index) => {
            player.card = hunterCards[index];
        });
        neutrals.forEach((player, index) => {
            player.card = neutralCards[index];
        });

        this.players.forEach(player => {
            const conn = this.getConnectionFromPlayer(player);
            conn.send({
                type: 'card',
                data: player.card
            });
        })

        console.log('players', this.players);
    }

    shuffleArray(array) {
        const a = [...array];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
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
            case 'leave':
                this.removePlayerUsingConn(conn);
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
        this.players$.next(this.players);
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

    getConnectionFromPlayer(player) {
        return this.connections.find(c => player.peerId === c.peer);
    }

    playerCount() {
        return this.players.length;
    }

    removePlayerUsingConn(conn) {
        if (this.getPlayerFromConnection(conn) && (this.players.indexOf(this.getPlayerFromConnection(conn) > -1))) {
            this.players.splice(this.players.indexOf(this.getPlayerFromConnection(conn)), 1);
            conn.close();
            this.broadcastPlayers();
        }
    }
}