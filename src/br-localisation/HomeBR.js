import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/br.css';
import '../i18n';
import { useParams } from 'react-router';
import app from '../firebase';
import { doc, getDoc, getFirestore } from "firebase/firestore";


function Brasil (){

    let { currentEvent } = useParams(); 
    const { i18n } = useTranslation();
    const now = new Date();

    //location variables
    const [lat, setLat]= useState();
    const [long, setLong] = useState();
    const [locData, setLocData]= useState([]);

    //weather type variables
    const [clear, setClear]=useState("");
    const [clouds, setClouds]=useState("");
    const [drizzle, setDrizzle]=useState("");
    const [generalWeather, setGeneralWeather]=useState("");
    const [rain, setRain]=useState("");
    const [snow, setSnow]=useState("");
    const [thunderstorm, setThunderstorm]=useState("");
    const [wind, setWind]=useState("");

    //homepage title variables
    const [gh, setGH]=useState("");
    const [cb, setCB]=useState("");
    const [ct, setCT]=useState("");
    const [laTitle, setLaTitle]=useState("");
    const [LoTitle, setLoTitle]=useState("");
    const [oe, setOE]=useState("");
    const [sk, setSK]=useState("");

    //time greeting variables
    const [noonGreet, setNoonGreet]=useState("");
    const [eveGreet, setEveGreet]=useState("");
    const [mornGreet, setMornGreet]=useState("");
    const [genGreet, setGenGreet]=useState("");

    //event variables
    const [rio, setRio]=useState("");
    const [barretos, setBarretos]=useState("");
    const [lemanja, setLemanja]=useState("");
    const [natal, setNatal]=useState("");

    //image preview variables
    const [rioPreview, setRioPreview]=useState("");
    const [barPreview, setBarPreview]=useState("");
    const [lemanjaPreview, setLemanjaPreview]=useState("");
    const [natalPreview, setNatalPreview]=useState("");

    useEffect(() => {
        //changing the html language tag
        var lang = "pt";
        document.documentElement.lang = lang;
        i18n.changeLanguage("pt"); //changing the i18next language to portuguese
        const db = getFirestore(app); //accessing firestore database

        const fetchWeather = async () => {
            const clearRef = doc (db, "weather-icons", "Clear");
            const cloudsrRef = doc (db, "weather-icons", "Clouds");
            const drizzleRef = doc (db, "weather-icons", "Drizzle");
            const genWRef = doc (db, "weather-icons", "General");
            const rainRef = doc (db, "weather-icons", "Rain");
            const snowRef = doc (db, "weather-icons", "Snow");
            const stormRef = doc (db, "weather-icons", "Thunderstorm");
            const windRef = doc (db, "weather-icons", "Wind");
            //setting weather variables using database information
            const clearSnap = await getDoc(clearRef);
            if (clearSnap.exists()){
                const dataCl = clearSnap.data();
                setClear(dataCl.gif);
            }
            const cloudsSnap = await getDoc(cloudsrRef);
            if (cloudsSnap.exists()){
                const dataCo = cloudsSnap.data();
                setClouds(dataCo.gif);
            }
            const drizzleSnap = await getDoc(drizzleRef);
            if (drizzleSnap.exists()){
                const dataDr = drizzleSnap.data();
                setDrizzle(dataDr.gif);
            }
            const genWSnap = await getDoc(genWRef);
            if (genWSnap.exists()){
                const dataG = genWSnap.data();
                setGeneralWeather(dataG.gif);
            }
            const rainSnap = await getDoc(rainRef);
            if (rainSnap.exists()){
                const dataR = rainSnap.data();
                setRain(dataR.gif);
            }
            const snowSnap = await getDoc(snowRef);
            if (snowSnap.exists()){
                const dataSn = snowSnap.data();
                setSnow(dataSn.gif);
            }
            const stormSnap = await getDoc(stormRef);
            if (stormSnap.exists()){
                const dataSt = stormSnap.data();
                setThunderstorm(dataSt.gif);
            }
            const windSnap = await getDoc(windRef);
            if (windSnap.exists()){
                const dataW = windSnap.data();
                setWind(dataW.gif);
            }
        }

        const fetchHomepage = async () => {
            const homeRef = doc(db, "br-pt", "homepage");
            const homeSnap = await getDoc(homeRef);
            if (homeSnap.exists()){ //setting homepage title variables
                const homeData = homeSnap.data();
                setGH(homeData.ghanaian);
                setCB(homeData.click_button);
                setCT(homeData.culture_title);
                setLaTitle(homeData.latest_title);
                setLoTitle(homeData.locale_title);
                setOE(homeData.other_events);
                setSK(homeData.south_korean);
            }
        };

        const fetchTimes = async () => {    
            const timeRef = doc(db, "br-pt","time_greetings");
            const timeSnap = await getDoc(timeRef);
            if (timeSnap.exists()){ //setting time variables using database information
                const timeData = timeSnap.data();
                setNoonGreet(timeData.afternoon);
                setEveGreet(timeData.evening);
                setMornGreet(timeData.morning);
                setGenGreet(timeData.general);
            }
        };

        const fetchEvents = async () => {    
            const eventRef = doc(db,"br-pt","all_events");
            const eventSnap = await getDoc(eventRef);
            if (eventSnap.exists()){ //setting event variables using database information
                const eventData = eventSnap.data();
                setRio(eventData.event1);
                setBarretos(eventData.event2);
                setLemanja(eventData.event3);
                setNatal(eventData.event4);
            } 
        };
        
        //fetching users location (latitude and longitude)
        const fetchLocation = async (e) => {
            navigator.geolocation.getCurrentPosition(function(position) {
                setLat(position.coords.latitude);
                setLong(position.coords.longitude);
            })      
            
            await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
            .then ((result) => { //getting weather data using user's location
                setLocData(result);
            })
            .catch(console.error);
        };

        //getting image previews for latest event from database
        const fetchPreview = async () => {
            const preRef1 = doc(db,"br-pt","Carnaval do Rio de Janeiro");
            const preSnap1 = await getDoc(preRef1);
            if (preSnap1.exists()){
                const preData1 = preSnap1.data();
                setRioPreview(preData1.event_imgs.img0.img);
            }

            const preRef2 = doc(db,"br-pt","Festa do Peão de Barretos");
            const preSnap2 = await getDoc(preRef2);
            if (preSnap2.exists()){
                const preData2 = preSnap2.data();
                setBarPreview(preData2.event_imgs.img0.img);
            }

            const preRef3 = doc(db,"br-pt","Lemanjá Festival");
            const preSnap3 = await getDoc(preRef3);
            if (preSnap3.exists()){
                const preData3 = preSnap3.data();
                setLemanjaPreview(preData3.event_imgs.img0.img);
            } 

            const preRef4 = doc(db,"br-pt","Natal");
            const preSnap4 = await getDoc(preRef4);
            if (preSnap4.exists()){
                const preData4 = preSnap4.data();
                setNatalPreview(preData4.event_imgs.img0.img);
            }
        };

        fetchHomepage().catch(console.error);
        fetchTimes().catch(console.error);
        fetchEvents().catch(console.error);
        fetchLocation().catch(console.error);
        fetchWeather().catch(console.error);
        fetchPreview().catch(console.error);

    }, [lat,long]);


    const koPage = () => { //link to korean localisation
        window.location.href = "/hangug";
    }
    
   const ghPage = () => { //link to ghanaian localisation
        window.location.href = "/ghana";
    }

    var rList;
    var brCEvent;
    var previewImg;
    //determining which events to show based on date
    if (now.getMonth = 0){
        if (now.getDate = 1){
            //Lemanja Festival
            brCEvent = (lemanja);
            rList = [natal, rio, barretos];
            previewImg=lemanjaPreview;
        } else {
            //Rio Carnival
            brCEvent = (rio);
            rList = [lemanja, barretos, natal];
            previewImg=rioPreview;
        }
    }
    if ((now.getMonth = 2) || (now.getMonth = 1)) {
            //Rio Carnival
            brCEvent = (rio);
            rList = [lemanja, barretos, natal];
            previewImg=rioPreview;
    } else if ((now.getMonth = 4) || (now.getMonth = 5) || (now.getMonth = 6)) {
        //Festa do Peao de Barratos
        brCEvent = (barretos);
        rList = [lemanja, rio, natal];
        previewImg=barPreview;
    } else if (now.getMonth = 7){
        if ((now.getDate = 29) || (now.getDate = 30) || (now.getDate = 31)){
            //Christmas
            brCEvent = (natal);
            rList = [lemanja, rio, barretos];
            previewImg=natalPreview;
        } else {
            //Festa do Peao de Barratos
            brCEvent = (barretos);
            rList = [lemanja, rio, natal];
            previewImg=barPreview;
        }
    } else if ((now.getMonth = 8) || (now.getMonth = 9) || (now.getMonth = 10)){
        //Christmas
        brCEvent = (natal);
        rList = [lemanja, rio, barretos];
        previewImg=natalPreview;
    } else if (now.getMonth = 11){
        if ((now.getDate = 26) || (now.getDate = 27) || 
            (now.getDate = 28) || (now.getDate = 29) || 
            (now.getDate = 30) || (now.getDate = 31)){
                //Lemanja Festival
                brCEvent = (lemanja);
                rList = [natal, rio, barretos];
                previewImg=lemanjaPreview;
        } else {
            //Christmas
            brCEvent = (natal);
            rList = [lemanja, rio, barretos];
            previewImg=natalPreview;
        }
    }
    currentEvent = brCEvent;

    const eventPage = () => { //link to event page
        window.location.href=`/brasil/${currentEvent}`;
    }

    //determine time greetings
    var greeting;
    if (now.getHours() <= 4 ) {
        greeting=eveGreet; //night
    } else if (now.getHours() <= 11 ) {
        if (now.getHours() >= 5){
            greeting=mornGreet; //morning
        }
    } else if (now.getHours() <= 17) {
        if (now.getHours() >= 12){
            greeting=noonGreet;//afternoon
        }
    } else if (now.getHours() >= 18){
        greeting=eveGreet; //night
    } else {
        greeting=genGreet; //general
    }

    const listing = rList.map((l) => //mapping remaining events
        <p 
            className='latest-card'
            style={{padding:"10px", fontWeight:"700", cursor:"pointer"}}
            onClick={() => window.location.href=`/brasil/${l}`}>
                {l}
        </p>
    );

    var w = locData.weather;
    var weather;
    if (w) { //checking weather data has been defined
        var weat = w[Object.keys(w)[0]];
        weather =weat.main;
    } else {
        console.log("Object not yet defined");
    }

    //choosing which icons to use depending on the weather
    var icon;
    console.log(weather);
    if (weather == "Thunderstorm") {
        icon = thunderstorm;
    } else if (weather == "Drizzle") {
        icon = drizzle;
    } else if (weather == "Rain") {
        icon = rain;
    } else if (weather == "Snow"){
        icon = snow;
    } else if (weather == "Clouds"){
        icon = clouds;
    }else if (weather == ("Mist" || "Smoke" || "Haze" || "Tornado"
        || "Dust" || "Fog" || "Sand" || "Ash" || "Squall")) {
            icon = wind;
    } else if (weather == "Clear"){
        icon = clear;
    } else {
        icon = generalWeather;
    }

    return(
        <body className="br">
            <div className="links" style={{display:"inline"}}>
                <div className="CT">{ct}</div>
                <div id="SK" className="link" onClick={koPage} style={{display:"inline"}}>{sk}</div>, 
                <div id="GH" className="link" onClick={ghPage} style={{display:"inline"}}> {gh}</div> 
            </div>
            <div>
                <h1 style={{marginTop:"50px"}} id="LoT" className="title">{LoTitle}</h1>
            </div>
            <div className="centre">
                <div className="latest">
                    <h3 style={{marginTop:"-2%"}} id="LaT">{laTitle}</h3>
                    <div id="current" className="latest-card">
                        <p style={{fontWeight:"700", textAlign:"center", paddingTop:"2.5%"}}>{brCEvent}</p>
                        <img style={{marginTop:".5%"}} src={previewImg} ></img>
                    </div>
                    <button id ="CB" onClick={eventPage}>{cb}</button>
                </div>

                <div>
                    <h3 style={{marginRight:"34%"}} className="greeting">{greeting}</h3>
                    <div className="weather">
                        <iframe 
                            src={icon} 
                            frameBorder="0">
                        </iframe>
                    </div>
                </div>
            </div>

            <div className="other-events">
                <h3 id="OE">{oe}</h3>
                <div className="extra-card">{listing}</div>
            </div>
        </body>
    )
}

export default Brasil;
