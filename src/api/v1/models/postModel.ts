
/**
 * Represents enumeration of Status of an event
 * active, cancelled and completed
 * Default value of active will be inserted, if not provided
 */
export enum Status {
    active = "active",
    cancelled = "cancelled",
    completed = "completed"
}

/**
 * Represents enumeration of Category of an event
 * conference, workshop, meetup, seminar and general
 * Default value of general will be inserted, if not provided
 */
export enum Category {
    conference = "conference",
    workshop = "workshop",
    meetup = "meetup",
    seminar = "seminar",
    general = "general"
}

/**
 * Represents request format of event interface
 * @param name - name of an event
 * @param date - date of an event
 * @param capacity - capacity of an event
 * @param registrationCount - number of registration of an event
 * @param status - status of an event
 * @param category - category of an event 
 */
export interface CreateEventRequest{
    name: string,
    date: Date,
    capacity: number,
    registrationCount?: number,
    status?: Status,
    category?: Category
}

/**
 * Represents response format of event interface
 * @param id - unique identifier of an event
 * @param name - name of an event
 * @param date - date of an event
 * @param capacity - capacity of an event
 * @param registrationCount - number of registration of an event
 * @param status - status of an event
 * @param category - category of an event 
 * @param createdAt - date when the event was created
 * @param updatedAt - date when the event was lastly updated
 */
export interface Event {
    id: string,
    name: string,
    date: Date,
    capacity: number,
    registrationCount?: number,
    status?: Status,
    category?: Category,
    createdAt: Date,
    updatedAt: Date
}
