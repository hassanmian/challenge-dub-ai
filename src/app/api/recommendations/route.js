import { NextResponse } from 'next/server';
import { getTravelRecommendation } from '@/lib/claude';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { userId, preference } = await request.json();
    
    if (!preference) {
      return NextResponse.json(
        { error: 'Invalid request: preference is required' },
        { status: 400 }
      );
    }
    
    // Fetch all available packages from Firestore
    let packages = [];
    try {
      const packagesSnapshot = await getDocs(collection(db, 'packages'));
      packages = packagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching packages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch available packages' },
        { status: 500 }
      );
    }
    
    if (packages.length === 0) {
      return NextResponse.json(
        { recommendation: "I'm sorry, but there are no travel packages available at the moment. Please check back later!" }
      );
    }
    
    // Get personalized recommendation from Claude
    const recommendation = await getTravelRecommendation(preference, packages);
    
    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error('Recommendation API error:', error);
    return NextResponse.json(
      { error: 'Error: unable to get recommendation at this time.' },
      { status: 500 }
    );
  }
} 