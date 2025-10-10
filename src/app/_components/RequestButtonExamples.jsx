// Example: How to integrate RequestButton in item listing pages
// This is a reference implementation for developers

import RequestButton from '../_components/RequestButton';

// Example 1: In a Room Details Page
const RoomDetailsPage = ({ room }) => {
  const handleRequestSent = (requestData) => {
    console.log('Room request sent:', requestData);
    // Optional: Update UI, show success message, etc.
  };

  return (
    <div className="room-details">
      <h1>{room.title}</h1>
      <p>Rent: ₹{room.price}/month</p>
      <p>Location: {room.location}</p>
      
      {/* Integration Point */}
      <RequestButton
        module="rooms"
        itemId={room.id}
        onRequestSent={handleRequestSent}
        className="mt-4"
      />
    </div>
  );
};

// Example 2: In a Marketplace Item Page
const ItemDetailsPage = ({ item }) => {
  const handleRequestSent = (requestData) => {
    console.log('Purchase request sent:', requestData);
  };

  return (
    <div className="item-details">
      <h1>{item.title}</h1>
      <p>Price: ₹{item.price}</p>
      <p>Condition: {item.condition}</p>
      
      {/* Integration Point */}
      <RequestButton
        module="itemsell"
        itemId={item.id}
        onRequestSent={handleRequestSent}
      />
    </div>
  );
};

// Example 3: In a Ticket Listing Page
const TicketDetailsPage = ({ ticket }) => {
  const handleRequestSent = (requestData) => {
    console.log('Ticket request sent:', requestData);
  };

  return (
    <div className="ticket-details">
      <h1>{ticket.event_name}</h1>
      <p>Price: ₹{ticket.price} per ticket</p>
      <p>Available: {ticket.quantity} tickets</p>
      
      {/* Integration Point - Note: Tickets support quantity selection */}
      <RequestButton
        module="ticketsell"
        itemId={ticket.id}
        onRequestSent={handleRequestSent}
      />
    </div>
  );
};

// Example 4: In a Ride Sharing Page
const RideDetailsPage = ({ ride }) => {
  const handleRequestSent = (requestData) => {
    console.log('Ride request sent:', requestData);
  };

  return (
    <div className="ride-details">
      <h1>{ride.title}</h1>
      <p>From: {ride.from_location}</p>
      <p>To: {ride.to_location}</p>
      <p>Date: {ride.date}</p>
      
      {/* Integration Point */}
      <RequestButton
        module="shareride"
        itemId={ride.id}
        onRequestSent={handleRequestSent}
      />
    </div>
  );
};

// Example 5: In a Lost & Found Item Page
const LostFoundDetailsPage = ({ item }) => {
  const handleRequestSent = (requestData) => {
    console.log('Claim request sent:', requestData);
  };

  return (
    <div className="lost-found-details">
      <h1>{item.title}</h1>
      <p>Category: {item.category}</p>
      <p>Found at: {item.location}</p>
      
      {/* Integration Point */}
      <RequestButton
        module="lostfound"
        itemId={item.id}
        onRequestSent={handleRequestSent}
      />
    </div>
  );
};

// Export examples for reference
export {
  RoomDetailsPage,
  ItemDetailsPage,
  TicketDetailsPage,
  RideDetailsPage,
  LostFoundDetailsPage
};