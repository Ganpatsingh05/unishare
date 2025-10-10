"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, IndianRupee, Calendar, Bed, Bath, Users, Wifi, Car, Home, Heart, Share2, Phone, Mail, Instagram, ChevronLeft, ChevronRight, Eye, Clock, Shield, CheckCircle } from "lucide-react";
import RequestButton from "../../_components/RequestButton";
import { useUI } from "../../lib/contexts/UniShareContext";
import { fetchRoom } from "../../lib/api";

const RoomDetailPage = () => {
  const { roomId } = useParams();
  const router = useRouter();
  const { darkMode } = useUI();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (roomId) {
      loadRoomDetails();
    }
  }, [roomId]);

  const loadRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchRoom(roomId);
      
      // If API returns data, use it; otherwise use mock data for development
      if (response.success && response.data) {
        setRoom(response.data);
      } else {
        // Fallback mock data for development
        setRoom({
          id: roomId,
          title: "Spacious 2BHK Apartment Near University",
          description: "Beautiful and well-maintained 2BHK apartment located just 5 minutes walk from the university campus. Perfect for students or working professionals. The apartment features modern amenities, fully furnished rooms, and a peaceful environment ideal for studying.",
          rent: 15000,
          location: "University Area",
          landmark: "Near Main Gate",
          beds: 2,
          baths: 1,
          area: "850 sq ft",
          move_in_date: "2025-11-01",
          preferences: "Students/Working Professionals",
          deposit: 30000,
          photos: [
            "/images/house.jpeg",
            "/images/house.jpeg",
            "/images/house.jpeg"
          ],
          amenities: [
            "WiFi",
            "Parking",
            "24/7 Security",
            "Power Backup",
            "Water Supply",
            "Furnished",
            "AC",
            "Kitchen"
          ],
          rules: [
            "No smoking",
            "No pets",
            "Visitors allowed till 10 PM",
            "Maintain cleanliness"
          ],
          contact_info: {
            name: "Rahul Sharma",
            mobile: "+91 98765 43210",
            email: "rahul.sharma@email.com",
            instagram: "@rahul_sharma"
          },
          posted_date: "2025-10-05",
          verified: true,
          rating: 4.5,
          reviews_count: 12
        });
      }
    } catch (err) {
      console.error('Error loading room details:', err);
      // If API fails, still show mock data for development
      setRoom({
        id: roomId,
        title: "Spacious 2BHK Apartment Near University",
        description: "Beautiful and well-maintained 2BHK apartment located just 5 minutes walk from the university campus. Perfect for students or working professionals. The apartment features modern amenities, fully furnished rooms, and a peaceful environment ideal for studying.",
        rent: 15000,
        location: "University Area",
        landmark: "Near Main Gate",
        beds: 2,
        baths: 1,
        area: "850 sq ft",
        move_in_date: "2025-11-01",
        preferences: "Students/Working Professionals",
        deposit: 30000,
        photos: [
          "/images/house.jpeg",
          "/images/house.jpeg",
          "/images/house.jpeg"
        ],
        amenities: [
          "WiFi",
          "Parking",
          "24/7 Security",
          "Power Backup",
          "Water Supply",
          "Furnished",
          "AC",
          "Kitchen"
        ],
        rules: [
          "No smoking",
          "No pets",
          "Visitors allowed till 10 PM",
          "Maintain cleanliness"
        ],
        contact_info: {
          name: "Rahul Sharma",
          mobile: "+91 98765 43210",
          email: "rahul.sharma@email.com",
          instagram: "@rahul_sharma"
        },
        posted_date: "2025-10-05",
        verified: true,
        rating: 4.5,
        reviews_count: 12
      });
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (room?.photos && room.photos.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % room.photos.length);
    }
  };

  const prevImage = () => {
    if (room?.photos && room.photos.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + room.photos.length) % room.photos.length);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleRequestSent = (requestData) => {
    console.log('Room request sent:', requestData);
    const event = new CustomEvent('showMessage', {
      detail: { message: 'Room request sent successfully!', type: 'success' }
    });
    window.dispatchEvent(event);
  };

  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-white',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={theme.text}>Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <Home className={`w-16 h-16 mx-auto mb-4 ${theme.textMuted}`} />
          <h2 className={`text-xl font-semibold mb-2 ${theme.text}`}>Room not found</h2>
          <p className={`mb-4 ${theme.textMuted}`}>The room you are looking for does not exist.</p>
          <button
            onClick={() => router.push('/housing/search')}
            className={`px-4 py-2 rounded-lg ${theme.button} transition-colors`}
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className={`rounded-2xl border ${theme.border} ${theme.card} overflow-hidden`}>
              <div className="relative h-96">
                {room.photos && room.photos.length > 0 ? (
                  <>
                    <img
                      src={room.photos[currentImageIndex]}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                    {room.photos.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {room.photos.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Home className={`w-16 h-16 ${theme.textMuted}`} />
                  </div>
                )}

                {/* Top Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`w-10 h-10 rounded-full ${
                      liked ? 'bg-red-500 text-white' : 'bg-black/50 text-white'
                    } flex items-center justify-center transition-colors`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Verified Badge */}
                {room.verified && (
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Verified
                  </div>
                )}
              </div>
            </div>

            {/* Room Details */}
            <div className={`rounded-2xl border ${theme.border} ${theme.card} p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className={`text-2xl font-bold mb-2 ${theme.text}`}>{room.title}</h1>
                  <div className={`flex items-center gap-2 mb-2 ${theme.textSecondary}`}>
                    <MapPin className="w-4 h-4" />
                    <span>{room.location}</span>
                    {room.landmark && (
                      <span className={theme.textMuted}>• {room.landmark}</span>
                    )}
                  </div>
                  {room.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(room.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </div>
                        ))}
                      </div>
                      <span className={`text-sm ${theme.textMuted}`}>
                        {room.rating} ({room.reviews_count} reviews)
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    ₹{room.rent?.toLocaleString()}
                  </div>
                  <div className={`text-sm ${theme.textMuted}`}>per month</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Bed className={`w-6 h-6 mx-auto mb-1 ${theme.textSecondary}`} />
                  <div className={`font-semibold ${theme.text}`}>{room.beds}</div>
                  <div className={`text-sm ${theme.textMuted}`}>Beds</div>
                </div>
                <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Bath className={`w-6 h-6 mx-auto mb-1 ${theme.textSecondary}`} />
                  <div className={`font-semibold ${theme.text}`}>{room.baths}</div>
                  <div className={`text-sm ${theme.textMuted}`}>Baths</div>
                </div>
                <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Home className={`w-6 h-6 mx-auto mb-1 ${theme.textSecondary}`} />
                  <div className={`font-semibold ${theme.text}`}>{room.area}</div>
                  <div className={`text-sm ${theme.textMuted}`}>Area</div>
                </div>
                <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Calendar className={`w-6 h-6 mx-auto mb-1 ${theme.textSecondary}`} />
                  <div className={`font-semibold text-sm ${theme.text}`}>
                    {formatDate(room.move_in_date)}
                  </div>
                  <div className={`text-sm ${theme.textMuted}`}>Move-in</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-3 ${theme.text}`}>Description</h3>
                <p className={`${theme.textSecondary} leading-relaxed`}>{room.description}</p>
              </div>

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-3 ${theme.text}`}>Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className={`flex items-center gap-2 ${theme.textSecondary}`}>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules */}
              {room.rules && room.rules.length > 0 && (
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${theme.text}`}>House Rules</h3>
                  <div className="space-y-2">
                    {room.rules.map((rule, index) => (
                      <div key={index} className={`flex items-center gap-2 ${theme.textSecondary}`}>
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className={`rounded-2xl border ${theme.border} ${theme.card} p-6 sticky top-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>Contact Owner</h3>
              
              {/* Owner Info */}
              <div className="mb-6">
                <div className={`font-medium ${theme.text} mb-2`}>{room.contact_info?.name}</div>
                <div className={`text-sm ${theme.textMuted} mb-3`}>
                  Posted on {formatDate(room.posted_date)}
                </div>
                
                {/* Contact Methods */}
                <div className="space-y-2">
                  {room.contact_info?.mobile && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className={`text-sm ${theme.textSecondary}`}>{room.contact_info.mobile}</span>
                    </div>
                  )}
                  {room.contact_info?.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className={`text-sm ${theme.textSecondary}`}>{room.contact_info.email}</span>
                    </div>
                  )}
                  {room.contact_info?.instagram && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <span className={`text-sm ${theme.textSecondary}`}>{room.contact_info.instagram}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="flex justify-between items-center mb-2">
                  <span className={theme.textSecondary}>Monthly Rent</span>
                  <span className={`font-semibold ${theme.text}`}>₹{room.rent?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme.textSecondary}>Security Deposit</span>
                  <span className={`font-semibold ${theme.text}`}>₹{room.deposit?.toLocaleString()}</span>
                </div>
              </div>

              {/* Preferences */}
              {room.preferences && (
                <div className="mb-6">
                  <span className={`inline-block text-xs font-medium ${theme.textSecondary} bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full`}>
                    Preferred: {room.preferences}
                  </span>
                </div>
              )}

              {/* Request Button */}
              <RequestButton
                module="rooms"
                itemId={room.id}
                onRequestSent={handleRequestSent}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;