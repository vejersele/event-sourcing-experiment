// @flow

export interface EventBus {
    publish<E: Object>(event: E): Promise<void>;
    subscribe<E: Object>(Event: Class<E>, handler: (event: E) => void): string;
}

export interface EventHandler<E: Object> {
    Event: Class<E>;
    handle(event: E): Promise<void>;
}
