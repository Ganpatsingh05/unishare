"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft,
  MapPin, 
  Calendar, 
  Phone, 
  Instagram, 
  Mail, 
  Link2, 
  Star,
  ImageIcon,
  IndianRupee,
  AlertCircle,
  Loader
} from "lucide-react";
import SmallFooter from "./../../../../_components/layout/SmallFooter";
import MarketplaceBuyTheme from "./../../../../_components/ServicesTheme/VenusTheme";
import RequestButton from "./../../../../_components/forms/RequestButton";
import useIsMobile from "./../../../../_components/ui/useIsMobile";
import { fetchItem } from "./../../../../lib/api";
import { 
  useAuth, 
  useMessages, 
  useUI 
} from "./../../../../lib/contexts/UniShareContext";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { error, setError, clearError, setLoading } = useMessages();
  const { darkMode } = useUI();
  const isMobile = useIsMobile();

  const [item, setItem] = useState(null);
  const [loading, setItemLoading] = useState(true);

  // Theme classes
  const cardBg = darkMode ? "bg-gray-950 border-gray-900" : "bg-white border-gray-200";
  const titleClr = darkMode ? "text-white" : "text-gray-900";
  const subClr = darkMode ? "text-gray-400" : "text-gray-600";

  // Fetch item details
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!params.itemId) return;
      
      console.log('🔄 Fetching item details for ID:', params.itemId);
      setItemLoading(true);
      clearError();
      setItem(null); // Clear previous item data
      
      try {
        // Fetch specific item by ID using dedicated endpoint
        const result = await fetchItem(params.itemId);
        
        if (result.success && result.data) {
          console.log('✅ Item fetched successfully:', result.data.title);
          setItem(result.data);
        } else {
          console.log('❌ Item not found');
          setError("Item not found");
        }
      } catch (error) {
        console.error('❌ Error fetching item:', error);
        setError(error.message || "Failed to fetch item details");
      } finally {
        setItemLoading(false);
      }
    };

    fetchItemDetails();
  }, [params.itemId]); // Removed clearError from dependencies to prevent infinite loop

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getContactIcon = (type) => {
    switch (type) {
      case 'mobile': return Phone;
      case 'instagram': return Instagram;
      case 'email': return Mail;
      case 'link': return Link2;
      default: return Link2;
    }
  };

  const formatContactValue = (type, value) => {
    switch (type) {
      case 'mobile': return value;
      case 'instagram': return value.startsWith('@') ? value : `@${value}`;
      case 'email': return value;
      case 'link': return value;
      default: return value;
    }
  };

  const handleRequestSent = (requestData) => {
    console.log('Purchase request sent:', requestData);
    // Show success message and optionally redirect
    const event = new CustomEvent('showMessage', {
      detail: { message: 'Purchase request sent successfully!', type: 'success' }
    });
    window.dispatchEvent(event);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* Marketplace Buy Venus Golden Brown Theme */}
        <MarketplaceBuyTheme />
        <div className="relative text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
          <p className={`text-sm ${subClr}`}>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* Marketplace Buy Venus Golden Brown Theme */}
        <MarketplaceBuyTheme />
        <div className="relative text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className={`text-2xl font-bold mb-2 ${titleClr}`}>Item Not Found</h1>
          <p className={`mb-6 ${subClr}`}>{error || "The item you're looking for doesn't exist."}</p>
          <button 
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div key={params.itemId} className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Marketplace Buy Venus Golden Brown Theme */}
      <MarketplaceBuyTheme />
      

      <div className={`relative ${isMobile ? 'px-4 pt-20 pb-8' : 'max-w-7xl mx-auto px-6 pt-24 pb-16'}`}>
        
        {/* Product Layout - Split Design */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-1 lg:grid-cols-2 gap-12'} items-start`}>
          
          {/* Left Column - Image Section */}
          <div className="space-y-6">
            {/* Main Product Image */}
            <div className="relative group">
              <div className={`w-full ${isMobile ? 'h-80' : 'h-96 lg:h-[500px]'} rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br ${darkMode ? 'from-gray-800 to-gray-900' : 'from-gray-100 to-gray-200'}`}>
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : item.photos && item.photos.length > 0 ? (
                  <img
                    src={item.photos[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No image available</p>
                    </div>
                  </div>
                )}
                
                {/* Condition Badge Overlay */}
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md border ${
                    item.condition === 'new' ? 'bg-green-500/90 text-white border-green-400' :
                    item.condition === 'like-new' ? 'bg-blue-500/90 text-white border-blue-400' :
                    item.condition === 'good' ? 'bg-yellow-500/90 text-white border-yellow-400' :
                    item.condition === 'fair' ? 'bg-orange-500/90 text-white border-orange-400' :
                    'bg-red-500/90 text-white border-red-400'
                  } shadow-lg`}>
                    {item.condition}
                  </span>
                </div>
              </div>
            </div>

            {/* Image Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg`}>
                <MapPin className="w-5 h-5 text-purple-500 mb-2" />
                <p className={`text-xs ${subClr} uppercase tracking-wide font-medium`}>Location</p>
                <p className={`font-bold ${titleClr}`}>{item.location}</p>
              </div>
              <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg`}>
                <Calendar className="w-5 h-5 text-blue-500 mb-2" />
                <p className={`text-xs ${subClr} uppercase tracking-wide font-medium`}>Available</p>
                <p className={`font-bold ${titleClr}`}>{formatDate(item.available_from)}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-8">
            
            {/* Header Section */}
            <div className="space-y-6">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  {item.category}
                </span>
                <h1 className={`text-4xl lg:text-5xl font-bold leading-tight ${titleClr} mb-4`}>
                  {item.title}
                </h1>
              </div>

              {/* Price Section */}
              <div className="flex items-baseline gap-2">
                <IndianRupee className="w-8 h-8 text-emerald-500" />
                <span className="text-5xl font-bold text-emerald-500">{item.price}</span>
                <span className={`text-lg ${subClr} ml-2`}>only</span>
              </div>
            </div>

            {/* Description Card */}
            {item.description && (
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg`}>
                <h3 className={`text-xl font-bold mb-4 ${titleClr}`}>About this item</h3>
                <p className={`leading-relaxed ${subClr} text-base`}>{item.description}</p>
              </div>
            )}

            {/* Seller Card */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${titleClr}`}>Seller Information</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {(item.users?.name || 'A').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${titleClr}`}>{item.users?.name || 'Anonymous'}</p>
                    <p className={`text-sm ${subClr}`}>Posted {formatDate(item.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {item.contact_info && Object.keys(item.contact_info).length > 0 && (
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg`}>
                <h3 className={`text-xl font-bold mb-4 ${titleClr}`}>Contact Details</h3>
                <div className="space-y-3">
                  {Object.entries(item.contact_info).map(([type, value]) => {
                    const Icon = getContactIcon(type);
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Icon size={16} className="text-white" />
                        </div>
                        <div>
                          <p className={`text-xs ${subClr} uppercase tracking-wide font-medium`}>{type}</p>
                          <p className={`font-bold ${titleClr}`}>{formatContactValue(type, value)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <RequestButton
                module="itemsell"
                itemId={item.id}
                onRequestSent={handleRequestSent}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              />
              <button 
                className={`px-6 py-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-50 text-gray-700'} shadow-lg hover:shadow-xl`}
                title="Add to favorites"
              >
                <Star className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    
    <div className="hidden md:block">
    <SmallFooter />
    </div>


    </div>
  );
}
