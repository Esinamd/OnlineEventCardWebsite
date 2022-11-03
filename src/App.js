import React from "react";
import {
  BrowserRouter as Router,
  Routes,  
  Route,
  Navigate
} from "react-router-dom";
import './App.css';
import Ghana from './gh-localisation/HomeGH';
import Brasil from './br-localisation/HomeBR';
import Hangug from './ko-localisation/HomeKO';
import Event from './gh-localisation/EventPage';
import BREvent from './br-localisation/BrEvents';
import KOEvent from './ko-localisation/KoEvents';
import i18next from 'i18next';
import ShowCard from './Card';
import NotFound from "./NotFound";


export default function App() {
    //using browser language to set localisation automatically
    var elem;
    if (i18next.language == "en"|| i18next.language.substring(0,3) == "en-"){
     //account for all 10 variations of english codes
      elem= <Ghana />;
    } else if (i18next.language == "ko"){
      elem = <Hangug />;
    } else if (i18next.language == "pt" || i18next.language == "pt-BR"){
      elem = <Brasil />;
    } else {
      elem = <Ghana />;
    }

    return (
      <Router>
          <Routes>
              <Route exact path="/" element={elem} />
              <Route exact path="/ghana" element={<Ghana />} />
              <Route exact path="/brasil" element={<Brasil />} />
              <Route exact path="/hangug" element={<Hangug />} />
              <Route exact path="/ghana/:cEvent" element={<Event />} />
              <Route exact path="/card/:id" element={<ShowCard />} />
              <Route exact path="/brasil/:brCEvent" element={<BREvent />} />
              <Route exact path="/hangug/:koCEvent" element={<KOEvent />} />
              <Route path="/404" element={<NotFound />} /> 
              <Route path="*" element={<Navigate replace to="/404" />} />
          </Routes>
      </Router>
    );
}