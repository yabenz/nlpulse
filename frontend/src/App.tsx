import React from 'react';
import logo from './logo.svg';
import './App.css';

import MainUI from './components/MainUI'
import Footer from './components/Footer'
import FavedPopup from './components/FavedPopup'
import { Bookmark, Heart, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react'


export default function App() {

  const [currentAnalysis, setCurrentAnalysis] = useState(Number)

  let favedAnalysis: any[] = []

  const [isFavedPopupVisible, setFavedPopupVisible] = useState(false)

  useEffect(() => {

    favedAnalysis = JSON.parse(localStorage.getItem('favedAnalysis') || '[]') as any[];

  })

  return (
    <div className="App">
      <header className="header">
        <div className='flex'>
          <h1>Sentiment Analyzer</h1>
          <div className='flex' aria-label='profile-section' style={{ alignItems: 'center', margin: '3px' }}>
            {isFavedPopupVisible && <FavedPopup setFavedPopupVisible={setFavedPopupVisible} setCurrentAnalysis={setCurrentAnalysis} />}
            <div className='transp-button-l' onClick={() => setFavedPopupVisible(!isFavedPopupVisible)}>
              <Heart fill='#eefff9' size={22} strokeWidth={1} stroke='#04c37a' style={{ transform: 'translateY(1px)' }} />
            </div>
          </div>
        </div>

      </header>
      <MainUI favedAnalysis={favedAnalysis} currentAnalysis={currentAnalysis} />
      <Footer />
    </div>
  );
}
