'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Plus, Calendar, MapPin, DollarSign, Ticket, Edit3, Trash2,
  Clock, Badge, Star, Phone, Mail, Instagram, Link2 } from "lucide-react";

// Import API functions
import { 
  fetchMyTickets, 
  createTicket, 
  updateTicket, 
  deleteTicket 
} from "./../../../lib/api/tickets";

// Import contexts
import { useAuth, useUI } from "./../../../lib/contexts/UniShareContext";

// Import components
import Footer from "./../../../_components/layout/Footer";
import SmallFooter from "./../../../_components/layout/SmallFooter";

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

const TicketCard = ({ ticket, theme, onEdit, onDelete, onUpdate, showMessage }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle edit ticket
  const handleEdit = () => {
    if (onEdit) {
      onEdit(ticket, 'tickets');
    } else {
      // Fallback: navigate to edit page
      window.location.href = `/ticket/edit/${ticket.id || ticket._id}`;
    }
  };

  // Handle delete ticket
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${ticket.event_name || ticket.title}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteTicket(ticket.id || ticket._id);
      if (result.success) {
        showMessage?.(result.message || 'Ticket deleted successfully', 'success');
        if (onDelete) {
          onDelete(ticket, 'tickets');
        } else if (onUpdate) {
          onUpdate(); // Refresh the list
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      showMessage?.(error.message || 'Failed to delete ticket', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
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
          onClick={handleEdit}
          disabled={isDeleting}
          className={`p-1 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded transition-colors disabled:opacity-50`}
          title="Edit Ticket"
        >
          <Edit3 className="w-3 h-3 text-orange-600" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          disabled={isDeleting}
          className={`p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50`}
          title={isDeleting ? "Deleting..." : "Delete Ticket"}
        >
          <Trash2 className={`w-3 h-3 text-red-500 ${isDeleting ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>
    </div>
  </motion.div>
  );
};

const MyTicketsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { darkMode } = useUI();
  
  // State
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    event_title: '',
    price: '',
    description: '',
    event_date: '',
    event_time: '',
    venue: '',
    location: '',
    contact_phone: '',
    contact_email: '',
    contact_instagram: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Theme configuration
  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-600',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-50',
    accentDark: darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
  };

  // Message handlers
  const showMessage = (message, type) => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(message);
      setSuccess('');
      setTimeout(() => setError(''), 5000);
    }
  };

  // Load tickets on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadTickets();
    }
  }, [isAuthenticated]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const result = await fetchMyTickets();
      if (result.success) {
        setTickets(result.data || []);
      } else {
        setError(result.message || 'Failed to load tickets');
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle create ticket
  const handleCreate = () => {
    setSelectedTicket(null);
    setFormData({
      title: '',
      event_title: '',
      price: '',
      description: '',
      event_date: '',
      event_time: '',
      venue: '',
      location: '',
      contact_phone: '',
      contact_email: '',
      contact_instagram: ''
    });
    setIsCreateModalOpen(true);
  };

  // Handle edit ticket
  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      title: ticket.title || ticket.event_title || '',
      event_title: ticket.event_title || ticket.title || '',
      price: ticket.price || '',
      description: ticket.description || '',
      event_date: ticket.event_date || ticket.date || '',
      event_time: ticket.event_time || ticket.time || '',
      venue: ticket.venue || ticket.location || '',
      location: ticket.location || ticket.venue || '',
      contact_phone: ticket.contact_info?.mobile || '',
      contact_email: ticket.contact_info?.email || '',
      contact_instagram: ticket.contact_info?.instagram || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (ticket) => {
    setTicketToDelete(ticket);
    setIsDeleteModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare ticket data
      const ticketData = {
        title: formData.title,
        event_title: formData.event_title || formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        event_date: formData.event_date,
        event_time: formData.event_time,
        venue: formData.venue || formData.location,
        location: formData.location || formData.venue,
        contact_info: {
          mobile: formData.contact_phone || '',
          email: formData.contact_email || '',
          instagram: formData.contact_instagram || ''
        }
      };

      // Remove empty contact info
      if (!ticketData.contact_info.mobile && !ticketData.contact_info.email && !ticketData.contact_info.instagram) {
        delete ticketData.contact_info;
      }

      let result;
      if (selectedTicket) {
        // Update existing ticket
        result = await updateTicket(selectedTicket.id, ticketData);
        if (result.success) {
          setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, ...ticketData } : t));
          showMessage('Ticket updated successfully!', 'success');
        }
      } else {
        // Create new ticket
        result = await createTicket(ticketData);
        if (result.success && result.data) {
          setTickets(prev => [result.data, ...prev]);
          showMessage('Ticket created successfully!', 'success');
        }
      }

      if (!result.success) {
        throw new Error(result.message || 'Failed to save ticket');
      }

      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error('Error saving ticket:', error);
      showMessage(error.message || 'Failed to save ticket', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete ticket
  const handleDelete = async () => {
    if (!ticketToDelete) return;

    setIsSubmitting(true);
    try {
      const result = await deleteTicket(ticketToDelete.id);
      if (result.success) {
        setTickets(prev => prev.filter(t => t.id !== ticketToDelete.id));
        showMessage('Ticket deleted successfully!', 'success');
        setIsDeleteModalOpen(false);
        setTicketToDelete(null);
      } else {
        throw new Error(result.message || 'Failed to delete ticket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      showMessage(error.message || 'Failed to delete ticket', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${theme.text} mb-4`}>Please log in to view your tickets</h1>
          <Link href="/login" className="text-blue-600 hover:text-blue-800 underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Header */}
      <div className={`${theme.card} shadow-sm border-b ${theme.border}`}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/profile" 
                className={`flex items-center gap-2 ${theme.textMuted} hover:${theme.text} transition-colors`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Profile</span>
              </Link>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Ticket</span>
            </button>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-2">
              <Ticket className="w-8 h-8 text-blue-600" />
              <h1 className={`text-3xl font-bold ${theme.text}`}>My Tickets</h1>
            </div>
            <p className={`${theme.textMuted}`}>Manage your ticket listings and sales</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Messages */}
        {(error || success) && (
          <div className="mb-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-red-100 border border-red-200 flex items-center gap-3"
              >
                <span className="text-red-700">{error}</span>
                <button onClick={() => setError('')} className="ml-auto text-red-500">×</button>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-green-100 border border-green-200 flex items-center gap-3"
              >
                <span className="text-green-700">{success}</span>
                <button onClick={() => setSuccess('')} className="ml-auto text-green-500">×</button>
              </motion.div>
            )}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={theme.textMuted}>Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <Ticket className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>No Tickets Yet</h3>
            <p className={`${theme.textMuted} mb-6`}>You haven't listed any tickets for sale. Start by creating your first ticket listing.</p>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create First Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onEdit={() => handleEdit(ticket)}
                onDelete={() => handleDeleteConfirm(ticket)}
                theme={theme}
              />
            ))}
          </div>
        )}
      </main>

      <SmallFooter />

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.card} rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${theme.text}`}>
                {selectedTicket ? 'Edit Ticket' : 'Create New Ticket'}
              </h2>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedTicket(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-1`}>Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({...prev, title: e.target.value, event_title: e.target.value}))}
                    className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                    placeholder="Event or ticket title"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-1`}>Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                    className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                    placeholder="Ticket price"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-1`}>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card} resize-none`}
                  placeholder="Event details, ticket information..."
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-1`}>Event Date *</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({...prev, event_date: e.target.value}))}
                    className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-1`}>Event Time</label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData(prev => ({...prev, event_time: e.target.value}))}
                    className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-1`}>Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData(prev => ({...prev, venue: e.target.value, location: e.target.value}))}
                  className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                  placeholder="Event venue"
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className={`text-sm font-medium ${theme.text}`}>Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Phone</label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData(prev => ({...prev, contact_phone: e.target.value}))}
                      className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Email</label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData(prev => ({...prev, contact_email: e.target.value}))}
                      className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Instagram</label>
                  <input
                    type="text"
                    value={formData.contact_instagram}
                    onChange={(e) => setFormData(prev => ({...prev, contact_instagram: e.target.value}))}
                    className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                    placeholder="@your_handle"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedTicket(null);
                  }}
                  className={`px-4 py-2 border rounded-lg hover:bg-gray-50 ${theme.border} ${theme.text}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : (selectedTicket ? 'Update' : 'Create')}
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
              <h2 className={`text-lg font-semibold ${theme.text}`}>Delete Ticket</h2>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setTicketToDelete(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <p className={theme.textMuted}>
                Are you sure you want to delete this ticket listing? This action cannot be undone.
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
                    setTicketToDelete(null);
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
    </div>
  );
};

export default MyTicketsPage;
