import express, { Router } from 'express';

export interface ServerOptions {
    port            : number
    routes          : Router
    publicPath?     : string
}

export class Server {
    private readonly app = express()
    private readonly port: number
    private readonly routes: Router
    private serverListener?: any
    private readonly publicPath: string

    constructor(options: ServerOptions) {
        const { port, routes, publicPath = 'public' } = options;
        this.port = port;
        this.routes = routes;
        this.publicPath = publicPath
    }

    async start() {
        this.app.use( express.json() );
        this.app.use( express.urlencoded({ extended: true }) );

        this.app.use( this.routes );

        this.app.get('*', (req, res) => {
            res.status(404).json({ message: 'Not found' });
        });

        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}`);
        });
    }

    public stop() {
        this.serverListener?.close();
    }
    
}