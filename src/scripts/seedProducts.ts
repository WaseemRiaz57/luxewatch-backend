import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product';
import connectDB from '../config/database';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const products = [
  {
    brand: 'Rolex',
    modelName: 'Submariner Date',
    sku: 'RLX-SUB-001',
    price: 14500,
    description: 'The Rolex Submariner Date is a legendary dive watch with a unidirectional rotatable bezel, Cerachrom insert, and date display. Water-resistant to 300 meters, it features the caliber 3235 movement with 70-hour power reserve.',
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '41mm',
    material: 'Oystersteel and 18k Yellow Gold',
    waterResistance: '300m',
    sapphireGlass: true,
    stock: 5,
    featured: true
  },
  {
    brand: 'Omega',
    modelName: 'Speedmaster Professional Moonwatch',
    sku: 'OMG-SPD-001',
    price: 6800,
    description: 'The legendary Omega Speedmaster Professional, the first watch worn on the moon. Features the iconic manual-wind chronograph caliber 1861, hesalite crystal, and black dial with luminous hands.',
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '42mm',
    material: 'Stainless Steel',
    waterResistance: '50m',
    sapphireGlass: false,
    stock: 8,
    featured: true
  },
  {
    brand: 'Patek Philippe',
    modelName: 'Nautilus 5711/1A',
    sku: 'PP-NAU-001',
    price: 52000,
    description: 'The iconic Patek Philippe Nautilus with its distinctive porthole design. Features the ultra-thin automatic caliber 26-330 S C movement, date display, and elegant blue dial with horizontal embossed pattern.',
    images: [
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '40mm',
    material: 'Stainless Steel',
    waterResistance: '120m',
    sapphireGlass: true,
    stock: 2,
    featured: true
  },
  {
    brand: 'Audemars Piguet',
    modelName: 'Royal Oak Chronograph',
    sku: 'AP-RO-001',
    price: 48500,
    description: 'The legendary Royal Oak with its iconic octagonal bezel and "Tapisserie" patterned dial. This chronograph version features the caliber 2385 movement with column-wheel chronograph mechanism.',
    images: [
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '41mm',
    material: 'Stainless Steel',
    waterResistance: '50m',
    sapphireGlass: true,
    stock: 3,
    featured: true
  },
  {
    brand: 'Cartier',
    modelName: 'Santos de Cartier Large',
    sku: 'CAR-SAN-001',
    price: 7600,
    description: 'A timeless icon of aviation history. The Santos features Cartier\'s signature square case, exposed screws, and the innovative QuickSwitch interchangeable strap system with the caliber 1847 MC movement.',
    images: [
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800',
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '39.8mm',
    material: 'Stainless Steel',
    waterResistance: '100m',
    sapphireGlass: true,
    stock: 6,
    featured: false
  },
  {
    brand: 'TAG Heuer',
    modelName: 'Monaco Chronograph',
    sku: 'TAG-MON-001',
    price: 6950,
    description: 'The iconic square chronograph made famous by Steve McQueen. Features the caliber Heuer 02 automatic movement, distinctive blue dial, and vintage-inspired design with red accents.',
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '39mm',
    material: 'Stainless Steel',
    waterResistance: '100m',
    sapphireGlass: true,
    stock: 7,
    featured: false
  },
  {
    brand: 'Breitling',
    modelName: 'Navitimer B01 Chronograph',
    sku: 'BRT-NAV-001',
    price: 9100,
    description: 'The legendary pilot\'s chronograph with circular slide rule bezel. Features the in-house caliber B01 movement, 70-hour power reserve, and distinctive black dial with contrasting sub-dials.',
    images: [
      'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=800',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '43mm',
    material: 'Stainless Steel',
    waterResistance: '30m',
    sapphireGlass: true,
    stock: 4,
    featured: false
  },
  {
    brand: 'IWC',
    modelName: 'Portugieser Chronograph',
    sku: 'IWC-POR-001',
    price: 13400,
    description: 'An elegant dress watch with chronograph complications. Features the caliber 69355 movement, leaf-shaped hands, applied Arabic numerals, and sub-dials at 12 and 6 o\'clock.',
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '41mm',
    material: 'Stainless Steel',
    waterResistance: '30m',
    sapphireGlass: true,
    stock: 5,
    featured: false
  },
  {
    brand: 'Rolex',
    modelName: 'Daytona Chronograph',
    sku: 'RLX-DAY-001',
    price: 28500,
    description: 'The ultimate racing chronograph with tachymetric scale engraved on the Cerachrom bezel. Features the caliber 4130 movement, Oystersteel case, and the iconic three-counter chronograph layout.',
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '40mm',
    material: 'Oystersteel',
    waterResistance: '100m',
    sapphireGlass: true,
    stock: 2,
    featured: true
  },
  {
    brand: 'Omega',
    modelName: 'Seamaster Diver 300M',
    sku: 'OMG-SEA-001',
    price: 5400,
    description: 'A modern dive watch with wave-patterned dial and helium escape valve. Features the Co-Axial Master Chronometer caliber 8800, ceramic bezel, and excellent water resistance for professional diving.',
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800',
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '42mm',
    material: 'Stainless Steel',
    waterResistance: '300m',
    sapphireGlass: true,
    stock: 10,
    featured: false
  },
  {
    brand: 'Patek Philippe',
    modelName: 'Calatrava 5196',
    sku: 'PP-CAL-001',
    price: 22800,
    description: 'The quintessential dress watch with clean, minimalist design. Features the ultra-thin caliber 215 PS movement, elegant Clous de Paris bezel, and timeless aesthetic that defines haute horlogerie.',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '37mm',
    material: '18k White Gold',
    waterResistance: '30m',
    sapphireGlass: true,
    stock: 3,
    featured: false
  },
  {
    brand: 'Audemars Piguet',
    modelName: 'Royal Oak Offshore Diver',
    sku: 'AP-ROD-001',
    price: 32500,
    description: 'A bold interpretation of the Royal Oak with enhanced water resistance. Features the caliber 4308 movement, unidirectional rotating bezel, and the signature octagonal bezel with oversized proportions.',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '42mm',
    material: 'Stainless Steel',
    waterResistance: '300m',
    sapphireGlass: true,
    stock: 2,
    featured: false
  },
  {
    brand: 'Rolex',
    modelName: 'GMT-Master II',
    sku: 'RLX-GMT-001',
    price: 15800,
    description: 'The iconic pilot\'s watch with dual time zone functionality. Features the caliber 3285 movement, bi-directional rotatable 24-hour graduated Cerachrom bezel, and distinctive blue and red "Pepsi" colors.',
    images: [
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'
    ],
    condition: 'pre-owned',
    movement: 'automatic',
    caseSize: '40mm',
    material: 'Oystersteel',
    waterResistance: '100m',
    sapphireGlass: true,
    stock: 4,
    featured: false
  },
  {
    brand: 'Cartier',
    modelName: 'Tank Must',
    sku: 'CAR-TNK-001',
    price: 3200,
    description: 'An Art Deco masterpiece with sleek rectangular case. Features quartz movement for precision, Roman numeral dial, blue cabochon crown, and the timeless elegance that made Tank a legend.',
    images: [
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800',
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800'
    ],
    condition: 'new',
    movement: 'quartz',
    caseSize: '33.7mm x 25.5mm',
    material: 'Stainless Steel',
    waterResistance: '30m',
    sapphireGlass: true,
    stock: 12,
    featured: false
  },
  {
    brand: 'TAG Heuer',
    modelName: 'Carrera Calibre Heuer 02',
    sku: 'TAG-CAR-001',
    price: 5950,
    description: 'A modern sports chronograph with sophisticated design. Features the in-house caliber Heuer 02 movement, skeletonized dial revealing the intricate movement, and 80-hour power reserve.',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '43mm',
    material: 'Stainless Steel',
    waterResistance: '100m',
    sapphireGlass: true,
    stock: 6,
    featured: false
  },
  {
    brand: 'Omega',
    modelName: 'Constellation Co-Axial',
    sku: 'OMG-CON-001',
    price: 7200,
    description: 'An elegant dress watch with the distinctive "claws" on the case. Features the Co-Axial caliber 8800 movement, diamond hour markers, and the iconic Constellation design that blends luxury and precision.',
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800',
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '41mm',
    material: 'Stainless Steel and 18k Gold',
    waterResistance: '100m',
    sapphireGlass: true,
    stock: 5,
    featured: false
  },
  {
    brand: 'Breitling',
    modelName: 'Superocean Heritage II',
    sku: 'BRT-SUP-001',
    price: 4850,
    description: 'A vintage-inspired dive watch with modern performance. Features the caliber B20 movement based on Tudor MT5612, ceramic bezel, and retro design elements combined with 200m water resistance.',
    images: [
      'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=800',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '42mm',
    material: 'Stainless Steel',
    waterResistance: '200m',
    sapphireGlass: true,
    stock: 8,
    featured: false
  },
  {
    brand: 'IWC',
    modelName: 'Pilot\'s Watch Mark XVIII',
    sku: 'IWC-MRK-001',
    price: 4850,
    description: 'A classic pilot\'s watch with clear, legible dial and antimagnetic soft-iron inner case. Features the caliber 35111 movement, date display at 3 o\'clock, and the heritage of IWC\'s aviation timepieces.',
    images: [
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800',
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800'
    ],
    condition: 'pre-owned',
    movement: 'automatic',
    caseSize: '40mm',
    material: 'Stainless Steel',
    waterResistance: '60m',
    sapphireGlass: true,
    stock: 4,
    featured: false
  },
  {
    brand: 'Rolex',
    modelName: 'Datejust 41',
    sku: 'RLX-DTJ-001',
    price: 10500,
    description: 'The quintessential Rolex with fluted bezel and Jubilee bracelet. Features the caliber 3235 movement, Cyclops lens over the date, and the timeless design that has defined luxury watches since 1945.',
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '41mm',
    material: 'Oystersteel and 18k White Gold',
    waterResistance: '100m',
    sapphireGlass: true,
    stock: 7,
    featured: false
  },
  {
    brand: 'Patek Philippe',
    modelName: 'Aquanaut 5167A',
    sku: 'PP-AQU-001',
    price: 35000,
    description: 'A sporty yet elegant timepiece with distinctive embossed dial. Features the caliber 324 S C movement, "Tropical" composite strap, and the perfect blend of luxury and versatility.',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800'
    ],
    condition: 'pre-owned',
    movement: 'automatic',
    caseSize: '40mm',
    material: 'Stainless Steel',
    waterResistance: '120m',
    sapphireGlass: true,
    stock: 2,
    featured: false
  },
  {
    brand: 'Audemars Piguet',
    modelName: 'CODE 11.59 Chronograph',
    sku: 'AP-COD-001',
    price: 42000,
    description: 'A contemporary design with complex case architecture. Features the caliber 4401 integrated chronograph movement, openworked dial, and innovative case construction with multiple finishing techniques.',
    images: [
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '41mm',
    material: '18k Rose Gold',
    waterResistance: '30m',
    sapphireGlass: true,
    stock: 1,
    featured: false
  },
  {
    brand: 'Cartier',
    modelName: 'Ballon Bleu 42mm',
    sku: 'CAR-BAL-001',
    price: 8950,
    description: 'An elegant timepiece with distinctive round case and blue cabochon crown guard. Features the caliber 1847 MC movement, Roman numeral dial with guilloche center, and sophisticated design.',
    images: [
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800',
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '42mm',
    material: 'Stainless Steel',
    waterResistance: '30m',
    sapphireGlass: true,
    stock: 4,
    featured: false
  },
  {
    brand: 'TAG Heuer',
    modelName: 'Aquaracer Professional 300',
    sku: 'TAG-AQU-001',
    price: 3300,
    description: 'A professional dive watch with unidirectional ceramic bezel. Features the caliber 5 movement, luminous markers, date display, and robust construction suitable for underwater adventures.',
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '43mm',
    material: 'Stainless Steel',
    waterResistance: '300m',
    sapphireGlass: true,
    stock: 15,
    featured: false
  },
  {
    brand: 'Omega',
    modelName: 'De Ville Prestige',
    sku: 'OMG-DEV-001',
    price: 4200,
    description: 'A refined dress watch with elegant simplicity. Features the caliber 2500 Co-Axial movement, silvered dial with applied index hour markers, and understated luxury perfect for formal occasions.',
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '39.5mm',
    material: 'Stainless Steel',
    waterResistance: '30m',
    sapphireGlass: true,
    stock: 6,
    featured: false
  },
  {
    brand: 'Breitling',
    modelName: 'Chronomat B01 42',
    sku: 'BRT-CHR-001',
    price: 8600,
    description: 'An iconic chronograph with rouleaux bracelet. Features the manufacture caliber B01 movement, rotating bezel with rider tabs, and the perfect combination of precision and functionality.',
    images: [
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800',
      'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '42mm',
    material: 'Stainless Steel',
    waterResistance: '200m',
    sapphireGlass: true,
    stock: 5,
    featured: false
  },
  {
    brand: 'IWC',
    modelName: 'Big Pilot\'s Watch 43',
    sku: 'IWC-BIG-001',
    price: 13200,
    description: 'A legendary aviation timepiece with oversized crown. Features the caliber 82100 movement, soft-iron inner case for magnetic field protection, iconic conical crown, and exceptional legibility.',
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '43mm',
    material: 'Stainless Steel',
    waterResistance: '100m',
    sapphireGlass: true,
    stock: 3,
    featured: false
  },
  {
    brand: 'Rolex',
    modelName: 'Explorer II',
    sku: 'RLX-EXP-001',
    price: 11200,
    description: 'A tool watch designed for cave explorers and polar expeditions. Features the caliber 3285 movement, fixed 24-hour graduated bezel, date display, and robust Oyster case with 100m water resistance.',
    images: [
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '42mm',
    material: 'Oystersteel',
    waterResistance: '100m',
    sapphireGlass: true,
    stock: 6,
    featured: false
  },
  {
    brand: 'Patek Philippe',
    modelName: 'Twenty~4 Automatic',
    sku: 'PP-T24-001',
    price: 18500,
    description: 'An elegant ladies\' watch with Art Deco-inspired design. Features the caliber 324 S C movement, diamond-set bezel, integrated bracelet, and the refined femininity that defines Patek Philippe.',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '36mm',
    material: 'Stainless Steel with Diamond Bezel',
    waterResistance: '30m',
    sapphireGlass: true,
    stock: 4,
    featured: false
  },
  {
    brand: 'Audemars Piguet',
    modelName: 'Royal Oak Jumbo Extra-Thin',
    sku: 'AP-ROJ-001',
    price: 58000,
    description: 'The purest expression of the Royal Oak design with ultra-thin profile. Features the caliber 2121 movement at only 3.05mm thick, "Grande Tapisserie" dial, and the original 39mm case size.',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '39mm',
    material: 'Stainless Steel',
    waterResistance: '50m',
    sapphireGlass: true,
    stock: 1,
    featured: true
  },
  {
    brand: 'Cartier',
    modelName: 'Drive de Cartier',
    sku: 'CAR-DRV-001',
    price: 7800,
    description: 'A masculine timepiece with cushion-shaped case. Features the caliber 1904-PS MC movement, elongated cabochon crown, guilloché dial, and distinctive design inspired by automotive elegance.',
    images: [
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800',
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800'
    ],
    condition: 'new',
    movement: 'automatic',
    caseSize: '40mm',
    material: 'Stainless Steel',
    waterResistance: '30m',
    sapphireGlass: true,
    stock: 5,
    featured: false
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing products`);

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✨ Successfully inserted ${insertedProducts.length} products`);

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`   Total Products: ${insertedProducts.length}`);
    console.log(`   Featured: ${insertedProducts.filter(p => p.featured).length}`);
    console.log(`   Brands: ${[...new Set(products.map(p => p.brand))].join(', ')}`);
    console.log(`   Price Range: $${Math.min(...products.map(p => p.price))} - $${Math.max(...products.map(p => p.price))}`);
    
    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeder
seedProducts();
