const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Check if service account credentials are provided
console.log(process.env);
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('Error: FIREBASE_SERVICE_ACCOUNT environment variable is not set');
  console.log('Please add your Firebase service account key to .env.local:');
  console.log('FIREBASE_SERVICE_ACCOUNT=\'{"type":"service_account","project_id":"..."}\'');
  process.exit(1);
}

// Initialize Firebase Admin
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = admin.firestore();

// Sample package data
const packages = [
  {
    name: "Mars Adventure",
    destination: "Mars Base Alpha",
    duration: 14,
    minPrice: 500000,
    maxPrice: 800000,
    price: 650000,
    description: "Experience the red planet like never before with our two-week Mars Adventure package. Visit the first human colony on Mars, explore the vast Martian landscapes, and witness the stunning sunsets from Olympus Mons, the largest volcano in our solar system. This package includes guided excursions to ancient river beds, ice caves, and potential sites of ancient microbial life.",
    amenities: [
      "Zero-G Spa",
      "Mars Rover Tours",
      "Spacesuit Rental",
      "Observation Deck",
      "Gourmet Space Cuisine",
      "Private Cabin"
    ],
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1338&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=1374&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538551868183-edf7bfc50391?q=80&w=1364&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630694093867-4b947d812bf0?q=80&w=1470&auto=format&fit=crop"
    ],
    departure: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    rating: 4.8,
    capacity: 12,
    availableSeats: 3,
    featured: true,
    modelPath: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    iosSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.usdz"
  },
  {
    name: "Lunar Getaway",
    destination: "Moon Resort & Spa",
    duration: 7,
    minPrice: 250000,
    maxPrice: 450000,
    price: 350000,
    description: "Treat yourself to a luxurious week-long escape to our exclusive Moon Resort & Spa. Situated in the picturesque Sea of Tranquility, our resort offers breathtaking Earth views and the ultimate relaxation experience in our low-gravity spa. Take guided tours to historic Apollo landing sites, experience moonwalking firsthand, and enjoy gourmet dining under the stars.",
    amenities: [
      "Low-Gravity Spa",
      "Apollo Landing Site Tours",
      "Earth Observation Lounge",
      "Luxury Suite",
      "Moonwalking Experience",
      "Fine Dining Restaurant"
    ],
    imageUrl: "https://images.unsplash.com/photo-1614726365891-151ea3a7c2fe?q=80&w=1287&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1535332371349-a5d229f49cb5?q=80&w=1376&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613575473376-f8b2417d533d?q=80&w=1374&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1463852247062-1bbca38f7805?q=80&w=1376&auto=format&fit=crop"
    ],
    departure: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    rating: 4.9,
    capacity: 24,
    availableSeats: 8,
    featured: true,
    modelPath: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    iosSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.usdz"
  },
  {
    name: "Orbital Luxury",
    destination: "SpaceX Premium Station",
    duration: 3,
    minPrice: 120000,
    maxPrice: 250000,
    price: 180000,
    description: "Our Orbital Luxury package offers a quick but unforgettable escape to Earth's orbit. Stay in our state-of-the-art space station featuring panoramic windows with constant views of our beautiful planet. Experience the thrill of zero gravity throughout your stay, participate in scientific experiments, and enjoy gourmet meals prepared by our onboard chefs.",
    amenities: [
      "Panoramic Earth Views",
      "Zero-G Entertainment",
      "Space Photography Workshop",
      "Executive Suite",
      "Gourmet Dining",
      "Space Walk Option"
    ],
    imageUrl: "https://images.unsplash.com/photo-1450944584139-ace2a3b70f7d?q=80&w=1471&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1472&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614314169841-3e89b6755dc4?q=80&w=1471&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1471&auto=format&fit=crop"
    ],
    departure: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    rating: 4.7,
    capacity: 30,
    availableSeats: 12,
    featured: true,
    modelPath: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    iosSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.usdz"
  },
  {
    name: "Jupiter Odyssey",
    destination: "Europa & Ganymede Stations",
    duration: 21,
    minPrice: 900000,
    maxPrice: 1200000,
    price: 980000,
    description: "Embark on an epic journey to Jupiter and its fascinating moons. This three-week expedition takes you to the edge of our solar system's most massive planet. Visit research stations on Europa and Ganymede, witness Jupiter's Great Red Spot up close, and experience the unparalleled beauty of its swirling atmospheric patterns. This pioneering journey is perfect for true adventurers seeking the ultimate space experience.",
    amenities: [
      "Extended Zero-G Training",
      "Scientific Research Participation",
      "Submersible Europa Ocean Tour",
      "Premier Cabin Suite",
      "Virtual Reality Entertainment",
      "Personalized Space Suit"
    ],
    imageUrl: "https://images.unsplash.com/photo-1640962376963-817290d6b149?q=80&w=1374&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544942579-9671c210ebce?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561015953-80224a155aa8?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630694093869-eda9c736a798?q=80&w=1470&auto=format&fit=crop"
    ],
    departure: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    rating: 4.9,
    capacity: 8,
    availableSeats: 2,
    featured: false,
    modelPath: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    iosSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.usdz"
  },
  {
    name: "Space Walk Experience",
    destination: "Low Earth Orbit",
    duration: 2,
    minPrice: 85000,
    maxPrice: 120000,
    price: 95000,
    description: "For those short on time but big on adventure, our Space Walk Experience offers a taste of space travel with the highlight being a guided space walk in Earth's orbit. After comprehensive training, you'll step outside our specialized spacecraft with an experienced astronaut guide to float freely in space while taking in the spectacular views of Earth below. This short but life-changing experience includes pre-flight training, the journey to orbit, and the unforgettable space walk.",
    amenities: [
      "Guided Space Walk",
      "Astronaut Training",
      "HD Video Recording",
      "Commemorative Space Suit Patch",
      "Gourmet Meals",
      "Certificate of Completion"
    ],
    imageUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=1480&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1513628253939-010e64ac66cd?q=80&w=1374&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608178398319-48f814d0750c?q=80&w=1458&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532330393533-443990a44afb?q=80&w=1470&auto=format&fit=crop"
    ],
    departure: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
    rating: 4.6,
    capacity: 4,
    availableSeats: 1,
    featured: false,
    modelPath: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    iosSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.usdz"
  }
];

// Seed packages to Firestore
async function seedPackages() {
  try {
    console.log('🚀 Starting package seeding process...');

    // Check if collection already has data
    const existingPackages = await db.collection('packages').get();
    if (!existingPackages.empty) {
      console.log(`Found ${existingPackages.size} existing packages.`);
      const proceed = process.argv.includes('--force');
      
      if (!proceed) {
        console.log('Collection already contains data. Use --force to overwrite.');
        process.exit(0);
      } else {
        console.log('--force flag detected. Deleting existing packages...');
        const batch = db.batch();
        existingPackages.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.log('Existing packages deleted.');
      }
    }

    // Add new packages
    const batch = db.batch();
    packages.forEach((pkg) => {
      const docRef = db.collection('packages').doc();
      batch.set(docRef, {
        ...pkg,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Added package: ${pkg.name}`);
    });

    await batch.commit();
    console.log(`Successfully added ${packages.length} packages to Firestore!`);

  } catch (error) {
    console.error('Error seeding packages:', error);
  } finally {
    // Exit the process
    process.exit(0);
  }
}

seedPackages(); 