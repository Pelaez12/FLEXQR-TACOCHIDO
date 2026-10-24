// Cargar únicamente productos, categorías y precios confirmados por Taco Chido.
// imageUrl: ruta de una foto en public/carta/, por ejemplo /carta/foto.webp.
export interface CartaItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  imagePosition?: string;
  imageFit?: 'contain' | 'cover';
}

export interface CartaCategory {
  id: string;
  name: string;
  description?: string;
  items: CartaItem[];
}

export const CARTA_CATEGORIES: CartaCategory[] = [
  {
    id: 'entradas', name: 'Entradas', items: [
      { id: 'guacamole-totopos', name: 'Guacamole con Totopos', price: 25, description: 'Guacamole con palta, tomate, cebolla, cilantro, limón y totopos' },
      { id: 'dorado-papa', name: 'Dorado de Papa', price: 15, description: 'Tacos crujientes de papa con guacamole mexicano' },
      { id: 'dorados-pollo', name: 'Dorados de Pollo', price: 18, description: 'Tacos crujientes de tinga de pollo con guacamole mexicano' },
      { id: 'elotes-zocalo', name: 'Elotes del Zócalo', price: 35, description: 'Mazorca de maíz con mayonesa, mantequilla, queso y chile en polvo' },
      { id: 'gringa-pastor', name: 'Gringa de Pastor', price: 30, description: 'Tortilla doradita con pastor, queso, cebolla, cilantro y salsa de la casa' },
      { id: 'esquite', name: 'Esquite', price: 30, description: 'Maíz cocido en caldo con epazote, acompañado de mayonesa, queso rallado, limón y chile al gusto' },
      { id: 'pozole-mexicano', name: 'Pozole Mexicano', price: 25, description: 'Pozole mexicano de maíz y cerdo cocidos lentamente, acompañado de cebolla, chile de árbol, limón, orégano, palta y tostadas' },
    ],
  },
  {
    id: 'tacos', name: 'Tacos', items: [
      { id: 'taco-pastor', name: 'Taco al Pastor', price: 7, description: 'Estilo México con cebolla, cilantro y piña volada' },
      { id: 'taco-lengua', name: 'Taco de Lengua', price: 10, description: 'Lengua de res suave, jugosa y cocida lentamente' },
      { id: 'taco-suadero', name: 'Taco de Suadero', price: 10, description: 'Suadero de res a fuego lento, con cilantro y cebolla' },
      { id: 'taco-alambre', name: 'Taco de Alambre', price: 10, description: 'Pastor salteado con pimiento, cebolla, jamón, tocino y queso gratinado' },
      { id: 'taco-carnitas', name: 'Taco de Carnitas', price: 10, description: 'Cerdo cocinado lentamente en manteca, suave por dentro y doradito por fuera' },
      { id: 'bistec', name: 'Bistec', price: 10, description: 'Bistec de res a la plancha con cebolla y cilantro' },
      { id: 'chori-queso', name: 'Chori-Queso', price: 13, description: 'Chorizo doradito con abundante queso fundido' },
      { id: 'quesabirria', name: 'Quesabirria', price: 13, description: 'Res cocinada lentamente con chiles, especias y queso' },
    ],
  },
  {
    id: 'burritos-bowls', name: 'Burritos y Bowls', items: [
      { id: 'burrito-pastor', name: 'Burrito de Pastor', price: 35, description: 'Tortilla de harina con pastor, frijoles, queso y palta', imageUrl: '/carta/burrito-de-pastor.png', imagePosition: 'center 72%' },
      { id: 'burrito-mixto', name: 'Burrito de Mixto', price: 40, description: 'Tortilla de harina con pastor, suadero, frijoles, queso y palta' },
      { id: 'bowl-chido', name: 'Bowl Chido', price: 29, description: 'Tradicional Pastor, arroz, frijoles, guacamole, pico de gallo y totopos, juntos para armar un bocado bien chido. Opciones: Pollo, Carnitas, Suadero', imageUrl: '/carta/bowl-chido.png', imagePosition: 'center 76%' },
    ],
  },
  {
    id: 'empanadas', name: 'Empanadas', items: [
      { id: 'empanada-hongos', name: 'Empanada de Hongos', price: 13, description: 'Quesadilla frita de maíz con hongos sazonados y queso fundido' },
      { id: 'empanada-birria', name: 'Empanada de Birria', price: 15, description: 'Quesadilla frita de maíz con res, chiles, especias y queso' },
    ],
  },
  {
    id: 'postre', name: 'Postre', items: [
      { id: 'crema-volteada', name: 'Crema Volteada', price: 15, description: 'Suave y sedosa crema de vainilla bañada con un delicado caramelo dorado', imageUrl: '/carta/crema-volteada.png', imagePosition: 'center 76%' },
    ],
  },
  {
    id: 'bebidas', name: 'Bebidas', items: [
      { id: 'tamarindo', name: 'Tamarindo', price: 16, description: 'El equilibrio perfecto entre dulce, ácido y tropical.', imageUrl: '/carta/tamarindo.png', imageFit: 'cover', imagePosition: 'center 76%' },
      { id: 'horchata', name: 'Horchata Mexa', price: 18, description: 'El agua fresca mexicana que no sabías que te iba a gustar.', imageUrl: '/carta/horchata.png', imageFit: 'cover', imagePosition: 'center 76%' },
      { id: 'jamaica', name: 'Jamaica', price: 16, description: 'Infusión de flor de jamaica. Dulce, fresca y ligeramente ácida.', imageUrl: '/carta/jamaica.png', imageFit: 'cover', imagePosition: 'center 76%' },
      { id: 'limonada-coco', name: 'Limonada de coco', price: 18, description: 'Limón fresco con un toque de coco. Refrescante y diferente.', imageUrl: '/carta/limonada-de-coco.png', imageFit: 'cover', imagePosition: 'center 76%' },
    ],
  },
];
