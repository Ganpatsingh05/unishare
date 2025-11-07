"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus,
  Tag, 
  MapPin, 
  DollarSign, 
  Star, 
  Edit3,
  Trash2,
  Eye,
  IndianRupee, 
  Calendar, 
  AlertCircle, 
  Loader,
  ArrowLeft,
  Clock,
  Users,
  Ticket,
  ShoppingCart,
  CheckCircle,
  X,
  Phone,
  Instagram,
  Mail,
  Link2
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useIsMobile from "./../../../_components/ui/useIsMobile";
import MarketplaceTicketTheme from "./../../../_components/ServicesTheme/JupiterTheme";
import { fetchMyTickets, deleteTicket, createTicket, updateTicket, formatContactInfo } from "./../../../lib/api";
import { 
  useAuth, 
  useMessages, 
  useUI 
} from "./../../../lib/contexts/UniShareContext";
import { TicketNotifications } from "./../../../lib/utils/actionNotifications";

export default function TicketSellPage() {
  const { isAuthenticated, user } = useAuth();
  const { error, success, loading, setError, clearError, setLoading, showTemporaryMessage } = useMessages();
  const { darkMode } = useUI();
  const isMobile = useIsMobile();

  // Local state
  const [myTickets, setMyTickets] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [deletingTicket, setDeletingTicket] = useState(null);

  // Theme classes using global CSS custom properties and consistent focus states
  const labelClr = "text-secondary";
  const cardBg = darkMode ? "bg-gray-800/60 border-gray-700" : "bg-white/80 border-gray-200";
  const titleClr = "text-primary";
  const subClr = "text-muted";

  // Mock data for user's tickets - replace with actual API call
  const mockMyTickets = [
    {
      id: 1,
      title: "Concert: Taylor Swift - Eras Tour",
      price: 8500,
      event_type: "concert",
      category: "event",
      event_date: "2024-12-15T19:00:00Z",
      venue: "DY Patil Stadium, Mumbai",
      location: "Mumbai",
      quantity_available: 2,
      ticket_type: "Premium",
      description: "Amazing seats in the premium section. Can't attend due to emergency.",
      image_url: "/ticket.png",
      status: "active",
      views: 45,
      inquiries: 8,
      created_at: "2024-10-01T10:00:00Z"
    },
    {
      id: 2,
      title: "Tech Conference 2024",
      price: 2500,
      event_type: "conference",
      category: "event",
      event_date: "2024-11-10T09:00:00Z",
      venue: "Bombay Exhibition Centre",
      location: "Mumbai",
      quantity_available: 1,
      ticket_type: "Early Bird",
      description: "Early bird ticket for the biggest tech conference of the year.",
      status: "sold",
      views: 32,
      inquiries: 12,
      created_at: "2024-09-15T14:30:00Z"
    },
    {
      id: 3,
      title: "Mumbai → Pune AC Bus (Sunday Morning)",
      price: 550,
      event_type: "travel",
      category: "travel",
      event_date: "2024-10-05T06:30:00.000Z",
      venue: "Mumbai → Pune",
      location: "Pune",
      origin: "Mumbai",
      destination: "Pune",
      transport_mode: "bus",
      quantity_available: 1,
      description: "One AC Volvo seat available. Clean bus, on-time operator.",
      status: "active",
      views: 10,
      inquiries: 2,
      created_at: "2024-10-02T09:00:00Z"
    },
    {
      id: 4,
      title: "Online Course Access Code (Data Science)",
      price: 1200,
      event_type: "other",
      category: "other",
      event_date: "2024-12-01T09:00:00.000Z",
      venue: "Digital Item",
      location: "Remote",
      item_type: "Course Access",
      quantity_available: 1,
      description: "Unused access code for a 3-month premium data science course.",
      status: "active",
      views: 5,
      inquiries: 1,
      created_at: "2024-10-02T10:15:00Z"
    }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyTicketData();
    }
  }, [isAuthenticated]);

  const fetchMyTicketData = async () => {
    try {
      setLoading(true);
      const result = await fetchMyTickets();
      if (result.success) {
        setMyTickets(result.data || []);
      } else {
        setMyTickets([]);
        if (result.error) {
          setError(result.error);
        }
      }
      clearError();
    } catch (err) {
      setError("Failed to fetch your tickets");
      console.error("Error fetching tickets:", err);
      setMyTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) {
      return;
    }

    try {
      setDeletingTicket(ticketId);
      const result = await deleteTicket(ticketId);
      if (result.success) {
        setMyTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
        showTemporaryMessage(result.message || "Ticket deleted successfully", "success");
      } else {
        throw new Error(result.message || "Failed to delete ticket");
      }
    } catch (err) {
      setError(err.message || "Failed to delete ticket");
    } finally {
      setDeletingTicket(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: "bg-green-100 text-green-800",
        bgDark: "bg-green-900/30 text-green-400",
        text: "Active"
      },
      sold: {
        bg: "bg-gray-100 text-gray-800",
        bgDark: "bg-gray-900/30 text-gray-400",
        text: "Sold"
      },
      expired: {
        bg: "bg-red-100 text-red-800",
        bgDark: "bg-red-900/30 text-red-400",
        text: "Expired"
      }
    };

    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        darkMode ? config.bgDark : config.bg
      }`}>
        {config.text}
      </span>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        {/* Ticket Jupiter Yellow/Brown/Red Bands Theme */}
        <MarketplaceTicketTheme />
        
        <main className={`relative ${isMobile ? 'px-3 py-4' : 'max-w-4xl mx-auto px-4 py-6 sm:py-10'} text-center`}>
          <div className={`${isMobile ? 'p-6' : 'p-8'} rounded-2xl ${cardBg} border backdrop-blur-sm shadow-xl`}>
            <Ticket className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} mx-auto mb-4 ${titleClr}`} />
            <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-4 ${titleClr}`}>Login Required</h2>
            <p className={`mb-6 ${isMobile ? 'text-sm' : ''} ${subClr}`}>
              You need to be logged in to sell tickets and manage your listings
            </p>
            <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row justify-center'}`}>
              <Link 
                href="/login"
                className={`inline-flex items-center ${isMobile ? 'justify-center' : ''} gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg ${isMobile ? 'py-3 px-4 text-sm' : 'px-6 py-3'}`}
              >
                Login to Continue
              </Link>
              <Link 
                href="/ticket/buy"
                className={`inline-flex items-center ${isMobile ? 'justify-center' : ''} gap-2 border rounded-lg font-medium transition-all ${isMobile ? 'py-3 px-4 text-sm' : 'px-6 py-3'} ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Browse Tickets
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Ticket Jupiter Yellow/Brown/Red Bands Theme */}
        <MarketplaceTicketTheme />
        
        <div className={`relative ${isMobile ? 'px-3 py-4' : 'max-w-6xl mx-auto px-4 py-6 sm:py-10'}`}>
          {/* Header */}
          <div className={`mb-6 ${isMobile ? 'p-4' : 'p-6'} rounded-lg border backdrop-blur-sm ${
            darkMode 
              ? 'bg-slate-900/90 border-slate-800' 
              : 'bg-white/95 border-slate-200'
          }`}>
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} justify-between items-start sm:items-center gap-4`}>
              <div className="flex items-center gap-3">
                <div className={`${isMobile ? 'w-9 h-9' : 'w-10 h-10'} rounded-lg bg-purple-500 flex items-center justify-center`}>
                  <Tag className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
                </div>
                <div>
                  <h2 className={`${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'} font-semibold ${
                    darkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>Sell Event Tickets</h2>
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>Create listings and manage your ticket sales</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 ${isMobile ? 'w-full justify-between' : ''}`}>
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className={`inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2.5'}`}
                >
                  <Plus className="w-4 h-4" /> {isMobile ? 'Create' : 'Create Listing'}
                </button>
                <Link 
                  href="/ticket/buy"
                  className={`inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2.5'}`}
                >
                  <ShoppingCart className="w-4 h-4" /> {isMobile ? 'Browse' : 'Browse Tickets'}
                </Link>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 backdrop-blur-sm">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-green-700 dark:text-green-300">{success}</span>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="w-8 h-8 animate-spin text-blue-500" />
              <span className={`ml-3 ${subClr}`}>Loading your tickets...</span>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-3'} gap-4 mb-6`}>
                {[
                  {
                    label: "Active Listings",
                    value: myTickets.filter(t => t.status === 'active').length,
                    icon: <Ticket className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />,
                    color: "text-blue-600"
                  },
                  {
                    label: "Total Views",
                    value: myTickets.reduce((sum, t) => sum + (t.views || 0), 0),
                    icon: <Eye className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />,
                    color: "text-green-600"
                  },
                  {
                    label: "Total Inquiries",
                    value: myTickets.reduce((sum, t) => sum + (t.inquiries || 0), 0),
                    icon: <Users className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />,
                    color: "text-purple-600"
                  }
                ].map((stat, index) => (
                  <div key={index} className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-700' 
                      : 'bg-white border-slate-200'
                  }`}>
                    <div className={`flex items-center ${isMobile ? 'flex-col gap-2' : 'gap-3'}`}>
                      <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div className={isMobile ? 'text-center' : ''}>
                        <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold ${
                          darkMode ? 'text-slate-100' : 'text-slate-900'
                        }`}>{stat.value}</div>
                        <div className={`text-xs ${isMobile ? '' : 'text-sm'} ${
                          darkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>{isMobile ? stat.label.split(' ')[0] : stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* My Tickets */}
              {myTickets.length === 0 ? (
                <div className="text-center py-16">
                  <Ticket className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} mx-auto mb-4 ${subClr}`} />
                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium mb-2 ${titleClr}`}>No tickets listed yet</h3>
                  <p className={`mb-6 ${isMobile ? 'text-sm' : ''} ${subClr}`}>Create your first ticket listing to get started</p>
                  <button 
                    onClick={() => setShowCreateForm(true)}
                    className={`inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${isMobile ? 'px-4 py-2.5 text-sm' : 'px-6 py-3'}`}
                  >
                    <Plus className="w-4 h-4" /> Create Your First Listing
                  </button>
                </div>
              ) : (
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 lg:grid-cols-2 gap-6'}`}>
                  {myTickets.map((ticket) => (
                    <div key={ticket.id} className={`${isMobile ? 'p-4' : 'p-6'} rounded-2xl ${cardBg} border backdrop-blur-sm hover:shadow-lg transition-shadow shadow-xl`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold ${titleClr} line-clamp-2`}>{ticket.title}</h3>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'} mb-3`}>
                            <div className="flex items-center gap-1">
                              <IndianRupee className={`w-4 h-4 ${subClr}`} />
                              <span className={`font-medium ${titleClr} ${isMobile ? 'text-sm' : ''}`}>₹{ticket.price.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className={`w-4 h-4 ${subClr}`} />
                              <span className={`${subClr} ${isMobile ? 'text-xs' : ''}`}>{new Date(ticket.event_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <MapPin className={`w-4 h-4 ${subClr}`} />
                            <span className={`${subClr} ${isMobile ? 'text-xs' : ''} line-clamp-1`}>{ticket.venue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-4'} mb-4 text-sm`}>
                        <div className="flex items-center gap-1">
                          <Eye className={`w-4 h-4 ${subClr}`} />
                          <span className={`${subClr} ${isMobile ? 'text-xs' : ''}`}>{ticket.views || 0} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className={`w-4 h-4 ${subClr}`} />
                          <span className={`${subClr} ${isMobile ? 'text-xs' : ''}`}>{ticket.inquiries || 0} inquiries</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className={`flex items-center gap-2 ${isMobile ? 'flex-col' : ''}`}>
                        <button 
                          onClick={() => setEditingTicket(ticket)}
                          className={`${isMobile ? 'w-full' : 'flex-1'} px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            darkMode 
                              ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Edit3 className="w-4 h-4 inline mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteTicket(ticket.id)}
                          disabled={deletingTicket === ticket.id}
                          className={`${isMobile ? 'w-full' : ''} px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors disabled:opacity-50`}
                        >
                          {deletingTicket === ticket.id ? (
                            <Loader className="w-4 h-4 animate-spin inline mr-1" />
                          ) : (
                            <Trash2 className="w-4 h-4 inline mr-1" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create/Edit Form Modal (inlined) */}
      {(showCreateForm || editingTicket) && (
        <TicketCreateModal
          darkMode={darkMode}
          onClose={() => { setShowCreateForm(false); setEditingTicket(null); }}
          onTicketCreated={() => { fetchMyTicketData(); setShowCreateForm(false); setEditingTicket(null); }}
          editingTicket={editingTicket}
          isAuthenticated={isAuthenticated}
          showTemporaryMessage={showTemporaryMessage}
          setError={setError}
          clearError={clearError}
          error={error}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </>
  );
}

// Inlined TicketCreateModal with category support (event, travel, other)
function TicketCreateModal({ onClose, onTicketCreated, editingTicket, darkMode, isAuthenticated, showTemporaryMessage, setError, clearError, error, loading, setLoading }) {
  const labelClr = "text-secondary";
  const inputStyles = darkMode 
    ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500 focus:ring-yellow-400/30 focus:border-yellow-400" 
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-500/30 focus:border-blue-500";
  const titleClr = "text-primary";
  const cardBg = "glass-card";
  const dropBorder = darkMode ? "border-gray-800" : "border-gray-300";

  const [category, setCategory] = useState('event');
  const [title, setTitle] = useState(editingTicket?.title || "");
  const [price, setPrice] = useState(editingTicket?.price?.toString() || "");
  const [eventType, setEventType] = useState(editingTicket?.event_type || "concert");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [venue, setVenue] = useState(editingTicket?.venue || "");
  const [location, setLocation] = useState(editingTicket?.location || "");
  const [quantityAvailable, setQuantityAvailable] = useState(editingTicket?.quantity_available?.toString() || "1");
  const [ticketType, setTicketType] = useState(editingTicket?.ticket_type || "Standard");
  const [description, setDescription] = useState(editingTicket?.description || "");
  const [contacts, setContacts] = useState([{ id: 1, type: 'mobile', value: '' }]);
  // Travel
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelTime, setTravelTime] = useState('');
  const [transportMode, setTransportMode] = useState('bus');
  // Other
  const [itemType, setItemType] = useState('General');
  useEffect(() => {
    if (!eventDate) { const t = new Date(); t.setDate(t.getDate()+1); setEventDate(t.toISOString().split('T')[0]); }
    if (!travelDate) { const t = new Date(); t.setDate(t.getDate()+1); setTravelDate(t.toISOString().split('T')[0]); }
  }, [eventDate, travelDate]);
  
  // Populate form when editing
  useEffect(() => {
    if (editingTicket) {
      setCategory(editingTicket.category || 'event');
      setTitle(editingTicket.title || '');
      setPrice(editingTicket.price?.toString() || '');
      setEventType(editingTicket.event_type || 'concert');
      setVenue(editingTicket.venue || '');
      setLocation(editingTicket.location || '');
      setQuantityAvailable(editingTicket.quantity_available?.toString() || '1');
      setTicketType(editingTicket.ticket_type || 'Standard');
      setDescription(editingTicket.description || '');
      setOrigin(editingTicket.origin || '');
      setDestination(editingTicket.destination || '');
      setTransportMode(editingTicket.transport_mode || 'bus');
      setItemType(editingTicket.item_type || 'General');
      
      // Handle dates
      if (editingTicket.event_date) {
        const date = new Date(editingTicket.event_date);
        setEventDate(date.toISOString().split('T')[0]);
        setEventTime(date.toISOString().split('T')[1]?.slice(0, 5) || '');
      }
      if (editingTicket.travel_date) {
        const date = new Date(editingTicket.travel_date);
        setTravelDate(date.toISOString().split('T')[0]);
        setTravelTime(date.toISOString().split('T')[1]?.slice(0, 5) || '');
      }
      
      // Handle contacts
      if (editingTicket.contact_info && typeof editingTicket.contact_info === 'object') {
        const contactsArray = Object.entries(editingTicket.contact_info).map(([type, value], index) => ({
          id: index + 1,
          type,
          value
        }));
        setContacts(contactsArray.length > 0 ? contactsArray : [{id: 1, type: 'mobile', value: ''}]);
      }
      

    }
  }, [editingTicket]);

  const iconForType = (type) => ({mobile:Phone, instagram:Instagram, email:Mail, link:Link2}[type] || Link2);
  const placeholderForType = (type) => ({mobile:'+91 98765 43210', instagram:'@username', email:'name@university.edu', link:'https://...'}[type] || '');
  const addContact = () => setContacts(p=>[...p,{id:Date.now(), type:'mobile', value:''}]);
  const updateContact = (idx, field, value) => setContacts(p=>p.map((c,i)=> i===idx?{...c,[field]:value}:c));
  const removeContact = (id) => setContacts(p=>p.filter(c=>c.id!==id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isAuthenticated){ setError('Please log in to create a ticket listing'); return; }
    setLoading(true); clearError();
    try {
      if(!title.trim()) throw new Error('Title is required');
      if(!price || isNaN(price) || parseFloat(price)<=0) throw new Error('Valid price is required');
      if(!quantityAvailable || parseInt(quantityAvailable)<=0) throw new Error('Valid quantity is required');
      if(category==='event'){ if(!venue.trim()) throw new Error('Venue is required'); if(!location.trim()) throw new Error('City is required'); if(!eventDate) throw new Error('Event date is required'); }
      if(category==='travel'){ if(!origin.trim()) throw new Error('Origin is required'); if(!destination.trim()) throw new Error('Destination is required'); if(!travelDate) throw new Error('Travel date is required'); }
      if(category==='other'){ if(!location.trim()) throw new Error('Location/City is required'); }
      const dt = (d,t) => t? `${d}T${t}:00.000Z` : `${d}T09:00:00.000Z`;
      const eventDateTime = dt(eventDate, eventTime);
      const travelDateTime = dt(travelDate, travelTime);
      const contactInfo = formatContactInfo(contacts);
      if(Object.keys(contactInfo).length===0) throw new Error('At least one contact method is required');
      const base = { title:title.trim(), price:parseFloat(price), category, quantity_available:parseInt(quantityAvailable), description:description.trim(), contact_info:contactInfo };
      let payload = {...base};
      if(category==='event'){ 
        payload = {...payload, event_type:eventType, event_date:eventDateTime, venue:venue.trim(), location:location.trim(), ticket_type:ticketType}; 
      }
      else if(category==='travel'){ 
        payload = {...payload, origin:origin.trim(), destination:destination.trim(), travel_date:travelDateTime, transport_mode:transportMode, event_date:travelDateTime, venue:`${origin.trim()} → ${destination.trim()}`, location:destination.trim(), event_type:'travel'}; 
      }
      else { 
        payload = {...payload, item_type:itemType, location:location.trim(), event_type:'other', event_date:eventDateTime || new Date().toISOString()}; 
      }
      let result;
      if (editingTicket) {
        // Update existing ticket
        result = await updateTicket(editingTicket.id, payload);
        if(result.success){ 
          // Show Dynamic Island notification
          TicketNotifications.ticketUpdated();
          
          showTemporaryMessage(`Listing "${result.data.title}" updated!`, true, 3500); 
          handleReset(); 
          onTicketCreated && onTicketCreated(result.data); 
          setTimeout(()=> onClose(), 1200); 
        }
        else { throw new Error(result.message || 'Failed to update listing'); }
      } else {
        // Create new ticket
        result = await createTicket(payload);
        if(result.success){ 
          // Show Dynamic Island notification
          TicketNotifications.ticketListed(result.data.title);
          
          showTemporaryMessage(`Listing "${result.data.title}" created!`, true, 3500); 
          handleReset(); 
          onTicketCreated && onTicketCreated(result.data); 
          setTimeout(()=> onClose(), 1200); 
        }
        else { throw new Error(result.message || 'Failed to create listing'); }
      }
    } catch(err){ setError(err.message); } finally { setLoading(false); }
  };

  const handleReset = () => {
    setCategory('event'); setTitle(''); setPrice(''); setEventType('concert'); setEventDate(''); setEventTime(''); setVenue(''); setLocation(''); setQuantityAvailable('1'); setTicketType('Standard'); setDescription(''); setContacts([{id:1,type:'mobile',value:''}]); setOrigin(''); setDestination(''); setTravelDate(''); setTravelTime(''); setTransportMode('bus'); setItemType('General'); clearError();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className={`max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${cardBg} p-6 m-4`} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center"><Ticket className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>
                {editingTicket ? 'Edit Ticket Listing' : 'Create Ticket Listing'}
              </h2>
              <p className="text-sm text-muted">
                {editingTicket ? 'Update your ticket listing' : 'Sell event, travel or other tickets'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800':'hover:bg-gray-100'}`}><X className="w-5 h-5" /></button>
        </div>
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-500" /><span className="text-red-500">{error}</span><button onClick={clearError} className="ml-auto"><X className="w-4 h-4 text-red-500" /></button></div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Category *</label>
            <select value={category} onChange={e=>setCategory(e.target.value)} className={`w-full px-4 py-3 rounded-lg border ${inputStyles}`}>
              <option value="event">Event</option>
              <option value="travel">Travel</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>{category==='travel' ? 'Trip Title *':'Title *'}</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder={category==='travel'? 'e.g., Mumbai to Pune Weekend Ride':'e.g., Concert: XYZ Live'} className={`w-full px-4 py-3 rounded-lg border ${inputStyles}`} required />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Price per {category==='travel' ? 'Seat/Ticket':'Ticket'} *</label>
            <div className="relative">
              <IndianRupee className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={price} onChange={e=>setPrice(e.target.value.replace(/[^0-9.]/g,''))} placeholder="250" className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles}`} required />
            </div>
          </div>
          {category==='event' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Event Type *</label>
              <select value={eventType} onChange={e=>setEventType(e.target.value)} className={`w-full px-4 py-3 rounded-lg border ${inputStyles}`} required>
                <option value="concert">Concert</option>
                <option value="sports">Sports</option>
                <option value="comedy">Comedy</option>
                <option value="theater">Theater</option>
                <option value="conference">Conference</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}
          {category==='travel' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Transport Mode *</label>
              <select value={transportMode} onChange={e=>setTransportMode(e.target.value)} className={`w-full px-4 py-3 rounded-lg border ${inputStyles}`} required>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="flight">Flight</option>
                <option value="carpool">Car / Ride Share</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}
          {category==='other' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Item Type</label>
              <input value={itemType} onChange={e=>setItemType(e.target.value)} className={`w-full px-4 py-3 rounded-lg border ${inputStyles}`} />
            </div>
          )}
          {category==='event' && (<>
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Event Date *</label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles}`} min={new Date().toISOString().split('T')[0]} required />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Event Time</label>
              <div className="relative">
                <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="time" value={eventTime} onChange={e=>setEventTime(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles}`} />
              </div>
            </div>
          </>)}
          {category==='travel' && (<>
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Travel Date *</label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" value={travelDate} onChange={e=>setTravelDate(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles}`} min={new Date().toISOString().split('T')[0]} required />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Travel Time</label>
              <div className="relative">
                <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="time" value={travelTime} onChange={e=>setTravelTime(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles}`} />
              </div>
            </div>
          </>)}
          {category==='event' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Venue *</label>
              <input value={venue} onChange={e=>setVenue(e.target.value)} placeholder="e.g., Stadium / Hall" className={`w-full px-4 py-3 rounded-lg border ${inputStyles}`} required />
            </div>
          )}
          {category==='travel' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Origin *</label>
              <input value={origin} onChange={e=>setOrigin(e.target.value)} placeholder="Start city / point" className={`w-full px-4 py-3 rounded-lg border ${inputStyles}`} required />
            </div>
          )}
          {category==='travel' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Destination *</label>
              <input value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Destination city" className={`w-full px-4 py-3 rounded-lg border ${inputStyles}`} required />
            </div>
          )}
          {category==='event' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>City *</label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="City" className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles}`} required />
              </div>
            </div>
          )}
          {category==='other' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Location / City *</label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="City" className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles}`} required />
              </div>
            </div>
          )}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>{category==='travel' ? 'Seats Available *':'Tickets Available *'}</label>
            <div className="relative">
              <Users className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" min="1" max="50" value={quantityAvailable} onChange={e=>setQuantityAvailable(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles}`} required />
            </div>
          </div>
          {category==='event' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Ticket Type</label>
              <select value={ticketType} onChange={e=>setTicketType(e.target.value)} className={`w-full px-4 py-3 rounded-lg border ${inputStyles}`}>
                <option value="General">General</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
                <option value="Front Row">Front Row</option>
              </select>
            </div>
          )}
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Additional Details</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4} placeholder={category==='travel' ? 'Any luggage rules, meeting point, flexibility...' : 'Describe seats, reason for selling...'} className={`w-full px-4 py-3 rounded-lg border ${inputStyles} resize-none`} />
          </div>
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-3"><label className={`text-sm font-medium ${labelClr}`}>Contact Information *</label><button type="button" onClick={addContact} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Plus className="w-4 h-4" /> Add Contact</button></div>
            <div className="space-y-4">
              {contacts.map((contact, idx) => { const Icon = iconForType(contact.type); return (
                <div key={contact.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-800':'bg-gray-50 border-gray-200'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select value={contact.type} onChange={e=>updateContact(idx,'type',e.target.value)} className={`px-4 py-3 rounded-lg border ${inputStyles}`}>
                      <option value="mobile">Mobile</option>
                      <option value="instagram">Instagram</option>
                      <option value="email">Email</option>
                      <option value="link">Link</option>
                    </select>
                    <div className="sm:col-span-2 relative">
                      <Icon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={contact.value} onChange={e=>updateContact(idx,'value',e.target.value)} placeholder={placeholderForType(contact.type)} className={`w-full pl-10 ${contacts.length>1?'pr-12':'pr-4'} py-3 rounded-lg border ${inputStyles}`} />
                      {contacts.length>1 && (<button type="button" onClick={()=>removeContact(contact.id)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 transition-colors" title="Remove contact"><Trash2 className="w-4 h-4" /></button>)}
                    </div>
                  </div>
                </div>
              );})}
            </div>
          </div>
          <div className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-3 pt-4">
            <button type="submit" disabled={loading} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">{loading ? (<><Loader className="w-5 h-5 animate-spin" /> Saving...</>) : (editingTicket ? 'Update Listing' : 'Create Listing')}</button>
            <button type="button" onClick={handleReset} disabled={loading} className={`w-full sm:w-auto px-6 py-3 rounded-lg border font-medium transition-colors disabled:opacity-50 ${darkMode?'border-gray-700 text-gray-200 hover:bg-gray-800':'border-gray-300 text-gray-800 hover:bg-gray-100'}`}>Reset</button>
            <button type="button" onClick={onClose} disabled={loading} className={`w-full sm:w-auto px-6 py-3 rounded-lg border font-medium transition-colors disabled:opacity-50 ${darkMode?'border-gray-700 text-gray-200 hover:bg-gray-800':'border-gray-300 text-gray-800 hover:bg-gray-100'}`}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
