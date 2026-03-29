import { Event, CreateEventRequest } from "../models/postModel";
import * as eventRepository from "../repositories/eventRepository"

/** 
 * Asynchronous, this assingment is dealing with real database.
 * it menas, the function takes some time and will return after completion
 * which is Promise
*/ 

/**
 * Create event
 * @param event - request interface defined in postModel.
 * returns ticket information in api response format Event.
 * Id format will be used
 * status of a new event will be active if not proivded by default
 * category of a new event will be general if not proivded by default
 */
export const createEvent = async (event: CreateEventRequest): Promise<Event> => {

    // create new event
    // using partial<T> so that other than required fields, all properties become optional
    const newEvent: Partial<Event> = {
        name: event.name,
        date: new Date(),
        capacity: event.capacity,
        registrationCount: event.registrationCount,
        status: event.status,
        category: event.category,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    // get id from the data base
    const newEventId = await eventRepository.createDocument("events", newEvent);

    // fetches all documents in the events to count how many in that+
    const countEvents = await eventRepository.getDocuments("events");
    // count will update the id by one, everytime an event created
    const count = countEvents.size + 1;
    // use the formatted id based on the video demo 
    const formattedId = `evt_${String(count).padStart(6,"0")}`;


    // fetches the newly created event from the database
    const dbDocument = await eventRepository.getDocumentById("events", newEventId);
    // save the data as Event format
    const savedData = dbDocument?.data() as Event;

    // return api response format
    return {
        id: formattedId,
        name: savedData.name,
        date: savedData.date,
        capacity: savedData.capacity,
        registrationCount: savedData.registrationCount,
        status: savedData.status,
        category: savedData.category,
        createdAt: savedData.createdAt,
        updatedAt: savedData.updatedAt
    }
};

/**
 * Retrieve all events
 * returns all events in the array
 * with total number of events in the array
 */
export const getAllEvents = async (): Promise<Event[]> => {

    // wait until document fetches the data from firebase
    const document = await eventRepository.getDocuments("events");

    // use map to allocate document data and transform into Event data form
    // and return an array of Events as it Promise<Event[]>
    return document.docs.map(doc => {
        const data = doc.data() as Omit <Event, "id">;
        return{
            id:doc.id,
            ...data
        } as Event;
    });
};

/**
 * retrieve an event by id
 * @param id: number - unique identifier of an event 
 * returns a particular event if the id is valid 
 * throws an error if id is invalid
 */
export const getEventById = async (id: string): Promise<Event | undefined> => {
    
    // wait until documnet fetches the data from firebase
    const document = await eventRepository.getDocumentById("events", id);

    // if document is invalid
    if(!document){
        throw new Error("Id is invalid");
    }
    
    // since document.data() does not have id field, remove id from the data
    // and will have it back when it returns Promise<Event> type 
    const data = document.data() as Omit<Event, "id">;

    return {
        id: document.id,
        ...data
    }
};

/**
 * update a specific event with the id
 * @param id: number - unique identifier of an event 
 * @param updateData:  Omit<Event, "id" | "createdAt"> - receive any type of data that updates the event
 * @param updateData:  remove id and date of the creation because they must remain the same
 * return Event varaible with updated information
 */
export const updateEvent = async (id: string, updateData: Omit<Event, "id" | "createdAt"> ): Promise<Event> => {
    
    // fetch Event by its id
    const existingDocument = await getEventById(id);

    // if the event is invalid
    if(!existingDocument){
        throw new Error("Id is invalid");
    }

    // update the data of the id, and updatedAt will be now
    await eventRepository.updateDocument("events", id, {...updateData, updatedAt: new Date()});

    // object spread operator to merge updated code into existing one
    return {
        ...existingDocument,
        ...updateData,
        updatedAt: new Date()
    }
};

/**
 * delete specific event
 * @param id: number - unique identifier of an event
 * No return
 * Remove particular data with the id
 * throw an error when the id is invalid
 */
export const deleteEvent = async (id: string): Promise<void> => {

    // fetch Event by its id
    const document = await getEventById(id);

    // if the event is invalid
    if(!document){
        throw new Error("Id is invalid");
    }

    // delete the particular event by its id in the database
    await eventRepository.deleteDocument("events", id);

}