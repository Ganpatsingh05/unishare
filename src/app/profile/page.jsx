'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, Home, ShoppingBag, Car, Ticket, Search as SearchIcon,
  Edit3, Trash2, Camera, MapPin, Settings, Share2,
  AlertCircle, CheckCircle, X, Plus, Users, Clock, Calendar, Phone, Mail,
  Star, Badge, Package, Info, Tag, DollarSign, Sofa, Building, Navigation,
  Instagram, Link2
} from 'lucide-react';

// Import API functions
import { 
  fetchMyRooms,   
  createRoom, 
  updateRoom, 
  deleteRoom, 
  validateRoomData, 
  prepareRoomFormData 
} from '../lib/api/housing';
import { 
  fetchMyItems, 
  createItem, 
  updateItem, 
  deleteItem 
} from '../lib/api/marketplace';
import { 
  getMyRides, 
  createRide, 
  updateRide, 
  deleteRide 
} from '../lib/api/rideSharing';
import { 
  fetchMyTickets, 
  createTicket, 
  updateTicket, 
  deleteTicket 
} from '../lib/api/tickets';
import { 
  fetchMyLostFoundItems, 
  createLostFoundItem, 
  updateLostFoundItem, 
  deleteLostFoundItem 
} from '../lib/api/lostFound';
import { 
  getCurrentUserProfile, 
  updateUserProfile 
} from '../lib/api/userProfile';

import { 
  getUserNotifications, 
  getUnreadNotificationsCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../lib/api/notifications';

// Import contexts
import { useAuth, useUI, useUniShare } from '../lib/contexts/UniShareContext';

// Import components
import Footer from '../_components/Footer';
import ProfileDisplay from '../_components/ProfileDisplay';
import ProfileEditModal from '../_components/ProfileEditModal';

// Import utilities
import { getProfileImageUrl, getUserInitials, getDisplayName } from '../lib/utils/profileUtils';

// Helper function to safely render contact information
const renderContactInfo = (contactInfo) => {
  if (!contactInfo) return null;
  
  // If it's a string, return it directly
  if (typeof contactInfo === 'string') {
    return contactInfo;
  }
  
  // If it's an object, extract and format the information
  if (typeof contactInfo === 'object') {
    const parts = [];
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.email) parts.push(`✉️ ${contactInfo.email}`);
    if (contactInfo.instagram) parts.push(`📸 ${contactInfo.instagram.startsWith('@') ? contactInfo.instagram : '@' + contactInfo.instagram}`);
    return parts.length > 0 ? parts.join(' • ') : 'Contact available';
  }
  
  return 'Contact available';
};

// Helper function to format contact information for API submission
const formatContactInfo = (editFormData) => {
  const contactInfo = {};
  if (editFormData.contact_phone) contactInfo.mobile = editFormData.contact_phone;
  if (editFormData.contact_email) contactInfo.email = editFormData.contact_email;
  if (editFormData.contact_instagram) contactInfo.instagram = editFormData.contact_instagram;
  if (editFormData.contact_link) contactInfo.link = editFormData.contact_link;
  
  return Object.keys(contactInfo).length > 0 ? contactInfo : editFormData.contact_info;
};

