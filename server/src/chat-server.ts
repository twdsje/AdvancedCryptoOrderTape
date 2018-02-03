import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import * as GTT from 'gdax-trading-toolkit';
import { GDAXFeed } from "gdax-trading-toolkit/build/src/exchanges/gdax/gdaxfeed";
import { TradeMessage } from "gdax-trading-toolkit/build/src/core/messages";


export class ChatServer {
    public static readonly PORT:number = 3000;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
		this.mountRoutes();
        this.listen();
		this.startStreaming();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connection', (socket: any) => {
            console.log('Connected client on port %s.', this.port);

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
	
	private startStreaming(): void{
		const logger = GTT.utils.ConsoleLoggerFactory();
		const products: string[] = ['BTC-USD'];

		GTT.Factories.GDAX.FeedFactory(logger, products).then((feed: GDAXFeed) => {
			feed.on('data', (msg: TradeMessage) => {
				if(parseInt(msg.size) > 1) {
					//let m =`${msg.time.getHours()}:${msg.time.getMinutes()}:${msg.time.getSeconds()}:${msg.time.getMilliseconds()} ${msg.side} ${msg.price} ${msg.size}`;
					this.io.emit('message', msg);
					//console.log(m);
				}
			});
		}).catch((err: Error) => {
			logger.log('error', err.message);
			process.exit(1);
		});
	}
	
	private mountRoutes (): void {
		const router = express.Router()
		router.get('/', (req, res) => {
			res.sendFile(__dirname + '/index.html');
		})
		this.app.use('/', router)
	}

    public getApp(): express.Application {
        return this.app;
    }
}
