"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Footer from '@components/layout/Footer';
import useIsMobile from '@components/ui/useIsMobile';
import { fetchMarketplaceItems } from '@lib/api/api';
import { useAuth, useMessages, useUI } from '@contexts/UniShareContext';

import MarketplaceHero from '@features/marketplace/components/MarketplaceHero';
import DiscoveryDock from '@features/marketplace/components/DiscoveryDock';
import ExpandableFilterDrawer from '@features/marketplace/components/ExpandableFilterDrawer';
import QuickFilters from '@features/marketplace/components/QuickFilters';
import SegmentedSorting from '@features/marketplace/components/SegmentedSorting';
import BuyProductCard from '@features/marketplace/components/BuyProductCard';
import ProductDetailDrawer from '@features/marketplace/components/ProductDetailDrawer';

export default function MarketplaceBuyPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { error, success, loading, setError, clearError, setLoading } = useMessages();
  const { darkMode, searchValue, setSearchValue } = useUI();
  const isMobile = useIsMobile();

  // Local state
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Filter states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState(null);

  const [category, setCategory] = useState("all");
  const [condition, setCondition] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("recent");

  // Fetch items from backend
  const fetchItems = async () => {
    setLoading(true);
    clearError();
    try {
      const filters = {
        search: searchValue || undefined,
        category: category !== 'all' ? category : undefined,
        condition: condition !== 'all' ? condition : undefined,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
        location: location || undefined,
        sort: sort === 'recent' ? 'created_at' : sort.includes('price') ? 'price' : sort === 'popular' ? 'views' : 'created_at',
        order: sort === 'price-desc' ? 'desc' : sort === 'price-asc' ? 'asc' : 'desc',
        limit: 100
      };

      const result = await fetchMarketplaceItems(filters);
      if (result.success) {
        setItems(result.data || []);
      } else {
        setError(result.error || "Failed to fetch items");
        setItems([]);
      }
    } catch (error) {
      setError(error.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchValue, category, condition, minPrice, maxPrice, location, sort]);

  const handleResetFilters = () => {
    setSearchValue("");
    setCategory("all");
    setCondition("all");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    setSort("recent");
    setActiveQuickFilter(null);
    clearError();
  };

  const handleQuickFilterApply = (filters) => {
    if (filters.sort !== undefined) setSort(filters.sort);
    if (filters.maxPrice !== undefined) setMaxPrice(filters.maxPrice);
    if (filters.location !== undefined) setLocation(filters.location);
    if (filters.category !== undefined) setCategory(filters.category);
  };

  const handleItemClick = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (item) setSelectedItem(item);
  };

  // Mock item counts for dock
  const itemCounts = useMemo(() => {
    return {
      books: 42,
      electronics: 18,
      gaming: 5,
      cycles: 12,
      music: 7,
      hostel: 23,
      sports: 9
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent relative">
      <main className={`relative w-full mx-auto pb-24`}>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* HERO SECTION */}
          <MarketplaceHero 
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setCategory={setCategory}
            darkMode={darkMode}
          />
        </div>

        {/* STICKY DISCOVERY DOCK */}
        <div className="sticky top-16 md:top-20 z-40 px-4 sm:px-6 lg:px-8">
          <DiscoveryDock 
            category={category}
            setCategory={setCategory}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            darkMode={darkMode}
            itemCounts={itemCounts}
          />
        </div>

        {/* EXPANDABLE FILTER DRAWER */}
        <ExpandableFilterDrawer 
          isOpen={isDrawerOpen}
          setIsOpen={setIsDrawerOpen}
          condition={condition} setCondition={setCondition}
          minPrice={minPrice} setMinPrice={setMinPrice}
          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
          location={location} setLocation={setLocation}
          onReset={handleResetFilters}
          darkMode={darkMode}
          isMobile={isMobile}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          
          {/* QUICK FILTERS */}
          <QuickFilters 
            activeQuickFilter={activeQuickFilter}
            setActiveQuickFilter={setActiveQuickFilter}
            applyFilters={handleQuickFilterApply}
            darkMode={darkMode}
          />

          {/* SORTING & HEADER */}
          <SegmentedSorting 
            sort={sort}
            setSort={setSort}
            darkMode={darkMode}
          />

          {/* UNIFIED PRODUCT GRID */}
          <div className="w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                <p className="font-bold text-slate-500">Curating the marketplace...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <img src="/images/cards/boy_sell.png" alt="Empty" className="w-64 h-64 object-contain opacity-70 mb-6 grayscale" />
                <h3 className="text-2xl font-black mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>It looks quiet here...</h3>
                <p className="text-slate-500 max-w-md">Try another category, adjust your filters, or check back later for new items.</p>
                <button onClick={handleResetFilters} className="mt-6 px-6 py-3 bg-indigo-500 text-white font-bold rounded-full hover:bg-indigo-600 transition-colors">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 justify-items-center items-stretch">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      className="w-full max-w-[300px] h-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                    >
                      <BuyProductCard 
                        item={item} 
                        onClick={handleItemClick} 
                        darkMode={darkMode}
                        index={index} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </main>

      <ProductDetailDrawer 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        darkMode={darkMode} 
      />

      <div className="hidden md:block">
        <Footer darkMode={darkMode} />
      </div>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
