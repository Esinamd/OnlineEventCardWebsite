import React, { useEffect, useState } from 'react';
import '../css/gh.css';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { useParams } from 'react-router-dom';
import app from '../firebase';
import { doc, getDoc, getFirestore, collection, addDoc } from "firebase/firestore";
import BREvent from './BrEvents';
import { WhatsappShareButton, TwitterShareButton, FacebookShareButton, EmailShareButton } from "react-share";
import { WhatsappIcon, TwitterIcon, FacebookIcon, EmailIcon } from "react-share";


function ShareBR (props) {
   
    const { i18n } = useTranslation();
    const [id, setID]=useState(""); //id variable

    //localisation titles
    const [GH,setGH]=useState("")
    const [CT, setCT]=useState("")
    const [SK,setSK]=useState("");

    //share page titles
    const [celeb, setCeleb]=useState("");
    const [to,setTo]=useState("");

    //variable for going back to event page
    const [goBack, setGoBack] = useState(false); 

    useEffect(() => {
        //changing the html language tag
        var lang = "pt";
        document.documentElement.lang = lang;
        i18n.changeLanguage("pt");//changing the i18next language to portuguese
        const now = new Date();
        const db = getFirestore(app); //accessing firestore database
       
        const fetchHomepage = async () => {
            const homeRef = doc(db, "br-pt", "homepage");
            const homeSnap = await getDoc(homeRef);
            if (homeSnap.exists()){ //setting page variables using homepage collection
                const homeData = homeSnap.data();
                setGH(homeData.ghanaian);
                setCT(homeData.culture_title);
                setSK(homeData.south_korean);
            }
        };

        const writeCard = async () => { //writing the card to the database
            const n = localStorage.getItem("nameBR");
            const m = localStorage.getItem("msgBR");
            const i = localStorage.getItem("imgBR");
            const e = localStorage.getItem("eventBR");
            const cardRef = await addDoc(collection(db, "cards"), {
                locale: "br",
                name: n,
                msg: m,
                img: i,
                event: e
            });
            return cardRef.id
        };

        const fetchPage = async () => {
            const pageRef = doc(db, "br-pt", "share_page");
            const pageSnap = await getDoc(pageRef);
            if (pageSnap.exists()){ //setting page title variables using database information
                const pageData = pageSnap.data();
                setCeleb(pageData.celebrating_title);
                setTo(pageData.to);
            }
        };
        
        writeCard()
        .then((val) => {
            console.log(val);
            setID(val); //setting id variable
        })
        .catch(console.error)
        fetchHomepage().catch(console.error); 
        fetchPage().catch(console.error); 

    }, []);

    const ghPage = () => { //link to ghanaian localisation
        window.location.href = "/ghana";
    }
    
    const koPage = () => { //link to brazilian localisation
        window.location.href = "/hangug";
    }

    return(
        <body style={{padding:"0", height:"123vh"}} className="br">
            {goBack && <BREvent />}
        <div className={ goBack ? "hide" : ""}>
            <a href="/brasil">Pagina inicial</a>
            <div className="links" style={{display:"inline"}}>
            <div className="CT">{CT}</div>
                <div id="SK" className="link" onClick={koPage} style={{display:"inline"}}>{SK}</div>, 
                <div id="GH" className="link" onClick={ghPage} style={{display:"inline"}}> {GH}</div> 
              </div>
            <div>
                <h1 className="title">Compartilhe seu cartão para {props.event}!</h1>
            </div>
           
           <div>
                <div>
                    <div className="share previewMessage">
                        <div className="in">
                            <h1 className='green' >{celeb} {props.event}!</h1>  
                            <p>{to} {props.name}</p>
                            <p>{props.msg}</p>
                            <img src={props.img} alt={`${props.event} card image`}></img>
                        </div>
                    </div>
                </div>

                
                <div className="shareButtons">
                    <div style={{fontSize:"x-large"}} className='shareTitle'>Compartilhe seu cartão!</div>
                    <br />

                    <WhatsappShareButton
                        url={`https://adapt-inter-web.web.app/card/${id}`}
                        title={`Eu fiz um cartão para ${props.event}! Clique no link para ver!`}>
                        <WhatsappIcon size={62} round />
                    </WhatsappShareButton>
                    <br />
                    <FacebookShareButton
                        url={`https://adapt-inter-web.web.app/card/${id}`}
                        quote={`Eu fiz um cartão para ${props.event}! Clique no link para ver!`}
                        hashtag={`#${props.event}`}
                        >
                        <FacebookIcon size={62} round /> 
                    </FacebookShareButton>
                    <br />
                    <TwitterShareButton
                        url={`https://adapt-inter-web.web.app/card/${id}`}
                        title={`Eu fiz um cartão para ${props.event}! Clique no link para ver!`}>
                        <TwitterIcon size={62} round />
                    </TwitterShareButton>
                    <br />
                    <EmailShareButton 
                    subject={props.event} 
                    body={`Olá ${props.name}, ${props.msg}. Veja este cartão online em https://adapt-inter-web.web.app/card/${id}`} >
                        <EmailIcon size={62} round />
                    </EmailShareButton>
                    <br/>                                       
                </div>

                <div style={{float:"left"}} className='backTitle'>
                    <div style={{fontWeight:"700"}}>Quer mudar a mensagem do seu cartão?</div> 
                    <div style={{cursor:"pointer"}} onClick={()=>setGoBack(true)}><u>Clique aqui para voltar!</u></div>
                </div>
           </div>
        </div>  
        </body>
    )
}

export default ShareBR;
