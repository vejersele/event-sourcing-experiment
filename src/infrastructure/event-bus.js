// @flow

import Tukio from 'tukio';
import type { EventBus as IEventBus, EventHandler } from '../domain/event-bus';

export default class EventBus extends Tukio implements IEventBus {
    registerEventHandlers(eventHandlers: Array<Object>) {
        eventHandlers.forEach(eventHandler => {
            this.subscribe(eventHandler.Event, e => eventHandler.handle(e));
        });
    }
}
