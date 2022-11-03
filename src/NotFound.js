import React, { useEffect, useState } from "react";
import i18next from "i18next";
import "./i18n";
import Lottie from 'react-lottie';
import animationData from './lotties/bouncy-404.json';
import app from './firebase';
import { getFirestore, getDoc, doc } from "firebase/firestore";


export default function NotFound() {
    //localisation variable
    const [loc, setLoc]=useState("");

    //page title variables
    const [title, setTitle]=useState("");
    const [errorMsg, setErrorMsg]=useState("");
    const [link, setLink]=useState("");

    useEffect(()=> {
        //checking user's browser language
        if (i18next.language == "en"|| i18next.language.substring(0,3) == "en-"){ //accounting for all english codes
            setLoc("gh");
        } else if (i18next.language == "ko"){
            setLoc("kor");
        } else if (i18next.language == "pt" || i18next.language == "pt-BR"){
            setLoc("br");
        } else {
            setLoc("gh");
        }
        //reloading page only once
        if(!window.location.hash) {
            window.location = window.location + '#error';
            window.location.reload();
        }

        //getting correct database based on previously identified browser langauge and localisation
        var data;
        if (loc=="gh"){
            data="gh-en";
        } else if (loc == "kor") {
            data="ko-ko";
        } else if (loc == "br") {
            data="br-pt";
        } else {
            data ="gh-en";
        }

        const db = getFirestore(app); //accessing database
        const fetchPage = async () => {
            const pageRef = doc(db, data, "404_page");
            const pageSnap = await getDoc(pageRef);
            if (pageSnap.exists()){ //setting page titles using firestore database
                const pageData = pageSnap.data();
                setTitle(pageData.error_title);
                setErrorMsg(pageData.error_msg);
                setLink(pageData.error_link);
            }
        }
        fetchPage().catch(console.error);
    });

    const lottieOptions = { //setting lottle options using animation json file 
        loop:true,
        autoplay:true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return(
        <body style={{minHeight:"100vh", textAlign:"center"}} className={loc}>
            <h1 className="green blue">{title}</h1>
            <Lottie options={lottieOptions}
                    height={300}
                    width={400} 
                    />
            <h2>{errorMsg}</h2>
            <a href="/"><u>{link}</u></a>
        </body>
         );
}