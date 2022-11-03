import React, { useEffect, useState } from 'react';
import '../css/gh.css';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { useParams } from 'react-router-dom';
import app from '../firebase';
import { doc, getDoc, getFirestore, collection, addDoc } from "firebase/firestore";
import Event from './EventPage';
import { WhatsappShareButton, TelegramShareButton, FacebookShareButton, EmailShareButton } from "react-share";
import { WhatsappIcon, TelegramIcon, FacebookIcon, EmailIcon } from "react-share";


export default function ShareGH (props) {
   
    const { i18n } = useTranslation();
    const {cEvent} = useParams(); //carried from gh homepage
    const [id, setID]=useState(""); //id variable

    //localisation variables
    const [BR,setBR]=useState("")
    const [CT, setCT]=useState("")
    const [SK,setSK]=useState("");

    //share page titles
    const [celeb, setCeleb]=useState("");
    const [to,setTo]=useState("");
    const [home, setHome]=useState("");
    const [shareTitle, setShareTitle]=useState("");

    //variable for going back to event page
    const [goBack, setGoBack] = useState(false); 

    useEffect(() => {
        //changing the html language tag
        var lang = "en";
        document.documentElement.lang = lang;
        i18n.changeLanguage("en"); //changing the i18next language to english
        const now = new Date();
        const db = getFirestore(app); //accessing firestore database

        const fetchHomepage = async () => {
            const homeRef = doc(db, "gh-en", "homepage");
            const homeSnap = await getDoc(homeRef);
            if (homeSnap.exists()){ //setting page variables using homepage collection
                const homeData = homeSnap.data();
                setBR(homeData.brazilian);
                setCT(homeData.culture_title);
                setSK(homeData.south_korean);
            }
        };

        const writeCard = async () => { //writing the card to the database
            const n = localStorage.getItem("nameGH");
            const m = localStorage.getItem("msgGH");
            const i = localStorage.getItem("imgGH");
            const e = localStorage.getItem("eventGH");
            const cardRef = await addDoc(collection(db, "cards"), {
                locale: "gh",
                name: n,
                msg: m,
                img: i,
                event: e
            });
            return cardRef.id;
        };

        const fetchPage = async () => { //setting page title variables using database information
            const pageRef = doc(db, "gh-en", "share_page");
            const pageSnap = await getDoc(pageRef);
            if (pageSnap.exists()){
                const pageData = pageSnap.data();
                setCeleb(pageData.celebrating_title);
                setTo(pageData.to);
                setHome(pageData.home_link);
                setShareTitle(pageData.share_card_title);
            }
        };
        
        writeCard()
        .then((val) => {
            console.log(val);
            setID(val); //setting id variable
        })
        .catch(console.error);
        fetchHomepage().catch(console.error);
        fetchPage().catch(console.error);

    }, []);

    const brPage = () => { //link to brazilian localisation
        window.location.href = "/brasil";
    }
    
    const koPage = () => { //link to korean localisation
        window.location.href = "/hangug";
    }
     
    return(
        <body style={{padding:"0", height:"110vh"}} className="gh">
            {goBack && <Event />}
        <div className={ goBack ? "hide" : ""}>
            <a href="/ghana">{home}</a>
            <div className="links" style={{display:"inline"}}>
            <div className="CT">{CT}</div>
                <div id="SK" className="link" onClick={koPage} style={{display:"inline"}}>{SK}</div>, 
                <div id="BR" className="link" onClick={brPage} style={{display:"inline"}}> {BR}</div> 
              </div>
            <div>
                <h1 className="title">{shareTitle} {cEvent}!</h1>
            </div>
           
           <div>
                <div>
                    <div className="share previewMessage">
                        <div className="in">
                            <h1>{celeb} {cEvent}!</h1>
                            <p>{to} {props.name}</p>
                            <p>{props.msg}</p>
                            <img src={props.img} alt={`${cEvent} card image`}></img>
                        </div>
                    </div>
                </div>
                
                <div className="shareButtons">
                    <div style={{fontSize:"x-large"}} className='shareTitle'>Share your card!</div>
                    <br />

                    <WhatsappShareButton
                        url={`https://adapt-inter-web.web.app/card/${id}`}
                        title={`I made a card for ${cEvent}! Click the link to see it!`}>
                        <WhatsappIcon size={62} round />
                    </WhatsappShareButton>
                    <br />

                    <FacebookShareButton
                        url={`https://adapt-inter-web.web.app/card/${id}`}
                        quote={`I made a card for ${cEvent}! Click the link to see it!`}
                        hashtag={`#${cEvent}`}
                        >
                        <FacebookIcon size={62} round /> 
                    </FacebookShareButton>
                    <br />

                    <TelegramShareButton
                        url={`https://adapt-inter-web.web.app/card/${id}`}
                        title={`I made a card for ${cEvent}! Click the link to see it!`}>
                        <TelegramIcon size={62} round />
                    </TelegramShareButton>
                    <br />

                    <EmailShareButton 
                    subject={cEvent} 
                    body={`Hello ${props.name}, ${props.msg}. See this card online at https://adapt-inter-web.web.app/card/${id}`} >
                        <EmailIcon size={62} round />
                    </EmailShareButton>
                    <br />                                       
                </div>

                <div style={{float:"left"}} className='backTitle'>
                    <div style={{fontWeight:"700"}}>Want to change your card message?</div> 
                    <div style={{cursor:"pointer"}} onClick={()=>setGoBack(true)}><u>Click here to go back!</u></div>
                </div>
           </div>
        </div>  
        </body>
    )
}