

export class Restaurant {
    constructor(
        public name: string,
        public location: string,
        public description: string,
        public rating: number,
        public menu: string[],
    ) { }
}