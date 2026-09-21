import { Request, Response } from "express";
import { AppDataSource } from "../config/data";
import { Event } from "../entities/events";

const handleXml = (value: unknown) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const exportEventsXML = async (_req: Request, res: Response) => {
  try {
    const eventRepo = AppDataSource.getRepository(Event);
    
    // Fetch events with ticket types and bookings (including attendee)
    const events = await eventRepo.find({
      relations: {
        organizer: true,
        ticketTypes: true,
        bookings: { attendee: true, ticketType: true, } ,
      },
    });

    let xmlString = `<?xml version="1.0" encoding="UTF-8"?><Events>`;

    for (const ev of events) {
      xmlString += `<Event EventID="${handleXml(ev.id)}">`;
      xmlString += `<Title>${handleXml(ev.title)}</Title>`;
      ev.categories.forEach(cat => {
        xmlString += `<Category>${handleXml(cat)}</Category>`;
      });
      xmlString += `<EventType>${handleXml(ev.eventType)}</EventType>`;
      xmlString += `<Venue>${handleXml(ev.venue)}</Venue>`;
      xmlString += `<Address>${handleXml(ev.address)}</Address>`;
      xmlString += `<City>${handleXml(ev.city)}</City>`;
      xmlString += `<Country>${handleXml(ev.country)}</Country>`;

      if (ev.latitude && ev.longitude) {
        xmlString += `<GeoLocation Latitude="${handleXml(ev.latitude.toString())}" Longitude="${handleXml(ev.longitude.toString())}"/>`;
      }

      xmlString += `<StartDateTime>${handleXml(ev.startDateTime.toISOString())}</StartDateTime>`;
      xmlString += `<EndDateTime>${handleXml(ev.endDateTime.toISOString())}</EndDateTime>`;
      xmlString += `<Capacity>${handleXml(ev.capacity.toString())}</Capacity>`;

      xmlString += `<TicketTypes>`;
      ev.ticketTypes.forEach(tt => {
        xmlString += `<TicketType TicketTypeID="${handleXml(tt.id)}">`;
        xmlString += `<Name>${handleXml(tt.name)}</Name>`;
        xmlString += `<Price>${handleXml(tt.price.toFixed(2))}</Price>`;
        xmlString += `<Quantity>${handleXml(tt.quantity.toString())}</Quantity>`;
        xmlString += `<Available>${handleXml(tt.available.toString())}</Available>`;
        xmlString += `</TicketType>`;
      });
      xmlString += `</TicketTypes>`;

      xmlString += `<Bookings>`;
      if (ev.bookings && ev.bookings.length > 0) {
        ev.bookings.forEach(b => {
          const attendeeUsername = b.attendee?.username ?? "";
          const ticketTypeId = b.ticketType?.id ?? "";

          xmlString += `<Booking BookingID="${handleXml(b.id)}">`;
          xmlString += `<Attendee UserID="${handleXml(attendeeUsername)}"/>`;
          xmlString += `<Time>${handleXml(b.createdAt.toISOString())}</Time>`;
          xmlString += `<TicketTypeRef>${handleXml(ticketTypeId)}</TicketTypeRef>`;
          xmlString += `<NumberOfTickets>${handleXml(b.numberOfTickets.toString())}</NumberOfTickets>`;
          xmlString += `<TotalCost>${handleXml(b.totalCost.toFixed(2))}</TotalCost>`;
          xmlString += `<BookingStatus>${handleXml(b.bookingStatus)}</BookingStatus>`;
          xmlString += `</Booking>`;
        });
      }
      xmlString += `</Bookings>`;

      xmlString += `<Organizer UserID="${handleXml(ev.organizer.username)}"/>`;
      xmlString += `<Status>${handleXml(ev.status)}</Status>`;
      xmlString += `<Description>${handleXml(ev.description)}</Description>`;

      if (ev.photos && ev.photos.length > 0) {
        xmlString += `<Media>`;
        ev.photos.forEach(photo => {
          xmlString += `<Photo>${handleXml(photo)}</Photo>`;
        });
        xmlString += `</Media>`;
      }

      xmlString += `</Event>`;
    }

    xmlString += `</Events>`;

    res.header("Content-Type", "application/xml");
    return res.status(200).send(xmlString);
  } catch (error) {
    return res.status(500).json({ message: "Failed to export XML.", error });
  }
};