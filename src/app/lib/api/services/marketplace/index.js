// Marketplace Service - Buy/sell items APIs
export {
  fetchMarketplaceItems,
  fetchMarketplaceItems as searchMarketplaceItems,
  fetchItem,
  fetchItem as getMarketplaceItemById,
  fetchMyItems,
  fetchMyItems as getMyMarketplaceItems,
  createItem,
  createItem as createMarketplaceItem,
  updateItem,
  updateItem as updateMarketplaceItem,
  deleteItem,
  deleteItem as deleteMarketplaceItem
} from './marketplace.service.js';
