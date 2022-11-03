import React, { useEffect, useState } from 'react';
import '../css/gh.css';
import i18next, { init } from 'i18next';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { useParams } from 'react-router-dom';
import app from '../firebase';
import { getDoc, getFirestore, collection, query, getDocs, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import ShareGH from './ShareGH';

function Event () {
   
    const { i18n } = useTranslation();
    const {cEvent} = useParams(); //carried from gh homepage

    //event infor and image variables
    const [eInfo, setEInfo]=useState("");
    const [eImages, setEImages]=useState("");

    //event_page titles
    const [facts, setFacts]=useState("");
    const [design,setDesign]=useState("");
    const [imageChoice, setImageChoice]=useState("");
    const [sourcebtn, setSourcebtn]=useState("");
    const [homebtn, setHomebtn]=useState("");
    const [to, setTo]=useState("");
    const [share, setShare]=useState("");

    //localisation titles
    const [BR,setBR]=useState("")
    const [CT, setCT]=useState("")
    const [SK,setSK]=useState("");

    useEffect(() => {
        //changnig the html language tag
        var lang = "en";
        document.documentElement.lang = lang;
        i18n.changeLanguage("en"); //changing the i81next language to portuguese
        const now = new Date();
        const db = getFirestore(app); //accessing firestore databasse
        
        const fetchEvent = async () => {          
            const eventRef = doc(db, "gh-en", cEvent);
            const eventSnap = await getDoc(eventRef);
            if (eventSnap.exists()) { //setting event variables using database information
                const data = eventSnap.data();
                setEInfo(data.event_info);
                setEImages(data.event_imgs);
            } else {
                window.location.href="*";
            }
        };

        const fetchPage = async () => { 
            const pageRef = doc (db,"gh-en","event_pages");
            const pageSnap = await getDoc(pageRef);
            if (pageSnap.exists()){ //setting page title variables using database information
                const pageData = pageSnap.data();
                setFacts(pageData.fun_facts_title);
                setDesign(pageData.design_title);
                setImageChoice(pageData.image_choice_title);
                setSourcebtn(pageData.source_button);
                setHomebtn(pageData.home_title);
                setTo(pageData.to);
                setShare(pageData.share);
            }
        };

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

        fetchEvent().catch(console.error);
        fetchPage().catch(console.error);
        fetchHomepage().catch(console.error);
        
    }, []);

    const brPage = () => { //link to brazilian localisation
        window.location.href = "/brasil";
    }
    
    const koPage = () => { //link to korean localisation
        window.location.href = "/hangug";
    }

    var showImg = [];
    var showSrc = [];
    var ob;
    for (var i =0;i<Object.keys(eImages).length;i++){
        //putting images and image sources from the daatabase into lists 
        ob = eImages[Object.keys(eImages)[i]] ;
        showImg.push(ob.img);
        showSrc.push(ob.src)
    }

    //setting inital image in card preview
    const [currentImg, setCurrentImg] = useState(showImg[0]);
    useEffect (() => {setCurrentImg(showImg[0])}, [showImg[0]]);

    const allImages = showImg.map((im) => //mapping all images
        <img key={im}
            src = {im}
            className= "imgCardOptions"
            onClick={() => setCurrentImg(im)}
             />
    );

    const allSources = showSrc.map((sr) => //mapping all sources
        <div key={sr}
             >{sr}; </div>
    );

    const [nameChange, setNameChange] = useState("");
    const [messageChange, setMessageChange] = useState("");
    const [previewShown, setPreviewShown] = useState(false);
    
    const shareCard = (e) => { //function to show the share page
            e.preventDefault();
            setPreviewShown(true);
    }

    const [srcToggleOn, setSrcToggleOn]=useState(false);

    const imgSources = (e) => { //toggle to show iamge sources
        e.preventDefault();
        if (srcToggleOn){
            setSrcToggleOn(false);
        } else {
            setSrcToggleOn(true);
        }
    }
    
    return(
        <body className="gh">
            {previewShown && <ShareGH name={nameChange} msg={messageChange} img={currentImg} /> } 
        <div className={ previewShown ? "hide" : ""}>
            <a href="/ghana">{homebtn}</a>
            <div className="links" style={{display:"inline"}}>
                <div className="CT">{CT}</div>
                <div id="SK" className="link" onClick={koPage} style={{display:"inline"}}>{SK}</div>, 
                <div id="BR" className="link" onClick={brPage} style={{display:"inline"}}> {BR}</div> 
              </div>
            <div>
                <h1 className="title">{cEvent}</h1>
            </div>
           <div>
                <div>
                    <h1 className='designTitle'>{design}</h1>
                    <div className="previewMessage">
                        <div className="in">
                            <p>{to} {nameChange}</p>
                            <p className="msg">{messageChange} </p>
                            <img src={currentImg} alt={`${cEvent} card image`}></img>
                        </div>
                        {localStorage.setItem("nameGH", nameChange)}
                        {localStorage.setItem("msgGH", messageChange)}
                        {localStorage.setItem("imgGH", currentImg)}
                        {localStorage.setItem("eventGH", cEvent)}
                    </div>
                </div>
                <div className="writeMessage">
                    <form>
                        <input 
                            type="text"
                            value={nameChange} 
                            onChange={e => setNameChange(e.target.value)} 
                            placeholder='To:'>
                        </input>
                        <textarea 
                            type="text"
                            value={messageChange} 
                            onChange={e =>{
                                var msg = e.target.value;
                                setMessageChange(msg)
                            }} 
                            style={{height:"200px"}} 
                            placeholder='Message:'>
                        </textarea>
                        <button type='submit' onClick={shareCard}>{share}</button>
                    </form>
                </div>
           </div>

           <div className='imageList'>
                <h3>{imageChoice}</h3>   
                <div className='IL'>
                    {allImages}
                </div>
            </div>
           
            <div className="fun-facts">
                <h3 id="funTitle" style={{fontSize:"25px"}}>{facts} {cEvent}!</h3>
                <div className="info">
                    <p dang dangerouslySetInnerHTML={{ __html:eInfo}} id="eventInfo"></p>
                </div>
            </div>
            
            <div className='sources'>
                <button  onClick={imgSources}>{sourcebtn}</button>
                <a className={srcToggleOn ? "" : "hide"}>{allSources}</a>
            </div>
          
        </div>
        </body>
    )
}

export default Event;
