type Callback<T> = (state: T) => void;
type Token = string | string[];

interface Keyable {
    [Key: string]: number
}

interface Subscribers<T> {
    [Key: string]: (Callback<T> | null)[];
}

class Store<T>{

    private subscribers: Subscribers<T> = {};

    constructor(private state: T) {

    }

    getState() {
        return this.state;
    }

    subscribe(event: Token, callback: Callback<T>,init: boolean = true) {

        if (init) {
            callback(this.state);
        }

        const eventArr = Array.isArray(event) ? event : [event];
        let eventMap: Keyable = {};


        eventArr.forEach(event => {
            if (!this.subscribers[event]) {
                this.subscribers[event] = [];
            }

            const id = this.subscribers[event].push(callback) - 1;
            eventMap[event] = id;
        });

        return this.unsubscribe(eventMap);
    }

    private unsubscribe(eventMap: Keyable) {
        return () => {
            Object.keys(eventMap).forEach(key => {
                this.subscribers[key][eventMap[key]] = null
            })
        }
    }

    dispatch(token: string, reducer: (state: T) => T) {
        this.state = reducer(this.state);
        (this.subscribers[token] || []).forEach(callback => {
            callback && callback(this.state);
        });
    }
}

export default Store;
