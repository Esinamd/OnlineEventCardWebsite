import React, { useState, useEffect} from 'react';
import app from './firebase';
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import './css/gh.css';
import './css/br.css';
import './css/ko.css';

export default function ShowCard() {
    //card information variables
    const { id } = useParams();
    const [loc, setLoc]=useState("");
    const [name, setName]= useState("");
    const [msg, setMsg]= useState("");
    const [img, setImg] = useState("");
    const [event, setEvent]=useState("");

    //page title variables
    const [celeb, setCeleb]=useState("");
    const [to,setTo]=useState("");

    useEffect(() => {        
        const fetchCard = async () => {
            const cardRef = doc(db, "cards", id);
            const cardSnap = await getDoc(cardRef);
            if (cardSnap.exists()) { // 
                //setting the card variables using information from the database 
                const data =cardSnap.data();
                setLoc(data.locale);
                setName(data.name);
                setMsg(data.msg);
                setImg(data.img);
                setEvent(data.event);
            }else {
                window.location.href="*";
            }
        };

        //determining database to use based on localisation from card info
        var lang;
        var data;
        if (loc=="gh"){
            lang="en";
            data="gh-en";
        } else if (loc == "kor") {
            lang="ko";
            data="ko-ko";
        } else if (loc == "br") {
            lang ="pt";
            data="br-pt";
        } else {
            lang = "en";
            data ="gh-en";
        }
        document.documentElement.lang = lang;

        const db = getFirestore(app); //accessing database
        const fetchPage = async () => {
            const pageRef = doc(db, data, "share_page");
            const pageSnap = await getDoc(pageRef);
            if (pageSnap.exists()){ //setting parge variables using database information
                const pageData = pageSnap.data();
                setCeleb(pageData.celebrating_title);
                setTo(pageData.to);
            }
        }

        fetchCard().catch(console.error);
        fetchPage().catch(console.error);

    });

    return (
        <body style={{minHeight:"100vh" }} className={loc}>
        <div style={{width:'85%'}} className="previewMessage">
            <div className="in">
                <h1 className='blue green'>{celeb} {event}!</h1>
                <p>{to} {name} <br/> {msg}</p> <br />
                <img src={img} alt={`${event} card image`}></img>
            </div>
        </div>
    </body>
         
    );
}