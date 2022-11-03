import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/ko.css';
import '../i18n';
import { useParams } from 'react-router';
import app from '../firebase';
import { doc, getDoc, getFirestore } from "firebase/firestore";


export default function Hangug (){

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
    const [br, setBR]=useState("");
    const [cb, setCB]=useState("");
    const [ct, setCT]=useState("");
    const [laTitle, setLaTitle]=useState("");
    const [LoTitle, setLoTitle]=useState("");
    const [oe, setOE]=useState("");
    const [gh, setGH]=useState("");

    //time greeting variable
    const [genGreet, setGenGreet]=useState("");

    //event variables
    const [bor, setBor] = useState("");
    const [jeju, setJeju] = useState("");
    const [lant, setLant]=useState("");
    const [xmas, setXmas]=useState("");

    //image preview variables
    const [borPreview, setBorPreview]=useState("");
    const [jejuPreview, setJejuPreview]=useState("");
    const [lantPreview, setLantPreview]=useState("");
    const [xmasPreview, setXmasPreview]=useState("");

    useEffect(() => {
        //changing the html language tag  
        var lang = "ko";
        document.documentElement.lang = lang;
        i18n.changeLanguage("ko"); //changing the i18next language to korean
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
            const homeRef = doc(db, "ko-ko", "homepage");
            const homeSnap = await getDoc(homeRef);
            if (homeSnap.exists()){ //setting homepage title variables
                const homeData = homeSnap.data();
                setBR(homeData.brazilian);
                setCB(homeData.click_button);
                setCT(homeData.culture_title);
                setLaTitle(homeData.latest_title);
                setLoTitle(homeData.locale_title);
                setOE(homeData.other_events);
                setGH(homeData.ghanaian);
            }
        };

        const fetchTimes = async () => {    
            const timeRef = doc(db, "ko-ko","time_greetings");
            const timeSnap = await getDoc(timeRef);
            if (timeSnap.exists()){ //setting time variable using database information
                const timeData = timeSnap.data();
                setGenGreet(timeData.general);
            }
        };

        const fetchEvents = async () => {    
            const eventRef = doc(db,"ko-ko","all_events");
            const eventSnap = await getDoc(eventRef);
            if (eventSnap.exists()){ //setting event variables using database information
                const eventData = eventSnap.data();
                setBor(eventData.koevent1);
                setJeju(eventData.koevent2);
                setLant(eventData.koevent3);
                setXmas(eventData.koevent4);
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
            const preRef1 = doc(db,"ko-ko","보령머드축제");
            const preSnap1 = await getDoc(preRef1);
            if (preSnap1.exists()){
                const preData1 = preSnap1.data();
                setBorPreview(preData1.event_imgs.img0.img);
            }

            const preRef2 = doc(db,"ko-ko","제주불축제");
            const preSnap2 = await getDoc(preRef2);
            if (preSnap2.exists()){
                const preData2 = preSnap2.data();
                setJejuPreview(preData2.event_imgs.img0.img);
            }

            const preRef3 = doc(db,"ko-ko","서울등불축제");
            const preSnap3 = await getDoc(preRef3);
            if (preSnap3.exists()){
                const preData3 = preSnap3.data();
                setLantPreview(preData3.event_imgs.img0.img);
            }

            const preRef4 = doc(db,"ko-ko","크리스마스");
            const preSnap4 = await getDoc(preRef4);
            if (preSnap4.exists()){
                const preData4 = preSnap4.data();
                setXmasPreview(preData4.event_imgs.img0.img);
            }
        };

        fetchHomepage().catch(console.error);
        fetchTimes().catch(console.error);
        fetchEvents().catch(console.error);
        fetchLocation().catch(console.error);
        fetchWeather().catch(console.error);
        fetchPreview().catch(console.error);

    }, [lat, long]);

    const brPage = () => { //link to brazilian localisation
        window.location.href = "/brasil";
    }
    
    const ghPage = () => { //link to ghanaian localisation
        window.location.href = "/ghana";
    }

    var rList;
    var koCEvent;
    var previewImg;
    //determinig which events to show based on date
    if ((now.getMonth = 1) || (now.getMonth = 0)) {
            //Jeju Fire Festival
            koCEvent = jeju;
            rList=[lant,bor,xmas];
            previewImg=jejuPreview;
    }else if (now.getMonth = 2){
        if ((now.getDate = 21) || (now.getDate = 22) || (now.getDate = 23)
            || (now.getDate = 24) || (now.getDate = 25) || (now.getDate = 26)
            || (now.getDate = 27) || (now.getDate = 28) || (now.getDate = 29)
            || (now.getDate = 30) || (now.getDate = 31)){
            //Boryeong Mud Festival
            koCEvent = bor;
            rList=[lant,jeju,xmas];
            previewImg=borPreview;
        } else {
            //Jeju Fire Festival
            koCEvent = jeju;
            rList=[lant,bor,xmas];
            previewImg=jejuPreview;
        }
    } else if ((now.getMonth = 3) || (now.getMonth = 4) || (now.getMonth = 5) || (now.getMonth = 6)) {
        //Boryeong Mud Festival
        koCEvent = bor;
        rList=[lant,jeju,xmas];
        previewImg=borPreview;
    } else if (now.getMonth = 7){
        if ((now.getDate = 29) || (now.getDate = 30) || (now.getDate = 31)){
            //Seoul Lantern Festival
            koCEvent = lant;
            rList=[jeju,bor,xmas];
            previewImg=lantPreview;
        } else {
            //Boryeong Mud Festival
            koCEvent = bor;
            rList=[lant,jeju,xmas];
            previewImg=borPreview;
        }
    } else if ((now.getMonth = 8) || (now.getMonth = 9) || (now.getMonth = 10)){
        //Seoul Lantern Festival
        koCEvent = lant;
        rList=[jeju,bor,xmas];
        previewImg=lantPreview;
    } else if (now.getMonth = 11){
        if ((now.getDate = 1) || (now.getDate = 2) || (now.getDate = 3) ||
        (now.getDate = 4) || (now.getDate = 5)){
            //Seoul Lantern Festival
            koCEvent = lant;
            rList=[jeju,bor,xmas];
            previewImg=lantPreview;
        } else {
            //Christmas
            koCEvent = xmas;
            rList=[lant,bor,jeju];
            previewImg=xmasPreview;
        }
    }
    currentEvent = koCEvent;

    const eventPage = () => { //link to event page
        window.location.href=`/hangug/${currentEvent}`;
    }

    const listing = rList.map((l) => //mapping remaining events 
        <p  
            className='latest-card'
            style={{padding:"10px", fontWeight:"700", cursor:"pointer"}}
            onClick={() => window.location.href=`/hangug/${l}`}>
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
        <body className="kor">
            <div className="links" style={{display:"inline"}}>
                <div className="CT">{ct}</div>
                <div id="BR" className="link" onClick={brPage} style={{display:"inline"}}>{br}</div>, 
                <div id="GH" className="link" onClick={ghPage} style={{display:"inline"}}> {gh}</div>  
            </div>
            <div>
                <h1 style={{marginTop:"50px"}} id="LoT" className="title">{LoTitle}</h1>
            </div>
            <div className="centre">
                <div className="latest">
                    <h3 style={{marginTop:"-2%"}} id ="LaT">{laTitle}</h3>
                    <div id="current" className="latest-card">
                        <p style={{fontWeight:"700", textAlign:"center", paddingTop:"2.5%"}}>{koCEvent}</p>
                        <img style={{marginTop:".5%"}} src={previewImg} ></img>
                    </div>           
                    <button id ="CB" onClick={eventPage}>{cb}</button>
                </div>

                <div>
                    <h3 style={{marginRight:"34%"}} className="greeting">{genGreet}</h3>
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