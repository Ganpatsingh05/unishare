"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Phone, Mail, MapPin, Trash2, Pencil, X, Building2, GraduationCap, ShieldAlert, Home, Users, Save, AlertCircle } from "lucide-react";
import AdminGuard from "../_components/AdminGuard";
import AdminLayout from "../_components/AdminLayout";
import { getAllContacts, createContact, updateContact, deleteContact } from "../../lib/api/contacts";

// Mirror categories used on public page
const CATEGORIES = [
  { key: 'emergency', label: 'Emergency', icon: ShieldAlert },
  { key: 'administration', label: 'Administration', icon: Building2 },
  { key: 'academics', label: 'Academics', icon: GraduationCap },
  { key: 'hostel', label: 'Hostel', icon: Home },
  { key: 'student', label: 'Student & Clubs', icon: Users },
];



export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: 'emergency',
    phone: '',
    email: '',
    location: '',
    hours: ''
  });

  // Load contacts from API
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllContacts();
      if (result.success) {
        setContacts(result.contacts);
      } else {
        throw new Error(result.message || 'Failed to load contacts');
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter contacts based on search and category
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const q = (searchTerm || '').toString().toLowerCase();
      const nameStr = String(contact?.name ?? '').toLowerCase();
      const roleStr = String(contact?.role ?? '').toLowerCase();
      // Extract phone for search - handle structured data
      let phoneStr = '';
      if (Array.isArray(contact?.phones) && contact.phones.length > 0) {
        phoneStr = (contact.phones[0]?.number || String(contact.phones[0] || '')).toLowerCase();
      } else if (contact?.phone) {
        phoneStr = String(contact.phone).toLowerCase();
      }

      // Extract email for search - handle structured data  
      let emailStr = '';
      if (Array.isArray(contact?.emails) && contact.emails.length > 0) {
        emailStr = (contact.emails[0]?.address || String(contact.emails[0] || '')).toLowerCase();
      } else if (contact?.email) {
        emailStr = String(contact.email).toLowerCase();
      }

      const matchesSearch = !q ||
        nameStr.includes(q) ||
        roleStr.includes(q) ||
        phoneStr.includes(q) ||
        emailStr.includes(q);

      const matchesCategory = categoryFilter === 'all' || String(contact?.category ?? '') === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [contacts, searchTerm, categoryFilter]);

  // Paginated contacts for display
  const displayedContacts = useMemo(() => filteredContacts.slice(0, displayCount), [filteredContacts, displayCount]);
  const hasMore = filteredContacts.length > displayCount;

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(10);
  }, [searchTerm, categoryFilter]);

  const handleCreate = () => {
    setFormData({
      name: '',
      role: '',
      category: 'emergency',
      phone: '',
      email: '',
      location: '',
      hours: ''
    });
    setEditingContact(null);
    setShowCreateModal(true);
  };

  const handleEdit = (contact) => {
    // Extract phone number from structured data
    let phone = '';
    if (Array.isArray(contact?.phones) && contact.phones.length > 0) {
      phone = contact.phones[0]?.number || String(contact.phones[0] || '');
    } else if (contact?.phone) {
      phone = String(contact.phone);
    }

    // Extract email address from structured data
    let email = '';
    if (Array.isArray(contact?.emails) && contact.emails.length > 0) {
      email = contact.emails[0]?.address || String(contact.emails[0] || '');
    } else if (contact?.email) {
      email = String(contact.email);
    }

    setFormData({
      name: String(contact?.name ?? ''),
      role: String(contact?.role ?? ''),
      category: String(contact?.category ?? 'emergency'),
      phone,
      email,
      location: String(contact?.location ?? ''),
      hours: String(contact?.hours ?? '')
    });
    setEditingContact(contact);
    setShowCreateModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.role.trim()) {
      alert('Please fill in required fields (Name and Role)');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const contactData = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        category: formData.category,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        location: formData.location.trim() || null,
        hours: formData.hours.trim() || null,
        active: true
      };

      let result;
      if (editingContact) {
        result = await updateContact(editingContact.id, contactData);
      } else {
        result = await createContact(contactData);
      }

      if (result.success) {
        await loadContacts(); // Reload contacts from server
        setShowCreateModal(false);
        setEditingContact(null);
        // Reset form
        setFormData({
          name: '',
          role: '',
          category: 'emergency',
          phone: '',
          email: '',
          location: '',
          hours: ''
        });
      }
    } catch (error) {
      console.error('Failed to save contact:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        setError(null);
        const result = await deleteContact(contactId);
        
        if (result.success) {
          await loadContacts(); // Reload contacts from server
        }
      } catch (error) {
        console.error('Failed to delete contact:', error);
        setError(error.message);
      }
    }
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-white">Contacts Directory</h1>
              <p className="text-xs text-gray-400 mt-0.5">Manage campus important contacts displayed publicly.</p>
              {!process.env.NEXT_PUBLIC_BACKEND_URL && (
                <div className="mt-2 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                  Demo mode - Backend not configured
                </div>
              )}
            </div>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus size={14} /> Add Contact
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-500 text-sm"
              />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-2 items-start">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg border text-xs ${
                  categoryFilter === 'all' 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-800 text-gray-300 hover:bg-gray-900'
                }`}
              >
                All
              </button>
              {CATEGORIES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${
                    categoryFilter === key 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-800 text-gray-300 hover:bg-gray-900'
                  }`}
                >
                  {Icon && <Icon size={14} />} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contacts Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  displayedContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{contact.name}</div>
                          <div className="text-sm text-gray-400">{contact.role}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                          {CATEGORIES.find(c => c.key === contact.category)?.label || String(contact.category ?? '')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {(() => {
                          // Handle structured phone objects: {type: "landline", number: "123"}
                          if (Array.isArray(contact.phones) && contact.phones.length > 0) {
                            const phone = contact.phones[0];
                            const phoneNumber = phone?.number || String(phone || '');
                            if (phoneNumber) {
                              return (
                                <a href={`tel:${phoneNumber}`} className="hover:text-blue-400">
                                  {phoneNumber}
                                </a>
                              );
                            }
                          }
                          // Fallback for simple phone field
                          if (contact.phone) {
                            const phoneStr = String(contact.phone);
                            return (
                              <a href={`tel:${phoneStr}`} className="hover:text-blue-400">
                                {phoneStr}
                              </a>
                            );
                          }
                          return null;
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {(() => {
                          // Handle structured email objects: {type: "work", address: "test@example.com"}
                          if (Array.isArray(contact.emails) && contact.emails.length > 0) {
                            const email = contact.emails[0];
                            const emailAddress = email?.address || String(email || '');
                            if (emailAddress) {
                              return (
                                <a href={`mailto:${emailAddress}`} className="hover:text-blue-400">
                                  {emailAddress}
                                </a>
                              );
                            }
                          }
                          // Fallback for simple email field
                          if (contact.email) {
                            const emailStr = String(contact.email);
                            return (
                              <a href={`mailto:${emailStr}`} className="hover:text-blue-400">
                                {emailStr}
                              </a>
                            );
                          }
                          return null;
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {String(contact.location ?? '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(contact)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Show More Button */}
          {!loading && hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={handleShowMore}
                className="px-6 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 text-sm font-medium transition-colors"
              >
                Show More ({filteredContacts.length - displayCount} remaining)
              </button>
            </div>
          )}

          {/* Create/Edit Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-900 rounded-lg border border-gray-800 w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <h2 className="text-lg font-semibold text-white">
                    {editingContact ? 'Edit Contact' : 'Create Contact'}
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-800 text-white placeholder-gray-500"
                      placeholder="Contact name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Role *
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-800 text-white placeholder-gray-500"
                      placeholder="Role or department"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-800 text-white"
                    >
                      {CATEGORIES.map(({ key, label }) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-800 text-white placeholder-gray-500"
                      placeholder="Phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-800 text-white placeholder-gray-500"
                      placeholder="Email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-800 text-white placeholder-gray-500"
                      placeholder="Office location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Hours
                    </label>
                    <input
                      type="text"
                      value={formData.hours}
                      onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-800 text-white placeholder-gray-500"
                      placeholder="Working hours"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-800">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save size={16} />
                    {editingContact ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
