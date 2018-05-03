// // @flow
// import uuid from 'uuid/v1';
//
// export interface Event {
//     get id(): string;
//     get sequenceNumber(): number;
// };
//
// type SetState = (event: Event) => void;
// type EventFactory = (eventId: string, sequenceNumber: number) => Event;
//
// export default class EventStore {
//
//     _version: number;
//     _events: Array<Event>;
//     _setState: SetState;
//
//     constructor(setState: SetState) {
//         this._version = 0;
//         this._setState = setState;
//     }
//
//     _generateId() {
//         return uuid();
//     }
//
//     applyEvent(eventFactory: EventFactory) {
//         const nextEventId = this._generateId();
//         const nextVersion = this._version + 1;
//
//         const event = eventFactory(nextEventId, nextVersion);
//
//         this._validateEventId(event, nextEventId);
//         this._validateVersion(event, nextVersion);
//
//         this._events = [...this._events, event];
//
//         this._version = nextVersion;
//
//         this._setState(event);
//     }
//
//     _validateEventId(event: Event, eventId: string) {
//         if (event.id !== eventId) {
//             throw new Error();
//         }
//     }
//
//     _validateVersion(event: Event, version: number) {
//         if (event.sequenceNumber !== version) {
//             throw new Error();
//         }
//     }
// }
