# Space Travel Booking App 🚀

A futuristic space travel booking web application with user authentication, real-time price updates, AI-powered recommendations, a chatbot assistant, and AR visualization features.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Implementation Status](#implementation-status)
- [External Services Setup](#external-services-setup)
  - [Firebase Setup](#firebase-setup)
  - [Anthropic Claude API Setup](#anthropic-claude-api-setup)
  - [AR Model Setup](#ar-model-setup)
- [Development](#development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🌌 Overview

This Space Travel Booking App offers users the ability to browse futuristic space travel packages, view real-time price updates, book trips with a simulated payment system, get AI-powered recommendations, interact with a chatbot, and visualize destinations through AR technology. The app features a dark, neon-accented UI inspired by Dubai's futuristic architecture.

## ✨ Features

- **User Authentication**: Email/password, Google, and Apple sign-in
- **Package Browsing**: View available space travel packages with details
- **Real-time Price Updates**: Dynamic pricing that changes periodically
- **Simulated Checkout**: Book trips with a simulated payment system
- **AI-Powered Recommendations**: Personalized travel suggestions based on preferences
- **Chatbot Assistant**: Answer user questions about travel packages
- **AR Visualization**: View 3D models of spaceships or destinations
- **User Profiles**: Save favorites and view booking history
- **Push Notifications**: Receive alerts for price drops or new deals
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## 🔧 Tech Stack

- **Frontend**:
  - [Next.js](https://nextjs.org/) - React framework
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
  - [shadcn/ui](https://ui.shadcn.com/) - Reusable UI components
  - [21st.dev](https://21st.dev/) - Additional UI components
  - [model-viewer](https://modelviewer.dev/) - 3D model viewing with AR support

- **Backend**:
  - [Firebase Authentication](https://firebase.google.com/products/auth) - User authentication
  - [Cloud Firestore](https://firebase.google.com/products/firestore) - Database
  - [Cloud Functions](https://firebase.google.com/products/functions) - Serverless functions
  - [Cloud Storage](https://firebase.google.com/products/storage) - File storage
  - [Cloud Messaging](https://firebase.google.com/products/cloud-messaging) - Push notifications

- **AI/ML**:
  - [Anthropic Claude API](https://www.anthropic.com/claude) - Chatbot and recommendations

- **Deployment**:
  - [Vercel](https://vercel.com/) - Frontend deployment
  - [Firebase Hosting](https://firebase.google.com/products/hosting) - Backend deployment

## 📋 Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org/) (v16 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Git](https://git-scm.com/)
- A Firebase account
- An Anthropic API key (for Claude integration)
- A Vercel account (for deployment)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/space-travel-booking.git
cd space-travel-booking
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory using the provided `.env.local.example` template. Fill in the Firebase and Claude API credentials.

### 4. Seed the database (optional)

To populate your Firebase Firestore with sample space travel packages:

1. Add your Firebase Admin SDK service account key to `.env.local`:
   ```
   FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id",...}'
   ```

2. Run the seeding script:
   ```bash
   node scripts/seed-packages.js
   ```

   Use the `--force` flag to overwrite existing packages:
   ```bash
   node scripts/seed-packages.js --force
   ```

### 5. Start the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📊 Implementation Status

Here's what has been implemented in the current version of the application:

- ✅ Project structure and basic setup
- ✅ Firebase integration (Auth, Firestore, Storage)
- ✅ Authentication system with context
- ✅ Dark, futuristic UI with Tailwind CSS
- ✅ Claude AI integration for chatbot and recommendations
- ✅ AR visualization with model-viewer
- ✅ Homepage with featured packages
- ✅ Package detail pages with AR visualization
- ✅ Package listing page with filtering and sorting
- ✅ Responsive navbar and footer components
- ✅ Chatbot component for user assistance
- ✅ Sign-up page with email/password and social login
- ✅ Database seeding script for packages
- ✅ Documentation for Firebase Function price updates

Coming soon:
- ⬜ Checkout and booking system
- ⬜ User profile and favorites functionality
- ⬜ Cloud Functions implementation for price updates
- ⬜ Push notification implementation
- ⬜ Admin panel for managing packages

## 🔌 External Services Setup

### Firebase Setup

1. **Create a Firebase project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the prompts
   - Enable Google Analytics if desired

2. **Setup Authentication**:
   - In Firebase Console, go to "Authentication" > "Sign-in method"
   - Enable Email/Password authentication
   - Enable Google authentication
   - For Apple authentication:
     - Register a Service ID with Apple Developer
     - Follow [Firebase Apple Auth Setup](https://firebase.google.com/docs/auth/web/apple)
     - Add your domain to the authorized domains list

3. **Create a Firestore Database**:
   - Go to "Firestore Database" and click "Create database"
   - Choose "Start in production mode"
   - Select a location for your database
   - Create the following collections:
     - `packages` (space travel packages)
     - `bookings` (user bookings)
     - `users` (user profiles and favorites)

4. **Set up Cloud Storage**:
   - Go to "Storage" and click "Get started"
   - Follow the setup steps
   - This will be used for storing images and 3D models

5. **Configure Security Rules**:
   - Update Firestore security rules to allow appropriate access
   - Example basic rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /packages/{packageId} {
      allow read: if true;  // Anyone can read packages
      allow write: if false;  // Only admins via Functions can write
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;  // Users can only access their own data
    }
    match /bookings/{booking} {
      allow read, write: if request.auth != null && 
                           (resource.data.userId == request.auth.uid || 
                            request.resource.data.userId == request.auth.uid);  // Users can only access their own bookings
    }
  }
}
```

6. **Set up Cloud Functions**:
   - Initialize Firebase Functions in your project:

```bash
firebase init functions
```

   - Create a function to update prices periodically:

```javascript
// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.updatePrices = functions.pubsub.schedule('every 10 minutes').onRun(async (context) => {
  const packagesSnapshot = await admin.firestore().collection('packages').get();
  packagesSnapshot.forEach(doc => {
    const data = doc.data();
    const min = data.minPrice || 0;
    const max = data.maxPrice || 0;
    if (min && max && max > min) {
      const newPrice = Math.floor(Math.random() * (max - min + 1)) + min;
      doc.ref.update({ price: newPrice });
    }
  });
  console.log('Prices updated');
  return null;
});
```

### Firebase Functions for Real-time Price Updates

For a more dynamic user experience, you may want price updates to occur more frequently than Cloud Scheduler's minimum interval of 1 minute. Below are detailed instructions for setting up and deploying functions with different frequency options.

#### Setting Up Firebase Functions

1. **Install Firebase CLI** (if not already done):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase Functions in your project**:
   ```bash
   firebase init functions
   ```
   - Select JavaScript or TypeScript
   - Choose whether to use ESLint
   - Install dependencies with npm when prompted

4. **Configure Functions for Frequent Updates**:

   There are two main approaches for creating frequent updates:

   **Option 1: Cloud Scheduler (Minimum 1 minute interval)**
   ```javascript
   // functions/index.js
   const functions = require("firebase-functions");
   const admin = require("firebase-admin");
   admin.initializeApp();

   // This function will run every minute (minimum interval for Cloud Scheduler)
   exports.updatePrices = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
     const packagesSnapshot = await admin.firestore().collection('packages').get();
     
     packagesSnapshot.forEach(doc => {
       const data = doc.data();
       const min = data.minPrice || 0;
       const max = data.maxPrice || 0;
       
       if (min && max && max > min) {
         // Generate new random price
         const newPrice = Math.floor(Math.random() * (max - min + 1)) + min;
         
         // Update the document
         doc.ref.update({ 
           price: newPrice,
           updatedAt: admin.firestore.FieldValue.serverTimestamp() 
         });
       }
     });
     
     console.log('Prices updated at', new Date().toISOString());
     return null;
   });
   ```

   **Option 2: Real-time Database Trigger (For more frequent updates - ~15 seconds)**
   ```javascript
   // functions/index.js
   const functions = require("firebase-functions");
   const admin = require("firebase-admin");
   admin.initializeApp();

   // This function responds to changes in a trigger document
   exports.updatePricesOnTrigger = functions.firestore
     .document('system/priceUpdateTrigger')
     .onUpdate(async (change, context) => {
       const newValue = change.after.data();
       const previousValue = change.before.data();
       
       // Only run if the trigger timestamp has changed
       if (newValue.timestamp === previousValue.timestamp) {
         console.log('Skipping redundant update');
         return null;
       }
       
       const packagesSnapshot = await admin.firestore().collection('packages').get();
       
       packagesSnapshot.forEach(doc => {
         const data = doc.data();
         const min = data.minPrice || 0;
         const max = data.maxPrice || 0;
         
         if (min && max && max > min) {
           // Generate new random price
           const newPrice = Math.floor(Math.random() * (max - min + 1)) + min;
           
           // Update the document
           doc.ref.update({ 
             price: newPrice,
             updatedAt: admin.firestore.FieldValue.serverTimestamp() 
           });
         }
       });
       
       console.log('Prices updated at', new Date().toISOString());
       return null;
     });

   // You'll need a client or another function to update the trigger document
   ```

5. **Setting up a 15-second trigger with a helper function**:

   To achieve updates approximately every 15 seconds, we can create an additional helper function:

   ```javascript
   // functions/index.js
   
   // Add this alongside your other functions
   exports.triggerPriceUpdates = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
     // Create timestamps for 4 updates (roughly every 15 seconds)
     const now = Date.now();
     const batch = admin.firestore().batch();
     const triggerRef = admin.firestore().doc('system/priceUpdateTrigger');
     
     // Schedule initial update immediately
     batch.set(triggerRef, { timestamp: now });
     await batch.commit();
     
     // Schedule the remaining updates with setTimeout
     setTimeout(async () => {
       await triggerRef.set({ timestamp: now + 15000 });
       console.log('Trigger 1 set');
     }, 15000);
     
     setTimeout(async () => {
       await triggerRef.set({ timestamp: now + 30000 });
       console.log('Trigger 2 set');
     }, 30000);
     
     setTimeout(async () => {
       await triggerRef.set({ timestamp: now + 45000 });
       console.log('Trigger 3 set');
     }, 45000);
     
     return null;
   });
   ```

   **Important**: Before deploying, create the trigger document manually:
   ```javascript
   // Use Firebase Admin SDK or the Firebase Console
   admin.firestore().doc('system/priceUpdateTrigger').set({
     timestamp: Date.now()
   });
   ```

6. **Deploying Firebase Functions**:

   ```bash
   firebase deploy --only functions
   ```

   To deploy a specific function:
   ```bash
   firebase deploy --only functions:updatePrices,functions:updatePricesOnTrigger,functions:triggerPriceUpdates
   ```

7. **Monitoring Your Functions**:

   - View logs and executions in the Firebase Console under "Functions"
   - Check Cloud Scheduler jobs in the Google Cloud Console
   - Use the Firebase CLI to view logs:
     ```bash
     firebase functions:log
     ```

8. **Cost Considerations**:

   Be aware that running functions very frequently can increase your billing costs:
   - Cloud Functions are billed based on invocations, compute time, and network usage
   - Firestore operations (reads/writes) are also billed separately
   - The Spark (free) plan has limits on function invocations and Firestore operations
   - Consider implementing rate limiting or reducing frequency in production

9. **Additional Configuration Options**:

   Set memory allocation and timeout for your functions:
   ```javascript
   exports.updatePrices = functions
     .runWith({
       timeoutSeconds: 60,
       memory: '256MB'
     })
     .pubsub.schedule('every 1 minutes')
     .onRun(async (context) => {
       // Function logic
     });
   ```

By following these steps, you'll have a system that updates package prices approximately every 15 seconds, providing a more dynamic real-time experience for your users.

7. **Set up Push Notifications (FCM)**:
   - Enable Firebase Cloud Messaging
   - Generate a VAPID key for web push notifications
   - Add a service worker file in your public directory:

```javascript
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

8. **Get Firebase Configuration**:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the Firebase config object for your web app
   - Add these values to your `.env.local` file

### Anthropic Claude API Setup

1. **Get an API Key**:
   - Sign up for access to [Anthropic's Claude API](https://www.anthropic.com/product)
   - Once approved, generate an API key from your dashboard
   - Add this key to your `.env.local` file as `CLAUDE_API_KEY`

2. **Create API Routes**:
   - Create a Next.js API route for the chatbot:

```javascript
// pages/api/chatbot.js
import { Anthropic } from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { conversation } = req.body;
  
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
    
    const messages = conversation.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      temperature: 0.7,
      messages: messages,
    });

    res.status(200).json({ reply: response.content[0].text });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
}
```

   - Create a similar API route for recommendations

### AR Model Setup

1. **Prepare 3D Models**:
   - Create or source 3D models in GLB/GLTF format
   - For iOS compatibility, also provide models in USDZ format
   - Upload these models to Firebase Storage

2. **Install model-viewer**:
   - Add to your project:

```bash
npm install @google/model-viewer
# or
yarn add @google/model-viewer
```

3. **Add a script tag to load model-viewer** in your Next.js app:
   - In `pages/_document.js`:

```javascript
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

## 💻 Development

### 1. Start the development server

```bash
npm run dev
# or
yarn dev
```

### 2. Populate initial data

You can create a script to populate Firestore with initial package data:

```javascript
// scripts/seed-data.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedPackages() {
  // Sample packages
  const packages = [
    {
      name: "Mars Adventure",
      destination: "Mars Base Alpha",
      duration: 14,
      amenities: ["Zero-G Spa", "Mars Rover Tour", "Spacesuit Rental"],
      description: "A two-week journey to the first human colony on Mars...",
      minPrice: 500000,
      maxPrice: 800000,
      price: 650000,
      imageUrl: "https://example.com/mars.jpg"
    },
    // Add more packages here
  ];

  const batch = db.batch();
  
  packages.forEach((pkg) => {
    const docRef = db.collection('packages').doc();
    batch.set(docRef, pkg);
  });

  await batch.commit();
  console.log('Added sample packages to Firestore');
}

seedPackages().then(() => process.exit(0));
```

Run the script with:

```bash
node scripts/seed-data.js
```

## 🚢 Deployment

### 1. Deploy to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com/)
   - Create an account or sign in
   - Click "New Project" and import your GitHub repository
   - Configure the project settings:
     - Framework Preset: Next.js
     - Build Command: `npm run build` (default)
     - Output Directory: `out` (if using static export) or default
     - Environment Variables: Add all your `.env.local` variables

3. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once completed, you'll get a deployment URL

### 2. Deploy Firebase Functions

Deploy your Cloud Functions to Firebase:

```bash
firebase deploy --only functions
```

### 3. Update Firebase Auth Configuration

1. Add your Vercel domain to the authorized domains in Firebase Authentication:
   - Go to Firebase Console > Authentication > Settings > Authorized domains
   - Add your Vercel domain (e.g., `your-app.vercel.app`)

### 4. Set up a custom domain (optional)

1. Configure a custom domain in Vercel
2. Update Firebase Authentication authorized domains to include your custom domain

## 📁 Project Structure

```
space-travel-booking/
├── components/            # React components
│   ├── AR/                # AR-related components
│   ├── Auth/              # Authentication components
│   ├── Booking/           # Booking flow components
│   ├── Chat/              # Chatbot components
│   ├── Layout/            # Layout components
│   └── UI/                # UI components
├── pages/                 # Next.js pages
│   ├── api/               # API routes
│   ├── _app.js            # App component
│   ├── _document.js       # Document component
│   ├── index.js           # Home page
│   ├── login.js           # Login page
│   ├── signup.js          # Signup page
│   ├── profile.js         # User profile
│   └── packages/          # Package pages
├── public/                # Public assets
│   ├── models/            # 3D models
│   └── firebase-messaging-sw.js # FCM service worker
├── lib/                   # Utility functions
│   ├── firebase.js        # Firebase configuration
│   └── auth.js            # Auth context
├── styles/                # Global styles
├── functions/             # Firebase Cloud Functions
├── .env.local             # Environment variables
└── README.md              # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