// Card Components for different listing types
const RoomCard = ({ room, theme, onEdit, onDelete }) => {
  const price = room.rent || room.price || room.monthly_rent || room.monthlyRent || room.roomPrice || room.rental_price;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`${theme.card} rounded-xl overflow-hidden border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300`}
    >
    <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 relative">
      {room.image_url || room.photos?.[0] ? (
        <img 
          src={room.image_url || room.photos?.[0]} 
          alt={room.title} 
          className="w-full h-full object-cover" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Home className="w-12 h-12 text-blue-500" />
        </div>
      )}
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          room.status === 'available' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
        }`}>
          {room.status || 'available'}
        </span>
      </div>
    </div>
    <div className="p-4 space-y-3">
      <div>
        <h3 className={`font-semibold ${theme.text} mb-1`}>{room.title}</h3>
        <div className="flex items-center justify-between">
          <span className={`text-lg font-bold text-blue-600`}>
            ₹{price || 'N/A'}/month
          </span>
          {room.area && (
            <span className={`text-sm ${theme.textMuted} bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded`}>
              {room.area} sq ft
            </span>
          )}
        </div>
      </div>

      {room.description && (
        <p className={`text-sm ${theme.textMuted} leading-relaxed`}>{room.description}</p>
      )}
      
      <div className="grid grid-cols-1 gap-2 text-sm">
        {room.location && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{room.location}</span>
          </div>
        )}
        {(room.type || room.roomType) && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <Building className="w-4 h-4 text-blue-500" />
            <span>{room.type || room.roomType}</span>
          </div>
        )}
        {room.furnished && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <Sofa className="w-4 h-4 text-blue-500" />
            <span>Furnished: {room.furnished}</span>
          </div>
        )}
        {room.gender_preference && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <Users className="w-4 h-4 text-blue-500" />
            <span>Preference: {room.gender_preference}</span>
          </div>
        )}
      </div>

      {(room.amenities && room.amenities.length > 0) && (
        <div className="space-y-1">
          <span className={`text-sm font-medium ${theme.text}`}>Amenities:</span>
          <div className="flex flex-wrap gap-1">
            {room.amenities.map((amenity, index) => (
              <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {(room.contact_info || room.phone || room.email) && (
        <div className="space-y-1">
          <span className={`text-sm font-medium ${theme.text}`}>Contact:</span>
          <div className="space-y-1">
            {(room.phone || room.contact_info) && (
              <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
                <Phone className="w-3 h-3 text-blue-500" />
                <span>{room.phone || renderContactInfo(room.contact_info)}</span>
              </div>
            )}
            {room.email && (
              <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
                <Mail className="w-3 h-3 text-blue-500" />
                <span>{room.email}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className={`text-xs ${theme.textMuted}`}>
          Posted {room.created_at ? new Date(room.created_at).toLocaleDateString() : 'Recently'}
        </span>
        <div className="flex space-x-1">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(room, 'rooms')}
            className={`p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors`}
            title="Edit Room"
          >
            <Edit3 className="w-3 h-3 text-blue-600" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(room, 'rooms')}
            className={`p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors`}
            title="Delete Room"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
  );
};

const ItemCard = ({ item, theme, onEdit, onDelete }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className={`${theme.card} rounded-xl overflow-hidden border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300`}
  >
    <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 relative">
      {item.image_url || item.image ? (
        <img 
          src={item.image_url || item.image} 
          alt={item.title} 
          className="w-full h-full object-cover" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-green-500" />
        </div>
      )}
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'available' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
        }`}>
          {item.status || 'available'}
        </span>
      </div>
      {item.condition && (
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.condition === 'new' ? 'bg-blue-500 text-white' : 
            item.condition === 'excellent' ? 'bg-purple-500 text-white' :
            item.condition === 'good' ? 'bg-yellow-500 text-white' :
            'bg-orange-500 text-white'
          }`}>
            {item.condition}
          </span>
        </div>
      )}
    </div>
    <div className="p-4 space-y-3">
      <div>
        <h3 className={`font-semibold ${theme.text} mb-1`}>{item.title}</h3>
        <div className="flex items-center justify-between">
          <span className={`text-lg font-bold text-green-600`}>₹{item.price}</span>
          {item.category && (
            <span className={`text-sm ${theme.textMuted} bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded`}>
              {item.category}
            </span>
          )}
        </div>
      </div>

      {item.description && (
        <p className={`text-sm ${theme.textMuted} leading-relaxed`}>{item.description}</p>
      )}

      <div className="grid grid-cols-1 gap-2 text-sm">
        {item.brand && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <Tag className="w-4 h-4 text-green-500" />
            <span>Brand: {item.brand}</span>
          </div>
        )}
        {item.model && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <Package className="w-4 h-4 text-green-500" />
            <span>Model: {item.model}</span>
          </div>
        )}
        {item.location && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <MapPin className="w-4 h-4 text-green-500" />
            <span>{item.location}</span>
          </div>
        )}
      </div>

      {item.specifications && (
        <div className="space-y-1">
          <span className={`text-sm font-medium ${theme.text}`}>Specifications:</span>
          <p className={`text-xs ${theme.textMuted} leading-relaxed`}>{item.specifications}</p>
        </div>
      )}

      {(item.contact_info || item.phone || item.email) && (
        <div className="space-y-1">
          <span className={`text-sm font-medium ${theme.text}`}>Contact:</span>
          <div className="space-y-1">
            {(item.phone || item.contact_info) && (
              <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
                <Phone className="w-3 h-3 text-green-500" />
                <span>{item.phone || renderContactInfo(item.contact_info)}</span>
              </div>
            )}
            {item.email && (
              <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
                <Mail className="w-3 h-3 text-green-500" />
                <span>{item.email}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {item.negotiable && (
        <div className={`text-sm text-green-600 font-medium flex items-center gap-1`}>
          <DollarSign className="w-4 h-4" />
          <span>Price Negotiable</span>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className={`text-xs ${theme.textMuted}`}>
          Posted {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently'}
        </span>
        <div className="flex space-x-1">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(item, 'items')}
            className={`p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors`}
            title="Edit Item"
          >
            <Edit3 className="w-3 h-3 text-green-600" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(item, 'items')}
            className={`p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors`}
            title="Delete Item"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

const RideCard = ({ ride, theme, onEdit, onDelete }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className={`${theme.card} rounded-xl border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 p-4 space-y-3`}
  >
    <div className="flex items-center justify-between">
      <Car className="w-8 h-8 text-purple-500" />
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        ride.status === 'active' ? 'bg-purple-500 text-white' : 'bg-gray-500 text-white'
      }`}>
        {ride.status || 'active'}
      </span>
    </div>

    <div>
      <h3 className={`font-semibold ${theme.text} mb-2 flex items-center gap-2`}>
        <Navigation className="w-4 h-4 text-purple-500" />
        {ride.from_location || ride.from} → {ride.to_location || ride.to}
      </h3>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className={`${theme.textMuted} flex items-center gap-2`}>
          <Calendar className="w-4 h-4 text-purple-500" />
          <span>{ride.date}</span>
        </div>
        <div className={`${theme.textMuted} flex items-center gap-2`}>
          <Clock className="w-4 h-4 text-purple-500" />
          <span>{ride.time}</span>
        </div>
      </div>
    </div>

    <div className="space-y-1">
      <span className={`text-sm font-medium ${theme.text}`}>Vehicle:</span>
      <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
        <Car className="w-4 h-4 text-purple-500" />
        <span>{ride.vehicle_info || ride.vehicle || ride.car_details || 'Vehicle info not available'}</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
        <DollarSign className="w-4 h-4 text-purple-500" />
        <span className="font-medium">₹{ride.price_per_seat || ride.price}/seat</span>
      </div>
      {(ride.available_seats || ride.seats) && (
        <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
          <Users className="w-4 h-4 text-purple-500" />
          <span>{ride.available_seats || ride.seats} seats</span>
        </div>
      )}
    </div>

    {(ride.notes || ride.description || ride.additional_info) && (
      <div className="space-y-1">
        <span className={`text-sm font-medium ${theme.text}`}>Additional Info:</span>
        <p className={`text-sm ${theme.textMuted} leading-relaxed`}>
          {ride.notes || ride.description || ride.additional_info}
        </p>
      </div>
    )}

    {(ride.contact_info || ride.phone || ride.email) && (
      <div className="space-y-1">
        <span className={`text-sm font-medium ${theme.text}`}>Contact:</span>
        <div className="space-y-1">
          {(ride.phone || ride.contact_info) && (
            <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
              <Phone className="w-3 h-3 text-purple-500" />
              <span>{ride.phone || renderContactInfo(ride.contact_info)}</span>
            </div>
          )}
          {ride.email && (
            <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
              <Mail className="w-3 h-3 text-purple-500" />
              <span>{ride.email}</span>
            </div>
          )}
        </div>
      </div>
    )}
    
    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
      <span className={`text-xs ${theme.textMuted}`}>
        Posted {ride.created_at ? new Date(ride.created_at).toLocaleDateString() : 'Recently'}
      </span>
      <div className="flex space-x-1">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(ride, 'rides')}
          className={`p-1 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded transition-colors`}
          title="Edit Ride"
        >
          <Edit3 className="w-3 h-3 text-purple-600" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(ride, 'rides')}
          className={`p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors`}
          title="Delete Ride"
        >
          <Trash2 className="w-3 h-3 text-red-500" />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const TicketCard = ({ ticket, theme, onEdit, onDelete }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className={`${theme.card} rounded-xl border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 p-4 space-y-3`}
  >
    <div className="flex items-center justify-between">
      <Ticket className="w-8 h-8 text-orange-500" />
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        ticket.status === 'available' ? 'bg-orange-500 text-white' : 'bg-gray-500 text-white'
      }`}>
        {ticket.status || 'available'}
      </span>
    </div>

    <div>
      <h3 className={`font-semibold ${theme.text} mb-2`}>
        {ticket.event_name || ticket.title}
      </h3>
      
      <div className="flex items-center justify-between mb-2">
        <span className={`text-lg font-bold text-orange-600`}>₹{ticket.price}</span>
        {ticket.quantity && (
          <span className={`text-sm ${theme.textMuted} bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded`}>
            Qty: {ticket.quantity}
          </span>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-2 text-sm">
      {ticket.venue && (
        <div className={`${theme.textMuted} flex items-center gap-2`}>
          <MapPin className="w-4 h-4 text-orange-500" />
          <span>{ticket.venue}</span>
        </div>
      )}
      {ticket.event_date && (
        <div className={`${theme.textMuted} flex items-center gap-2`}>
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>{new Date(ticket.event_date).toLocaleDateString()}</span>
        </div>
      )}
      {ticket.event_time && (
        <div className={`${theme.textMuted} flex items-center gap-2`}>
          <Clock className="w-4 h-4 text-orange-500" />
          <span>{ticket.event_time}</span>
        </div>
      )}
      {ticket.seat_details && (
        <div className={`${theme.textMuted} flex items-center gap-2`}>
          <Badge className="w-4 h-4 text-orange-500" />
          <span>Seat: {ticket.seat_details}</span>
        </div>
      )}
    </div>

    {ticket.description && (
      <div className="space-y-1">
        <span className={`text-sm font-medium ${theme.text}`}>Description:</span>
        <p className={`text-sm ${theme.textMuted} leading-relaxed`}>{ticket.description}</p>
      </div>
    )}

    {ticket.category && (
      <div className={`text-sm ${theme.textMuted} bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded inline-block`}>
        Category: {ticket.category}
      </div>
    )}

    {(ticket.contact_info || ticket.phone || ticket.email) && (
      <div className="space-y-1">
        <span className={`text-sm font-medium ${theme.text}`}>Contact:</span>
        <div className="space-y-1">
          {(ticket.phone || ticket.contact_info?.mobile) && (
            <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
              <Phone className="w-3 h-3 text-orange-500" />
              <span>{ticket.phone || ticket.contact_info?.mobile}</span>
            </div>
          )}
          {(ticket.email || ticket.contact_info?.email) && (
            <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
              <Mail className="w-3 h-3 text-orange-500" />
              <span>{ticket.email || ticket.contact_info?.email}</span>
            </div>
          )}
          {ticket.contact_info?.instagram && (
            <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
              <Instagram className="w-3 h-3 text-orange-500" />
              <span>{ticket.contact_info.instagram.startsWith('@') ? ticket.contact_info.instagram : '@' + ticket.contact_info.instagram}</span>
            </div>
          )}
          {ticket.contact_info?.link && (
            <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
              <Link2 className="w-3 h-3 text-orange-500" />
              <span className="truncate">{ticket.contact_info.link}</span>
            </div>
          )}
          {/* Fallback to old renderContactInfo function if no specific fields found */}
          {!ticket.phone && !ticket.email && !ticket.contact_info?.mobile && !ticket.contact_info?.email && ticket.contact_info && (
            <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
              <Phone className="w-3 h-3 text-orange-500" />
              <span>{renderContactInfo(ticket.contact_info)}</span>
            </div>
          )}
        </div>
      </div>
    )}

    {ticket.transferable && (
      <div className={`text-sm text-orange-600 font-medium flex items-center gap-1`}>
        <Star className="w-4 h-4" />
        <span>Transferable</span>
      </div>
    )}
    
    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
      <span className={`text-xs ${theme.textMuted}`}>
        Posted {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'Recently'}
      </span>
      <div className="flex space-x-1">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(ticket, 'tickets')}
          className={`p-1 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded transition-colors`}
          title="Edit Ticket"
        >
          <Edit3 className="w-3 h-3 text-orange-600" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(ticket, 'tickets')}
          className={`p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors`}
          title="Delete Ticket"
        >
          <Trash2 className="w-3 h-3 text-red-500" />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const LostFoundCard = ({ item, theme, onEdit, onDelete }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className={`${theme.card} rounded-xl overflow-hidden border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300`}
  >
    <div className="aspect-video bg-gradient-to-br from-red-100 to-red-200 relative">
      {(item.image_urls && item.image_urls.length > 0) ? (
        <img 
          src={item.image_urls[0]} 
          alt={item.item_name || item.title || item.name} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
          }}
        />
      ) : null}
      <div className="w-full h-full flex items-center justify-center fallback-icon" style={{ display: (item.image_urls && item.image_urls.length > 0) ? 'none' : 'flex' }}>
        <SearchIcon className="w-12 h-12 text-red-500" />
      </div>
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          (item.mode || item.type) === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {item.mode || item.type || 'lost'}
        </span>
      </div>
      {item.reward && (
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
            ₹{item.reward} Reward
          </span>
        </div>
      )}
    </div>
    <div className="p-4 space-y-3">
      <div>
        <h3 className={`font-semibold ${theme.text} mb-1`}>
          {item.item_name || item.title || item.name}
        </h3>
        {item.category && (
          <span className={`text-sm ${theme.textMuted} bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded`}>
            {item.category}
          </span>
        )}
      </div>

      {item.description && (
        <p className={`text-sm ${theme.textMuted} leading-relaxed`}>{item.description}</p>
      )}

      <div className="grid grid-cols-1 gap-2 text-sm">
        {/* Location - different field names for lost vs found */}
        {(item.where_last_seen || item.where_found || item.location) && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <MapPin className="w-4 h-4 text-red-500" />
            <span>
              {item.mode === 'lost' ? 'Last seen: ' : 'Found at: '}
              {item.where_last_seen || item.where_found || item.location}
            </span>
          </div>
        )}
        
        {/* Date */}
        <div className={`${theme.textMuted} flex items-center gap-2`}>
          <Calendar className="w-4 h-4 text-red-500" />
          <span>
            {(item.mode || item.type) === 'lost' ? 'Lost on: ' : 'Found on: '}
            {item.date_lost || item.date_found || item.date || 'Not specified'}
          </span>
        </div>
        
        {/* Time */}
        {(item.time_lost || item.time_found || item.time) && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <Clock className="w-4 h-4 text-red-500" />
            <span>
              {item.mode === 'lost' ? 'Time lost: ' : 'Time found: '}
              {item.time_lost || item.time_found || item.time}
            </span>
          </div>
        )}
      </div>

      {/* Contact Information */}
      {item.contact_info && Object.keys(item.contact_info).length > 0 && (
        <div className="space-y-2">
          <span className={`text-sm font-medium ${theme.text}`}>Contact:</span>
          <div className="space-y-1">
            {item.contact_info.instagram && (
              <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>@{item.contact_info.instagram}</span>
              </div>
            )}
            {item.contact_info.email && (
              <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
                <Mail className="w-4 h-4 text-blue-500" />
                <span>{item.contact_info.email}</span>
              </div>
            )}
            {item.contact_info.mobile && (
              <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
                <Phone className="w-4 h-4 text-green-500" />
                <span>{item.contact_info.mobile}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {item.status && item.status !== 'active' && (
        <div className={`text-sm font-medium flex items-center gap-1 ${
          item.status === 'resolved' ? 'text-green-600' : 'text-yellow-600'
        }`}>
          <Info className="w-4 h-4" />
          <span>Status: {item.status}</span>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className={`text-xs ${theme.textMuted}`}>
          Posted {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently'}
        </span>
        <div className="flex space-x-1">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(item, 'lostfound')}
            className={`p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors`}
            title="Edit Item"
          >
            <Edit3 className="w-3 h-3 text-red-600" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(item, 'lostfound')}
            className={`p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors`}
            title="Delete Item"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

const EmptyState = ({ selectedListingTab, theme }) => {
  const getEmptyConfig = () => {
    const configs = {
      rooms: { icon: Home, title: 'No rooms listed', subtitle: 'Post your first room', color: 'blue' },
      items: { icon: ShoppingBag, title: 'No items for sale', subtitle: 'List your first item', color: 'green' },
      rides: { icon: Car, title: 'No rides shared', subtitle: 'Share your first ride', color: 'purple' },
      tickets: { icon: Ticket, title: 'No tickets posted', subtitle: 'Sell your first ticket', color: 'orange' },
      lost: { icon: SearchIcon, title: 'No lost items reported', subtitle: 'Report your first lost item', color: 'red' },
      found: { icon: CheckCircle, title: 'No found items reported', subtitle: 'Report your first found item', color: 'emerald' }
    };
    return configs[selectedListingTab] || configs.rooms;
  };
  
  const config = getEmptyConfig();
  const Icon = config.icon;
  
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12">
      <Icon className={`w-16 h-16 text-${config.color}-400 mb-4`} />
      <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>{config.title}</h3>
      <p className={`${theme.textMuted} mb-6`}>{config.subtitle}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-3 bg-${config.color}-500 hover:bg-${config.color}-600 text-white rounded-lg font-medium transition-colors`}
      >
        Get Started
      </motion.button>
    </div>
  );
};

