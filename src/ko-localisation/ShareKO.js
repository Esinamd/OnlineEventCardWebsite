import React, { useEffect, useState } from 'react';
import '../css/gh.css';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { useParams } from 'react-router-dom';
import app from '../firebase';
import { getDoc, doc, getFirestore, collection, addDoc } from "firebase/firestore";
import KOEvent from './KoEvents';
import { FacebookShareButton, EmailShareButton } from "react-share";
import {FacebookIcon, EmailIcon } from "react-share";
import { NaverBlogButton, KaKaoStoryButton } from "react-social-kr";


export default function ShareKO (props) {
   
    const { i18n } = useTranslation();
    const [id, setID]=useState(""); //id variable

    //naver and kakaoStory logos
    const [naverLogo, setNaverLogo]=useState("");
    const [kakaoLogo, setKakaoLogo]=useState("");

    //localisation variables
    const [BR,setBR]=useState("")
    const [CT, setCT]=useState("")
    const [GH,setGH]=useState("");

    //share page titles
    const [celeb, setCeleb]=useState("");
    const [to,setTo]=useState("");

    //variable for going back to event page
    const [goBack, setGoBack] = useState(false); 

    useEffect(() => {
        //changing the html language tag
        var lang = "ko";
        document.documentElement.lang = lang;
        i18n.changeLanguage("ko"); //changing the i18next language to korean
        const now = new Date();
        const db = getFirestore(app); //accessing firestore database

        const fetchLogos = async () => {
            const logoRef = doc(db, "ko-ko", "logos");
            const logoSnap = await getDoc(logoRef);
            if (logoSnap.exists()){ //setting logo variables using stored image sources 
                const logoData = logoSnap.data();
                setNaverLogo(logoData.naver);
                setKakaoLogo(logoData.kakaostory);
            }
        };

        const fetchHomepage = async () => {
            const homeRef = doc(db, "ko-ko", "homepage");
            const homeSnap = await getDoc(homeRef);
            if (homeSnap.exists()){ //setting page variables using homepage collection
                const homeData = homeSnap.data();
                setBR(homeData.brazilian);
                setCT(homeData.culture_title);
                setGH(homeData.ghanaian);
            }
        };

        const writeCard = async () => { //writing the card to the database
            const n = localStorage.getItem("nameKO");
            const m = localStorage.getItem("msgKO");
            const i = localStorage.getItem("imgKO");
            const e = localStorage.getItem("eventKO");
            const cardRef = await addDoc(collection(db, "cards"), {
                locale: "kor",
                name: n,
                msg: m,
                img: i,
                event: e
            });
            return cardRef.id;
        };

        const fetchPage = async () => {
            const pageRef = doc(db, "ko-ko", "share_page");
            const pageSnap = await getDoc(pageRef);
            if (pageSnap.exists()){ //setting page title variables using database information
                const pageData = pageSnap.data();
                setCeleb(pageData.celebrating_title);
                setTo(pageData.to);
            }
        }
        
        writeCard()
        .then((val) => {
            console.log(val);
            setID(val); //setting id variable
        })
        .catch(console.error);
        fetchHomepage().catch(console.error);
        fetchLogos().catch(console.error);
        fetchPage().catch(console.error);
        
    }, []);

    const ghPage = () => { //link to ghanaian localisation
        window.location.href = "/ghana";
    }
    
    const brPage = () => { //link to brazilian localisation
        window.location.href = "/brasil";
    }
     
    return(
        <body style={{padding:"0", height:"110vh"}} className="kor">
            {goBack && <KOEvent />}
        <div className={ goBack ? "hide" : ""}>
            <a href="/hangug">홈페이지</a>
            <div className="links" style={{display:"inline"}}>
            <div className="CT">{CT}</div>
                <div id="GH" className="link" onClick={ghPage} style={{display:"inline"}}>{GH}</div>, 
                <div id="BR" className="link" onClick={brPage} style={{display:"inline"}}> {BR}</div> 
              </div>
            <div>
                <h1 className="title">카드 공유 {props.event}!</h1>
            </div>
           
           <div>
                <div>
                    <div className="share previewMessage">
                        <div className="in">
                            <h1 className="blue">{celeb} {props.event}!</h1>
                            <p>{to} {props.name} </p>
                            <p>{props.msg} </p>
                            <img src={props.img} alt={`${props.event} card image`}></img>
                        </div>
                    </div>
                </div>
                
                <div className="shareButtons">
                    <div style={{fontSize:"x-large"}} className='shareTitle'>당신의 카드를 공유하세요!</div>
                    <br />
                    
                    <NaverBlogButton
                        pathname={`https://adapt-inter-web.web.app/card/${id}`}
                        message={`를 위한 카드를 만들었습니다 ${props.event}! 링크를 클릭하시면 보실 수 있습니다!`}
                        title={`${props.event}`}
                        >
                        <img 
                            className='logo'
                            src={naverLogo}
                            alt="Naver" />
                    </NaverBlogButton>

                    <br />
                    <FacebookShareButton
                        url={`https://adapt-inter-web.web.app/card/${id}`}
                        quote={`를 위한 카드를 만들었습니다 ${props.event}! 링크를 클릭하시면 보실 수 있습니다!`}
                        hashtag={`#${props.event}`}>
                        <FacebookIcon size={62} round /> 
                    </FacebookShareButton>
                    <br />
                    <KaKaoStoryButton
                        pathname={`https://adapt-inter-web.web.app/card/${id}`}
                        message={`를 위한 카드를 만들었습니다 ${props.event}! 링크를 클릭하시면 보실 수 있습니다!`}
                        title={`${props.event}`}
                        >
                        <img 
                        className='logo'
                        src={kakaoLogo}
                        alt="Naver" />
                    </KaKaoStoryButton>
                    <br />
                    <EmailShareButton 
                    subject={props.event} 
                    body={`안녕하세요 ${props.name}, ${props.msg}. 이 카드를 온라인에서 확인하세요 https://adapt-inter-web.web.app/card/${id}`} >
                        <EmailIcon size={62} round />
                    </EmailShareButton>
                    <br />                                       
                </div>

                <br/>

                <div style={{float:"left"}} className='backTitle'>
                    <div style={{fontWeight:"900"}}>카드 메시지를 변경하고 싶으십니까?</div> 
                    <div style={{cursor:"pointer", fontWeight:"300"}} onClick={()=>setGoBack(true)}><u>돌아가려면 여기를 클릭하세요!</u></div>
                </div>
           </div>
        </div>  
        </body>
    )
}