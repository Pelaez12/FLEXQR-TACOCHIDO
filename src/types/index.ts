export interface Modifier {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  subtitle?: string;
  required: boolean;
  min?: number;
  max?: number;
  minSelect?: number;
  maxSelect?: number;
  options?: Modifier[];
  modifiers?: Modifier[];
}

export interface MenuItem {
  pricePending?: boolean;
  imageFit?: 'contain' | 'cover';
  imagePosition?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  promoPrice?: number;
  imageUrl: string;
  categoryId?: string;
  badge?: string;
  isPopular?: boolean;
  tags?: string[];
  modifierGroups?: ModifierGroup[];
}

export interface MenuCategory {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
  items: MenuItem[];
}

export interface CartItemModifier {
  groupId?: string;
  groupName?: string;
  modifierId?: string;
  name: string;
  price: number;
}

export interface CartItem {
  key: string;
  id: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl: string;
  modifiers: CartItemModifier[];
  instructions: string;
}

export type ServiceType = 'mesa' | 'takeaway' | 'delivery';

export interface CustomerDetails {
  name: string;
  phone: string;
  district: string;
  address: string;
  reference: string;
  apartment: string;
  city: string;
  addressNumber: string;
  addressType: string;
  building: string;
  floor: string;
  deliveryInstructions: string;
}

export interface SeatingRequest {
  partySize: number;
  extraChairs: number;
}

export interface OrderInfo {
  seating?: SeatingRequest;
  service: ServiceType | null;
  customer: CustomerDetails;
  location: string;
  locationType: 'mesa' | 'barra' | null;
  locationNumber: string | null;
  notes: string;
  lastActive: number;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  total: number;
  totalCount: number;
  serviceCharge: number;
  serviceChargeLabel: string;
}