const ProfilePage = () => {
  // Get data from UniShare context
  const { isAuthenticated, user, userInitials, userAvatar, authLoading } = useAuth();
  const { darkMode } = useUI();
  const uniShareContext = useUniShare();
  
  // Debug the context to see what's available
  
  // Safely extract showMessage with a fallback
  const showMessage = uniShareContext?.showMessage || ((message, type) => {
    // Fallback to alert if no context showMessage
    if (type === 'error') {
      alert(`Error: ${message}`);
    } else {
      alert(message);
    }
  });

  // State variables
  const [selectedListingTab, setSelectedListingTab] = useState('rooms');
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  
  // Data states
  const [userRooms, setUserRooms] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [userRides, setUserRides] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [userLostFoundItems, setUserLostFoundItems] = useState([]);

  // Profile data states
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);

  // Messages
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // CRUD Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Image upload states
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Loading states for operations
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Theme configuration
  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-600',
  };

  // Profile user data
  const profileUser = {
    name: user?.name || 'User',
    bio: user?.bio || 'Welcome to UniShare!',
    location: user?.location || 'Campus',
    interests: user?.interests || [],
    socialLinks: user?.socialLinks || {}
  };

  // Optimized user data loading with caching and error handling
  const loadUserData = async () => {
    if (!user?.id) return;
    
    setIsLoadingUserData(true);
    try {
      // Use Promise.allSettled for better error handling and faster parallel requests
      const [roomsResult, itemsResult, ridesResult, ticketsResult, lostFoundResult, profileResult] = await Promise.allSettled([
        fetchMyRooms({ 
          limit: 50, 
          cache: true, 
          cacheTTL: 2 * 60 * 1000 // 2 minute cache
        }),
        fetchMyItems({ 
          limit: 50, 
          cache: true, 
          cacheTTL: 2 * 60 * 1000 
        }),
        getMyRides({ 
          limit: 50, 
          cache: true, 
          cacheTTL: 2 * 60 * 1000 
        }),
        fetchMyTickets({ 
          limit: 50, 
          cache: true, 
          cacheTTL: 2 * 60 * 1000 
        }),
        fetchMyLostFoundItems({ 
          limit: 50, 
          cache: true, 
          cacheTTL: 2 * 60 * 1000 
        }),
        getCurrentUserProfile()
      ]);

      // Handle rooms data with enhanced error reporting
      if (roomsResult.status === 'fulfilled' && roomsResult.value?.success) {
        setUserRooms(roomsResult.value.data || []);
      } else if (roomsResult.status === 'rejected') {
        setUserRooms([]); // Set empty array on failure
      }

      // Handle items data with enhanced error reporting
      if (itemsResult.status === 'fulfilled' && itemsResult.value?.success) {
        setUserItems(itemsResult.value.data || []);
      } else if (itemsResult.status === 'rejected') {
        setUserItems([]);
      }

      // Handle rides data with enhanced error reporting
      if (ridesResult.status === 'fulfilled' && ridesResult.value?.success) {
        setUserRides(ridesResult.value.data || []);
      } else if (ridesResult.status === 'rejected') {
        setUserRides([]);
      }

      // Handle tickets data with enhanced error reporting
      if (ticketsResult.status === 'fulfilled' && ticketsResult.value?.success) {
        setUserTickets(ticketsResult.value.data || []);
      } else if (ticketsResult.status === 'rejected') {
        setUserTickets([]);
      }

      // Handle lost & found data with enhanced error reporting
      if (lostFoundResult.status === 'fulfilled' && lostFoundResult.value?.success) {
        setUserLostFoundItems(lostFoundResult.value.data || []);
      } else if (lostFoundResult.status === 'rejected') {
        setUserLostFoundItems([]);
      }

      // Handle profile data
      if (profileResult.status === 'fulfilled' && profileResult.value?.success) {
        setUserProfile(profileResult.value.data || null);
      } else if (profileResult.status === 'rejected') {
        setUserProfile(null);
      }
      setIsProfileLoading(false);

    } catch (error) {
      // Safe showMessage call
      try {
        showMessage('Failed to load profile data', 'error');
      } catch (msgError) {
        alert('Error: Failed to load profile data');
      }
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // ============== IMAGE HANDLERS ==============

  // Handle image selection for upload
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  // Remove selected image
  const removeSelectedImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreview[index]);
    
    setSelectedImages(newImages);
    setImagePreview(newPreviews);
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    const newExisting = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExisting);
    
    // Update form data to mark image for deletion
    setEditFormData(prev => ({
      ...prev,
      imagesToDelete: [...(prev.imagesToDelete || []), existingImages[index]]
    }));
  };

  // Reset image states when modal closes
  const resetImageStates = () => {
    // Revoke all preview URLs to prevent memory leaks
    imagePreview.forEach(url => URL.revokeObjectURL(url));
    
    setSelectedImages([]);
    setImagePreview([]);
    setExistingImages([]);
  };

  // ============== CRUD HANDLERS ==============

  // Generic edit handler
  const handleEdit = (item, type) => {
    setSelectedItem({ ...item, type });
    
    // Enhanced form data handling for all listing types with contact info
    const formData = {
      ...item,
      // Handle contact info properly for all types
      contact_phone: item.contact_info?.mobile || '',
      contact_email: item.contact_info?.email || '',
      contact_instagram: item.contact_info?.instagram || '',
      contact_link: item.contact_info?.link || '',
      // Ensure contact_info object exists
      contact_info: item.contact_info || {}
    };

    // Special handling for rides
    if (type === 'rides') {
      Object.assign(formData, {
        // Ensure location fields are properly mapped
        from_location: item.from_location || item.from || '',
        to_location: item.to_location || item.to || '',
        from: item.from || item.from_location || '',
        to: item.to || item.to_location || ''
      });
    }

    // Special handling for lost/found items
    if (type === 'lost' || type === 'found' || type === 'lostfound') {
      Object.assign(formData, {
        // Ensure proper field mapping for lost/found
        mode: item.mode || item.type || 'lost',
        type: item.mode || item.type || 'lost',
        title: item.item_name || item.title || item.name || '',
        name: item.item_name || item.title || item.name || '',
        item_name: item.item_name || item.title || item.name || '',
        category: item.category || '',
        reward: item.reward || '',
        // Location fields
        where_last_seen: item.where_last_seen || item.location || '',
        where_found: item.where_found || item.location || '',
        location: item.where_last_seen || item.where_found || item.location || '',
        // Date fields
        date_lost: item.date_lost || item.date || '',
        date_found: item.date_found || item.date || '',
        date: item.date_lost || item.date_found || item.date || '',
        // Time fields
        time_lost: item.time_lost || item.time || '',
        time_found: item.time_found || item.time || '',
        time: item.time_lost || item.time_found || item.time || '',
        // Contact info mapping
        contact_info: item.contact_info || {},
        contact_instagram: item.contact_info?.instagram || '',
        contact_email: item.contact_info?.email || '',
        contact_phone: item.contact_info?.mobile || ''
      });
    }

    setEditFormData(formData);
    
    // Handle existing images for rooms, items, and lost/found
    if (type === 'rooms' && item.photos) {
      const images = Array.isArray(item.photos) ? item.photos : [item.photos];
      setExistingImages(images.filter(Boolean));
    } else if (type === 'rooms' && item.image) {
      setExistingImages([item.image]);
    } else if (type === 'items' && item.image) {
      setExistingImages([item.image]);
    } else if ((type === 'lost' || type === 'found' || type === 'lostfound') && item.image_urls && item.image_urls.length > 0) {
      setExistingImages(item.image_urls);
    } else if ((type === 'lost' || type === 'found' || type === 'lostfound') && (item.image_url || item.image)) {
      setExistingImages([item.image_url || item.image]);
    } else {
      setExistingImages([]);
    }
    
    setIsEditModalOpen(true);
  };

  // Generic delete confirmation handler
  const handleDeleteConfirm = (item, type) => {
    setItemToDelete({ ...item, type });
    setIsDeleteModalOpen(true);
  };

  // Create new item handler
  const handleCreate = (type) => {
    setSelectedItem({ type });
    setEditFormData({});
    setIsCreateModalOpen(true);
  };

  // Submit edit/create
  const handleSubmit = async () => {
    if (!selectedItem) {
      console.error('No selectedItem found');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { type, id } = selectedItem;
      let result;

      if (id) {
        // Edit existing item
        switch (type) {
          case 'rooms':
            // Prepare room data with new images and contact info
            const roomUpdateData = {
              ...editFormData,
              existingImages: existingImages,
              imagesToDelete: editFormData.imagesToDelete || [],
              contact_info: formatContactInfo(editFormData)
            };
            const roomFormData = prepareRoomFormData(roomUpdateData, selectedImages);
            result = await updateRoom(id, roomFormData);
            
            // Update the room in state with the response data
            if (result.success && result.data) {
              setUserRooms(prev => prev.map(room => room.id === id ? result.data : room));
            }
            break;
          
          case 'items':
            const itemUpdateData = {
              ...editFormData,
              contact_info: formatContactInfo(editFormData)
            };
            const itemImageFile = selectedImages.length > 0 ? selectedImages[0] : null;
            result = await updateItem(id, itemUpdateData, itemImageFile);
            if (result.success && result.data) {
              setUserItems(prev => prev.map(item => item.id === id ? result.data : item));
            }
            break;
          
          case 'rides':
            // Validate required fields
            if (!editFormData.from_location && !editFormData.from) {
              throw new Error("Starting location is required");
            }
            if (!editFormData.to_location && !editFormData.to) {
              throw new Error("Destination is required");
            }
            
            // Validate ride date/time is in the future
            if (editFormData.date && editFormData.time) {
              const selectedDateTime = new Date(editFormData.date + " " + editFormData.time);
              if (selectedDateTime <= new Date()) {
                throw new Error("Ride date and time must be in the future");
              }
            }
            
            // Ensure vehicle field is included with proper field mapping
            const vehicleInfo = editFormData.vehicle_info || editFormData.vehicle || '';
            
            // Format contact information properly
            const contactInfo = {};
            if (editFormData.contact_phone) contactInfo.mobile = editFormData.contact_phone;
            if (editFormData.contact_email) contactInfo.email = editFormData.contact_email;
            if (editFormData.contact_instagram) contactInfo.instagram = editFormData.contact_instagram;
            
            const rideUpdateData = {
              ...editFormData,
              // API expects 'from' and 'to' fields for validation
              from: editFormData.from_location || editFormData.from,
              to: editFormData.to_location || editFormData.to,
              // Also keep original field names for compatibility
              from_location: editFormData.from_location || editFormData.from,
              to_location: editFormData.to_location || editFormData.to,
              vehicle: vehicleInfo,
              vehicle_info: vehicleInfo,
              description: editFormData.notes || editFormData.description || editFormData.additional_info || '',
              contact_info: Object.keys(contactInfo).length > 0 ? contactInfo : editFormData.contact_info
            };
            
            result = await updateRide(id, rideUpdateData);
            if (result.success && result.data) {
              setUserRides(prev => prev.map(ride => ride.id === id ? result.data : ride));
            }
            break;
          
          case 'tickets':
            const ticketUpdateData = {
              ...editFormData,
              contact_info: formatContactInfo(editFormData)
            };
            result = await updateTicket(id, ticketUpdateData);
            setUserTickets(prev => prev.map(ticket => ticket.id === id ? { ...ticket, ...ticketUpdateData } : ticket));
            break;
          
          case 'lostfound':
          case 'lost':
          case 'found':
            // Clean and prepare lost/found data for API
            const lostFoundUpdateData = {
              item_name: editFormData.item_name || editFormData.title || editFormData.name || '',
              description: editFormData.description || '',
              mode: editFormData.mode || editFormData.type || 'lost',
              where_last_seen: editFormData.mode === 'lost' ? (editFormData.where_last_seen || editFormData.location) : null,
              where_found: editFormData.mode === 'found' ? (editFormData.where_found || editFormData.location) : null,
              date_lost: editFormData.mode === 'lost' ? (editFormData.date_lost || editFormData.date) : null,
              time_lost: editFormData.mode === 'lost' ? (editFormData.time_lost || editFormData.time) : null,
              date_found: editFormData.mode === 'found' ? (editFormData.date_found || editFormData.date) : null,
              time_found: editFormData.mode === 'found' ? (editFormData.time_found || editFormData.time) : null,
              contact_info: {
                instagram: editFormData.contact_instagram || editFormData.contact_info?.instagram || '',
                email: editFormData.contact_email || editFormData.contact_info?.email || '',
                mobile: editFormData.contact_phone || editFormData.contact_info?.mobile || ''
              },
              reward: editFormData.reward || null,
              status: 'active' // Always set to active, don't send random status values
            };
            
            // Remove null/empty values to avoid API issues
            Object.keys(lostFoundUpdateData).forEach(key => {
              if (lostFoundUpdateData[key] === null || lostFoundUpdateData[key] === '') {
                delete lostFoundUpdateData[key];
              }
            });
            
            // Handle contact_info - remove if empty
            if (lostFoundUpdateData.contact_info && Object.values(lostFoundUpdateData.contact_info).every(val => !val)) {
              delete lostFoundUpdateData.contact_info;
            }
            
            // Handle image uploads for lost/found items
            if (selectedImages.length > 0) {
              // Use FormData approach for image uploads
              result = await updateLostFoundItem(id, lostFoundUpdateData, selectedImages);
            } else {
              // Use regular JSON update
              result = await updateLostFoundItem(id, lostFoundUpdateData);
            }
            setUserLostFoundItems(prev => prev.map(item => item.id === id ? { ...item, ...lostFoundUpdateData } : item));
            break;
        }
        
        // Safe showMessage call
        try {
          showMessage(`${type.slice(0, -1)} updated successfully!`, 'success');
        } catch (msgError) {
          console.error('Error showing success message:', msgError);
        }
        
      } else {
        // Create new item
        switch (type) {
          case 'rooms':
            const roomCreateData = {
              ...editFormData,
              contact_info: formatContactInfo(editFormData)
            };
            const roomCreateFormData = prepareRoomFormData(roomCreateData, selectedImages);
            result = await createRoom(roomCreateFormData);
            if (result.success && result.data) {
              setUserRooms(prev => [result.data, ...prev]);
            }
            break;
          
          case 'items':
            const itemCreateData = {
              ...editFormData,
              contact_info: formatContactInfo(editFormData)
            };
            const itemCreateImageFile = selectedImages.length > 0 ? selectedImages[0] : null;
            result = await createItem(itemCreateData, itemCreateImageFile);
            if (result.success && result.data) {
              setUserItems(prev => [result.data, ...prev]);
            }
            break;
          
          case 'rides':
            // Validate ride date/time is in the future
            if (editFormData.date && editFormData.time) {
              const selectedDateTime = new Date(editFormData.date + " " + editFormData.time);
              if (selectedDateTime <= new Date()) {
                throw new Error("Ride date and time must be in the future");
              }
            }
            
            // Ensure required fields for ride creation with contact info
            const rideCreateData = {
              ...editFormData,
              from: editFormData.from_location || editFormData.from,
              to: editFormData.to_location || editFormData.to,
              seats: editFormData.available_seats || editFormData.seats || 1,
              price: editFormData.price_per_seat || editFormData.price,
              vehicle: editFormData.vehicle || '',
              description: editFormData.notes || editFormData.description || '',
              contact_info: formatContactInfo(editFormData)
            };
            
            result = await createRide(rideCreateData);
            if (result.success && result.data) {
              setUserRides(prev => [result.data, ...prev]);
            }
            break;
          
          case 'tickets':
            const ticketCreateData = {
              ...editFormData,
              contact_info: formatContactInfo(editFormData)
            };
            result = await createTicket(ticketCreateData);
            if (result.success && result.data) {
              setUserTickets(prev => [result.data, ...prev]);
            }
            break;
          
          case 'lostfound':
          case 'lost':
          case 'found':
            // Clean and prepare lost/found data for API
            const lostFoundCreateData = {
              item_name: editFormData.item_name || editFormData.title || editFormData.name || '',
              description: editFormData.description || '',
              mode: editFormData.mode || editFormData.type || 'lost',
              where_last_seen: editFormData.mode === 'lost' ? (editFormData.where_last_seen || editFormData.location) : null,
              where_found: editFormData.mode === 'found' ? (editFormData.where_found || editFormData.location) : null,
              date_lost: editFormData.mode === 'lost' ? (editFormData.date_lost || editFormData.date) : null,
              time_lost: editFormData.mode === 'lost' ? (editFormData.time_lost || editFormData.time) : null,
              date_found: editFormData.mode === 'found' ? (editFormData.date_found || editFormData.date) : null,
              time_found: editFormData.mode === 'found' ? (editFormData.time_found || editFormData.time) : null,
              contact_info: {
                instagram: editFormData.contact_instagram || editFormData.contact_info?.instagram || '',
                email: editFormData.contact_email || editFormData.contact_info?.email || '',
                mobile: editFormData.contact_phone || editFormData.contact_info?.mobile || ''
              },
              reward: editFormData.reward || null,
              status: 'active' // Always set to active for new items
            };
            
            // Remove null/empty values to avoid API issues
            Object.keys(lostFoundCreateData).forEach(key => {
              if (lostFoundCreateData[key] === null || lostFoundCreateData[key] === '') {
                delete lostFoundCreateData[key];
              }
            });
            
            // Handle contact_info - remove if empty
            if (lostFoundCreateData.contact_info && Object.values(lostFoundCreateData.contact_info).every(val => !val)) {
              delete lostFoundCreateData.contact_info;
            }
            
            // Handle image uploads for lost/found items
            const lostFoundImages = selectedImages.length > 0 ? selectedImages : [];
            result = await createLostFoundItem(lostFoundCreateData, lostFoundImages);
            if (result.success && result.data) {
              setUserLostFoundItems(prev => [result.data, ...prev]);
            }
            break;
        }
        
        // Safe showMessage call
        try {
          showMessage(`${type.slice(0, -1)} created successfully!`, 'success');
        } catch (msgError) {
          console.error('Error showing success message:', msgError);
        }
      }

      setIsEditModalOpen(false);
      setIsCreateModalOpen(false);
      setSelectedItem(null);
      setEditFormData({});
      resetImageStates();

    } catch (error) {
      console.error('Submit error:', error);
      
      // Safe showMessage call
      try {
        showMessage(error.message || 'Failed to save changes', 'error');
      } catch (msgError) {
        console.error('Error showing error message:', msgError);
        alert(`Error: ${error.message || 'Failed to save changes'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete item handler
  const handleDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    setError('');

    try {
      const { type, id } = itemToDelete;
      
      switch (type) {
        case 'rooms':
          await deleteRoom(id);
          setUserRooms(prev => prev.filter(room => room.id !== id));
          break;
        
        case 'items':
          await deleteItem(id);
          setUserItems(prev => prev.filter(item => item.id !== id));
          break;
        
        case 'rides':
          await deleteRide(id);
          setUserRides(prev => prev.filter(ride => ride.id !== id));
          break;
        
        case 'tickets':
          await deleteTicket(id);
          setUserTickets(prev => prev.filter(ticket => ticket.id !== id));
          break;
        
        case 'lostfound':
        case 'lost':
        case 'found':
          await deleteLostFoundItem(id);
          setUserLostFoundItems(prev => prev.filter(item => item.id !== id));
          break;
      }

      // Safe showMessage call
      try {
        showMessage(`${type.slice(0, -1)} deleted successfully!`, 'success');
      } catch (msgError) {
        console.error('Error showing success message:', msgError);
      }
      
      setIsDeleteModalOpen(false);
      setItemToDelete(null);

    } catch (error) {
      console.error('Delete error:', error);
      
      // Safe showMessage call
      try {
        showMessage(error.message || 'Failed to delete item', 'error');
      } catch (msgError) {
        console.error('Error showing error message:', msgError);
        alert(`Error: ${error.message || 'Failed to delete item'}`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // ============== PROFILE MANAGEMENT ==============

  // Handle profile edit
  const handleEditProfile = () => {
    setIsProfileEditModalOpen(true);
  };

  // Handle profile save
  const handleProfileSave = async (profileData, profileImage) => {
    setIsUpdatingProfile(true);
    try {
      const result = await updateUserProfile(profileData, profileImage);
      if (result.success) {
        setUserProfile(result.data);
        showMessage('Profile updated successfully!', 'success');
        setIsProfileEditModalOpen(false);
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error; // Re-throw so the modal can handle it
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // ============== END PROFILE MANAGEMENT ==============

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const clearSuccess = () => setSuccess('');
  const clearError = () => setError('');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="mt-4 text-lg text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-xl"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your profile dashboard.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Profile Display Component */}
        <ProfileDisplay 
          userProfile={userProfile}
          user={user}
          onEditProfile={handleEditProfile}
          isLoading={isProfileLoading}
        />

        {/* Modern Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.card} rounded-2xl border ${theme.border} p-1 mb-6`}
        >
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'rooms', label: 'Rooms', icon: Home, count: userRooms?.length || 0, color: 'blue' },
              { id: 'items', label: 'Items', icon: ShoppingBag, count: userItems?.length || 0, color: 'green' },
              { id: 'rides', label: 'Rides', icon: Car, count: userRides.length, color: 'purple' },
              { id: 'tickets', label: 'Tickets', icon: Ticket, count: userTickets.length, color: 'orange' },
              { id: 'lost', label: 'Lost Items', icon: SearchIcon, count: userLostFoundItems.filter(item => item.mode === 'lost').length, color: 'red' },
              { id: 'found', label: 'Found Items', icon: CheckCircle, count: userLostFoundItems.filter(item => item.mode === 'found').length, color: 'emerald' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedListingTab(tab.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedListingTab === tab.id
                    ? `bg-${tab.color}-500 text-white shadow-lg`
                    : `${theme.textMuted} hover:${theme.surface}`
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  selectedListingTab === tab.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        {(error || success) && (
          <div className="mb-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-red-100 border border-red-200 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
                <button onClick={clearError} className="ml-auto">
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-green-100 border border-green-200 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-green-700">{success}</span>
                <button onClick={clearSuccess} className="ml-auto">
                  <X className="w-4 h-4 text-green-500" />
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Content Grid - Instagram Style */}
        <motion.div
          key={selectedListingTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8"
        >
          {isLoadingUserData ? (
            <div className="flex justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 auto-rows-max">
              {selectedListingTab === 'rooms' && (
                userRooms.length > 0 ? (
                  userRooms.map((room) => (
                    <RoomCard key={room.id} room={room} theme={theme} onEdit={handleEdit} onDelete={handleDeleteConfirm} />
                  ))
                ) : (
                  <EmptyState selectedListingTab={selectedListingTab} theme={theme} />
                )
              )}

              {selectedListingTab === 'items' && (
                userItems.length > 0 ? (
                  userItems.map((item) => (
                    <ItemCard key={item.id} item={item} theme={theme} onEdit={handleEdit} onDelete={handleDeleteConfirm} />
                  ))
                ) : (
                  <EmptyState selectedListingTab={selectedListingTab} theme={theme} />
                )
              )}

              {selectedListingTab === 'rides' && (
                userRides.length > 0 ? (
                  userRides.map((ride) => (
                    <RideCard key={ride.id} ride={ride} theme={theme} onEdit={handleEdit} onDelete={handleDeleteConfirm} />
                  ))
                ) : (
                  <EmptyState selectedListingTab={selectedListingTab} theme={theme} />
                )
              )}

              {selectedListingTab === 'tickets' && (
                userTickets.length > 0 ? (
                  userTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} theme={theme} onEdit={handleEdit} onDelete={handleDeleteConfirm} />
                  ))
                ) : (
                  <EmptyState selectedListingTab={selectedListingTab} theme={theme} />
                )
              )}

              {selectedListingTab === 'lost' && (
                userLostFoundItems.filter(item => item.mode === 'lost').length > 0 ? (
                  userLostFoundItems.filter(item => item.mode === 'lost').map((item) => (
                    <LostFoundCard key={item.id} item={item} theme={theme} onEdit={handleEdit} onDelete={handleDeleteConfirm} />
                  ))
                ) : (
                  <EmptyState selectedListingTab={selectedListingTab} theme={theme} />
                )
              )}

              {selectedListingTab === 'found' && (
                userLostFoundItems.filter(item => item.mode === 'found').length > 0 ? (
                  userLostFoundItems.filter(item => item.mode === 'found').map((item) => (
                    <LostFoundCard key={item.id} item={item} theme={theme} onEdit={handleEdit} onDelete={handleDeleteConfirm} />
                  ))
                ) : (
                  <EmptyState selectedListingTab={selectedListingTab} theme={theme} />
                )
              )}
            </div>
          )}
        </motion.div>
      </main>

      <Footer />

      {/* Edit/Create Modal */}
      {(isEditModalOpen || isCreateModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.card} rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${theme.text}`}>
                {selectedItem?.id ? 'Edit' : 'Create'} {selectedItem?.type?.slice(0, -1) || 'Item'}
              </h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setIsCreateModalOpen(false);
                  setSelectedItem(null);
                  setEditFormData({});
                  resetImageStates();
                }}
                className={`text-gray-500 hover:text-gray-700 text-2xl font-bold`}
              >
                ×
              </button>
            </div>

            {/* Dynamic Form Based on Type */}
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              
              {/* Room Form Fields */}
              {selectedItem?.type === 'rooms' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Title *</label>
                      <input
                        type="text"
                        value={editFormData.title || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, title: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Room title"
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Monthly Rent *</label>
                      <input
                        type="number"
                        value={editFormData.rent || editFormData.price || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, rent: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Monthly rent amount"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-1`}>Description *</label>
                    <textarea
                      value={editFormData.description || ''}
                      onChange={(e) => setEditFormData(prev => ({...prev, description: e.target.value}))}
                      className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card} resize-none`}
                      placeholder="Describe your room, amenities, preferences..."
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Location *</label>
                      <input
                        type="text"
                        value={editFormData.location || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, location: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Room location"
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Availability</label>
                      <select
                        value={editFormData.availability || 'available'}
                        onChange={(e) => setEditFormData(prev => ({...prev, availability: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      >
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Bedrooms</label>
                      <input
                        type="number"
                        value={editFormData.bedrooms || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, bedrooms: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Bathrooms</label>
                      <input
                        type="number"
                        value={editFormData.bathrooms || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, bathrooms: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="1"
                      />
                    </div>
                  </div>
                  
                  {/* Image Upload Section */}
                  <div className="space-y-3">
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>Room Images</label>
                    
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div className="space-y-2">
                        <p className={`text-sm ${theme.textMuted}`}>Current Images:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {existingImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Room image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Image Upload */}
                    <div className="space-y-2">
                      <input
                        type="file"
                        id="room-images"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="room-images"
                        className={`block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-400 transition-colors ${theme.border} ${theme.card}`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">📷</div>
                          <p className={`text-sm ${theme.text}`}>
                            Click to upload new images
                          </p>
                          <p className={`text-xs ${theme.textMuted} mt-1`}>
                            PNG, JPG up to 10MB each
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* New Image Previews */}
                    {imagePreview.length > 0 && (
                      <div className="space-y-2">
                        <p className={`text-sm ${theme.textMuted}`}>New Images to Upload:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {imagePreview.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => removeSelectedImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                              <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                New
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Information Section for Rooms */}
                  <div className="space-y-3">
                    <h4 className={`text-sm font-semibold ${theme.text} border-b ${theme.border} pb-2`}>Contact Information</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${theme.text} mb-1`}>Phone Number</label>
                        <input
                          type="tel"
                          value={editFormData.contact_phone || editFormData.contact_info?.mobile || ''}
                          onChange={(e) => setEditFormData(prev => ({
                            ...prev, 
                            contact_phone: e.target.value,
                            contact_info: {
                              ...prev.contact_info,
                              mobile: e.target.value
                            }
                          }))}
                          className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                          placeholder="e.g., +91 9876543210"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium ${theme.text} mb-1`}>Email</label>
                        <input
                          type="email"
                          value={editFormData.contact_email || editFormData.contact_info?.email || ''}
                          onChange={(e) => setEditFormData(prev => ({
                            ...prev, 
                            contact_email: e.target.value,
                            contact_info: {
                              ...prev.contact_info,
                              email: e.target.value
                            }
                          }))}
                          className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                          placeholder="e.g., your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Instagram Handle</label>
                      <input
                        type="text"
                        value={editFormData.contact_instagram || editFormData.contact_info?.instagram || ''}
                        onChange={(e) => setEditFormData(prev => ({
                          ...prev, 
                          contact_instagram: e.target.value,
                          contact_info: {
                            ...prev.contact_info,
                            instagram: e.target.value
                          }
                        }))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="e.g., @your_instagram"
                      />
                    </div>

                    <div className={`text-xs ${theme.textMuted} bg-blue-50 dark:bg-blue-900/20 p-2 rounded`}>
                      <Info className="w-4 h-4 inline mr-1" />
                      Provide contact information so interested tenants can reach you easily.
                    </div>
                  </div>
                </div>
              )}

              {/* Item Form Fields */}
              {selectedItem?.type === 'items' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Item Name *</label>
                      <input
                        type="text"
                        value={editFormData.name || editFormData.title || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, name: e.target.value, title: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Item name"
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Price *</label>
                      <input
                        type="number"
                        value={editFormData.price || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, price: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Item price"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-1`}>Description *</label>
                    <textarea
                      value={editFormData.description || ''}
                      onChange={(e) => setEditFormData(prev => ({...prev, description: e.target.value}))}
                      className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card} h-24`}
                      placeholder="Item description"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Category</label>
                      <select
                        value={editFormData.category || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, category: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      >
                        <option value="">Select category</option>
                        <option value="electronics">Electronics</option>
                        <option value="books">Books</option>
                        <option value="furniture">Furniture</option>
                        <option value="clothing">Clothing</option>
                        <option value="sports">Sports</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Condition</label>
                      <select
                        value={editFormData.condition || 'good'}
                        onChange={(e) => setEditFormData(prev => ({...prev, condition: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      >
                        <option value="new">New</option>
                        <option value="like-new">Like New</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Item Image Upload Section */}
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>Item Images</label>
                    
                    {/* Existing Image Display */}
                    {selectedItem?.image && !selectedImages.length && (
                      <div className="mb-4">
                        <p className={`text-sm ${theme.textMuted} mb-2`}>Current Image:</p>
                        <div className="relative inline-block">
                          <img 
                            src={selectedItem.image} 
                            alt="Current item" 
                            className="w-32 h-32 object-cover rounded-lg border"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg';
                              e.target.onerror = null;
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setExistingImages([]);
                              // You can also call an API to delete the image if needed
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* New Image Upload */}
                    <div className={`border-2 border-dashed rounded-lg p-4 ${theme.border} hover:border-blue-400 transition-colors`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="item-image-upload"
                      />
                      <label 
                        htmlFor="item-image-upload"
                        className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                      >
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className={`text-sm ${theme.textMuted}`}>
                          {selectedImages.length > 0 ? 'Replace Image' : 'Upload New Image'}
                        </span>
                        <span className={`text-xs ${theme.textMuted}`}>PNG, JPG up to 5MB</span>
                      </label>
                    </div>
                    
                    {/* Selected Image Preview */}
                    {selectedImages.length > 0 && (
                      <div className="mt-4">
                        <p className={`text-sm ${theme.textMuted} mb-2`}>New Image Preview:</p>
                        <div className="relative inline-block">
                          <img 
                            src={imagePreview[0]} 
                            alt="New item preview" 
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={removeSelectedImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Information Section for Items */}
                  <div className="space-y-3">
                    <h4 className={`text-sm font-semibold ${theme.text} border-b ${theme.border} pb-2`}>Contact Information</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${theme.text} mb-1`}>Phone Number</label>
                        <input
                          type="tel"
                          value={editFormData.contact_phone || editFormData.contact_info?.mobile || ''}
                          onChange={(e) => setEditFormData(prev => ({
                            ...prev, 
                            contact_phone: e.target.value,
                            contact_info: {
                              ...prev.contact_info,
                              mobile: e.target.value
                            }
                          }))}
                          className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                          placeholder="e.g., +91 9876543210"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium ${theme.text} mb-1`}>Email</label>
                        <input
                          type="email"
                          value={editFormData.contact_email || editFormData.contact_info?.email || ''}
                          onChange={(e) => setEditFormData(prev => ({
                            ...prev, 
                            contact_email: e.target.value,
                            contact_info: {
                              ...prev.contact_info,
                              email: e.target.value
                            }
                          }))}
                          className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                          placeholder="e.g., your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Instagram Handle</label>
                      <input
                        type="text"
                        value={editFormData.contact_instagram || editFormData.contact_info?.instagram || ''}
                        onChange={(e) => setEditFormData(prev => ({
                          ...prev, 
                          contact_instagram: e.target.value,
                          contact_info: {
                            ...prev.contact_info,
                            instagram: e.target.value
                          }
                        }))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="e.g., @your_instagram"
                      />
                    </div>

                    <div className={`text-xs ${theme.textMuted} bg-green-50 dark:bg-green-900/20 p-2 rounded`}>
                      <Info className="w-4 h-4 inline mr-1" />
                      Provide contact information so buyers can reach you to purchase the item.
                    </div>
                  </div>
                </div>
              )}

              {/* Ride Form Fields */}
              {selectedItem?.type === 'rides' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>From Location *</label>
                      <input
                        type="text"
                        value={editFormData.from_location || editFormData.from || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, from_location: e.target.value, from: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Starting location"
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>To Location *</label>
                      <input
                        type="text"
                        value={editFormData.to_location || editFormData.to || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, to_location: e.target.value, to: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Destination"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Date *</label>
                      <input
                        type="date"
                        value={editFormData.date || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, date: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Time *</label>
                      <input
                        type="time"
                        value={editFormData.time || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, time: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Price per Seat *</label>
                      <input
                        type="number"
                        value={editFormData.price_per_seat || editFormData.price || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, price_per_seat: e.target.value, price: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Price per seat"
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Available Seats</label>
                      <input
                        type="number"
                        value={editFormData.available_seats || editFormData.seats || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, available_seats: e.target.value, seats: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Number of seats"
                        min="1"
                        max="8"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-1`}>Vehicle Information *</label>
                    <input
                      type="text"
                      value={editFormData.vehicle_info || editFormData.vehicle || ''}
                      onChange={(e) => setEditFormData(prev => ({
                        ...prev, 
                        vehicle_info: e.target.value,
                        vehicle: e.target.value  // Keep both for API compatibility
                      }))}
                      className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      placeholder="e.g., Honda City, White, MH12AB1234"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-1`}>Additional Information</label>
                    <textarea
                      value={editFormData.notes || editFormData.description || editFormData.additional_info || ''}
                      onChange={(e) => setEditFormData(prev => ({
                        ...prev, 
                        notes: e.target.value, 
                        description: e.target.value,
                        additional_info: e.target.value
                      }))}
                      className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card} h-20`}
                      placeholder="Any additional information about the ride (pickup points, contact preferences, etc.)"
                    />
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-3">
                    <h4 className={`text-sm font-semibold ${theme.text} border-b ${theme.border} pb-2`}>Contact Information</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${theme.text} mb-1`}>Phone Number</label>
                        <input
                          type="tel"
                          value={editFormData.contact_phone || editFormData.contact_info?.mobile || ''}
                          onChange={(e) => setEditFormData(prev => ({
                            ...prev, 
                            contact_phone: e.target.value,
                            contact_info: {
                              ...prev.contact_info,
                              mobile: e.target.value
                            }
                          }))}
                          className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                          placeholder="e.g., +91 9876543210"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium ${theme.text} mb-1`}>Email</label>
                        <input
                          type="email"
                          value={editFormData.contact_email || editFormData.contact_info?.email || ''}
                          onChange={(e) => setEditFormData(prev => ({
                            ...prev, 
                            contact_email: e.target.value,
                            contact_info: {
                              ...prev.contact_info,
                              email: e.target.value
                            }
                          }))}
                          className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                          placeholder="e.g., your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Instagram Handle</label>
                      <input
                        type="text"
                        value={editFormData.contact_instagram || editFormData.contact_info?.instagram || ''}
                        onChange={(e) => setEditFormData(prev => ({
                          ...prev, 
                          contact_instagram: e.target.value,
                          contact_info: {
                            ...prev.contact_info,
                            instagram: e.target.value
                          }
                        }))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="e.g., @your_instagram"
                      />
                    </div>

                    <div className={`text-xs ${theme.textMuted} bg-blue-50 dark:bg-blue-900/20 p-2 rounded`}>
                      <Info className="w-4 h-4 inline mr-1" />
                      Provide at least one contact method so passengers can reach you for ride coordination.
                    </div>
                  </div>
                </div>
              )}

              {/* Ticket Form Fields */}
              {selectedItem?.type === 'tickets' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Event Name *</label>
                      <input
                        type="text"
                        value={editFormData.event_name || editFormData.title || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, event_name: e.target.value, title: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Event name"
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Price *</label>
                      <input
                        type="number"
                        value={editFormData.price || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, price: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Ticket price"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-1`}>Venue *</label>
                    <input
                      type="text"
                      value={editFormData.venue || ''}
                      onChange={(e) => setEditFormData(prev => ({...prev, venue: e.target.value}))}
                      className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      placeholder="Event venue"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Event Date *</label>
                      <input
                        type="date"
                        value={editFormData.event_date || editFormData.date || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, event_date: e.target.value, date: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Event Time</label>
                      <input
                        type="time"
                        value={editFormData.event_time || editFormData.time || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, event_time: e.target.value, time: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-1`}>Description</label>
                    <textarea
                      value={editFormData.description || ''}
                      onChange={(e) => setEditFormData(prev => ({...prev, description: e.target.value}))}
                      className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card} h-20`}
                      placeholder="Event description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={editFormData.quantity || editFormData.quantity_available || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, quantity: e.target.value, quantity_available: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Number of tickets"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Category</label>
                      <select
                        value={editFormData.category || 'event'}
                        onChange={(e) => setEditFormData(prev => ({...prev, category: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      >
                        <option value="event">Event</option>
                        <option value="travel">Travel</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Phone Number</label>
                      <input
                        type="tel"
                        value={editFormData.contact_phone || editFormData.contact_info?.mobile || ''}
                        onChange={(e) => setEditFormData(prev => ({
                          ...prev, 
                          contact_phone: e.target.value,
                          contact_info: {
                            ...prev.contact_info,
                            mobile: e.target.value
                          }
                        }))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="e.g., +91 9876543210"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Email</label>
                      <input
                        type="email"
                        value={editFormData.contact_email || editFormData.contact_info?.email || ''}
                        onChange={(e) => setEditFormData(prev => ({
                          ...prev, 
                          contact_email: e.target.value,
                          contact_info: {
                            ...prev.contact_info,
                            email: e.target.value
                          }
                        }))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="e.g., your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-1`}>Instagram Handle</label>
                    <input
                      type="text"
                      value={editFormData.contact_instagram || editFormData.contact_info?.instagram || ''}
                      onChange={(e) => setEditFormData(prev => ({
                        ...prev, 
                        contact_instagram: e.target.value,
                        contact_info: {
                          ...prev.contact_info,
                          instagram: e.target.value
                        }
                      }))}
                      className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      placeholder="e.g., @your_instagram"
                    />
                  </div>
                </div>
              )}

              {/* Lost & Found Form Fields */}
              {(selectedItem?.type === 'lostfound' || selectedItem?.type === 'lost' || selectedItem?.type === 'found') && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Item Name *</label>
                      <input
                        type="text"
                        value={editFormData.title || editFormData.name || editFormData.item_name || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, title: e.target.value, name: e.target.value, item_name: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Item name"
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Type *</label>
                      <select
                        value={editFormData.mode || editFormData.type || 'lost'}
                        onChange={(e) => setEditFormData(prev => ({...prev, mode: e.target.value, type: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        required
                      >
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-1`}>Description *</label>
                    <textarea
                      value={editFormData.description || ''}
                      onChange={(e) => setEditFormData(prev => ({...prev, description: e.target.value}))}
                      className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card} h-24`}
                      placeholder="Item description"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                        {editFormData.mode === 'lost' ? 'Where Last Seen *' : 'Where Found *'}
                      </label>
                      <input
                        type="text"
                        value={
                          editFormData.mode === 'lost' 
                            ? (editFormData.where_last_seen || editFormData.location || '') 
                            : (editFormData.where_found || editFormData.location || '')
                        }
                        onChange={(e) => setEditFormData(prev => ({
                          ...prev, 
                          [prev.mode === 'lost' ? 'where_last_seen' : 'where_found']: e.target.value,
                          location: e.target.value
                        }))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder={editFormData.mode === 'lost' ? "Where did you last see it?" : "Where did you find it?"}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Date</label>
                      <input
                        type="date"
                        value={
                          editFormData.mode === 'lost' 
                            ? (editFormData.date_lost || editFormData.date || '') 
                            : (editFormData.date_found || editFormData.date || '')
                        }
                        onChange={(e) => setEditFormData(prev => ({
                          ...prev, 
                          [prev.mode === 'lost' ? 'date_lost' : 'date_found']: e.target.value,
                          date: e.target.value
                        }))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Time</label>
                      <input
                        type="time"
                        value={
                          editFormData.mode === 'lost' 
                            ? (editFormData.time_lost || editFormData.time || '') 
                            : (editFormData.time_found || editFormData.time || '')
                        }
                        onChange={(e) => setEditFormData(prev => ({
                          ...prev, 
                          [prev.mode === 'lost' ? 'time_lost' : 'time_found']: e.target.value,
                          time: e.target.value
                        }))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-1`}>Reward (Optional)</label>
                      <input
                        type="number"
                        value={editFormData.reward || ''}
                        onChange={(e) => setEditFormData(prev => ({...prev, reward: e.target.value}))}
                        className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                        placeholder="Amount in ₹"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className={`text-sm font-medium ${theme.text}`}>Contact Information</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${theme.text} mb-1`}>Instagram Handle</label>
                        <input
                          type="text"
                          value={editFormData.contact_instagram || ''}
                          onChange={(e) => setEditFormData(prev => ({
                            ...prev, 
                            contact_instagram: e.target.value,
                            contact_info: {
                              ...prev.contact_info,
                              instagram: e.target.value
                            }
                          }))}
                          className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                          placeholder="@your_instagram"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium ${theme.text} mb-1`}>Email</label>
                          <input
                            type="email"
                            value={editFormData.contact_email || ''}
                            onChange={(e) => setEditFormData(prev => ({
                              ...prev, 
                              contact_email: e.target.value,
                              contact_info: {
                                ...prev.contact_info,
                                email: e.target.value
                              }
                            }))}
                            className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium ${theme.text} mb-1`}>Mobile</label>
                          <input
                            type="tel"
                            value={editFormData.contact_phone || ''}
                            onChange={(e) => setEditFormData(prev => ({
                              ...prev, 
                              contact_phone: e.target.value,
                              contact_info: {
                                ...prev.contact_info,
                                mobile: e.target.value
                              }
                            }))}
                            className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lost/Found Image Upload Section */}
                  <div className="space-y-3">
                    <label className={`block text-sm font-medium ${theme.text} mb-1`}>Item Image</label>
                    
                    {/* Show existing images if available */}
                    {existingImages.length > 0 && !selectedImages.length && (
                      <div className="mb-3">
                        <p className={`text-sm ${theme.textMuted} mb-2`}>Current images:</p>
                        <div className="flex flex-wrap gap-2">
                          {existingImages.map((imageUrl, index) => (
                            <div key={index} className="relative inline-block">
                              <img 
                                src={imageUrl} 
                                alt={`Current item ${index + 1}`} 
                                className="w-24 h-24 object-cover rounded-lg border" 
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  // Remove this specific image from existing images
                                  const newImages = existingImages.filter((_, i) => i !== index);
                                  setExistingImages(newImages);
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Image Upload */}
                    <div className="space-y-2">
                      <input
                        type="file"
                        id="lostfound-image-upload"
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) {
                            setSelectedImages(files.slice(0, 1)); // Only one image for lost/found
                          }
                        }}
                        className="hidden"
                      />
                      <label 
                        htmlFor="lostfound-image-upload" 
                        className={`w-full p-3 border-2 border-dashed rounded-lg ${theme.border} hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors flex items-center justify-center gap-2`}
                      >
                        <Camera className="w-5 h-5" />
                        <span className={theme.text}>
                          {selectedImages.length > 0 ? 'Replace Image' : 'Upload Image'}
                        </span>
                      </label>
                    </div>

                    {selectedImages.length > 0 && (
                      <div className="space-y-2">
                        <div className="relative inline-block">
                          <img 
                            src={URL.createObjectURL(selectedImages[0])} 
                            alt="New upload" 
                            className="w-24 h-24 object-cover rounded-lg border" 
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedImages([])}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsCreateModalOpen(false);
                    setSelectedItem(null);
                    setEditFormData({});
                    resetImageStates();
                  }}
                  className={`px-4 py-2 border rounded-lg hover:bg-gray-50 ${theme.text} ${theme.border}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : (selectedItem?.id ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme.card} rounded-lg p-6 m-4 max-w-md w-full`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${theme.text}`}>
                Delete {itemToDelete?.type?.slice(0, -1) || 'Item'}
              </h2>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
                className={`text-gray-500 hover:text-gray-700 text-xl`}
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <p className={theme.textMuted}>
                Are you sure you want to delete this {itemToDelete?.type?.slice(0, -1)}? This action cannot be undone.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                  }}
                  className={`px-4 py-2 border rounded hover:bg-gray-50 ${theme.text}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isProfileEditModalOpen && (
        <ProfileEditModal
          isOpen={isProfileEditModalOpen}
          onClose={() => setIsProfileEditModalOpen(false)}
          userProfile={userProfile}
          onSave={handleProfileSave}
          isLoading={isUpdatingProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;