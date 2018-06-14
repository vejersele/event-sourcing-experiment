// @flow

export interface EventBus {
    publish<E: Object>(event: E): void;
    subscribe<E: Object>(Event: Class<E>, handler: (event: E) => void): string;
}

export interface EventHandler<E: Object> {
    Event: Class<E>;
    handle(event: E): void;
}
