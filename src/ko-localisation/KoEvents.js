import React, { useEffect, useState } from 'react';
import '../css/ko.css';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { useParams } from 'react-router-dom';
import app from '../firebase';
import { getDoc, getFirestore, doc } from "firebase/firestore";
import ShareKO from './ShareKO';

export default function KOEvent () {
   
    const { i18n } = useTranslation();
    const {koCEvent} = useParams(); //carried from ko homepage

    //event info and images variables
    const [eInfo, setEInfo]=useState("");
    const [eImages, setEImages]=useState("");

    //event_page titles
    const [facts, setFacts]=useState("");
    
    //localisation titles
    const [BR,setBR]=useState("")
    const [CT, setCT]=useState("")
    const [GH,setGH]=useState("");

    useEffect(() => {
        //changing the html language tag
        var lang = "ko";
        document.documentElement.lang = lang;
        i18n.changeLanguage("ko"); //changing the i18next language to korean
        const now = new Date();
        const db = getFirestore(app); //accessing firestore database

        const fetchEvent = async () => {
            const eventRef = doc(db, "ko-ko", koCEvent);
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
            const pageRef = doc (db,"ko-ko","event_pages");
            const pageSnap = await getDoc(pageRef);
            if (pageSnap.exists()){  //setting page title variables using database information
                const pageData = pageSnap.data();
                setFacts(pageData.fun_facts_title);
                // setDesign(pageData.design_title);
                // setImageChoice(pageData.image_choice_title);
                // setSourcebtn(pageData.source_button);
                // setHomebtn(pageData.home_title);
                // setTo(pageData.to);
                // setShare(pageData.share);
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
        
        fetchEvent().catch(console.error);
        fetchPage().catch(console.error);
        fetchHomepage().catch(console.error);

    }, []);

    const ghPage = () => { //link to ghanaian localisation
        window.location.href = "/ghana";
    }
    
    const brPage = () => { //link to brazilian localisation
        window.location.href = "/brasil";
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

    const imgSources = (e) => { //toggle to show image sources
        e.preventDefault();
        if (srcToggleOn){
            setSrcToggleOn(false);
        } else {
            setSrcToggleOn(true);
        }
    }
  
    return(
        <body className="kor">
            {previewShown && <ShareKO name={nameChange} msg={messageChange} img={currentImg} event={koCEvent}/> }
        <div className={ previewShown ? "hide" : ""}>
            <a href="/hangug">홈페이지</a>
            <div className="links" style={{display:"inline"}}>
            <div className="CT">{CT}</div>
                <div id="BR" className="link" onClick={brPage} style={{display:"inline"}}>{BR}</div>, 
                <div id="GH" className="link" onClick={ghPage} style={{display:"inline"}}> {GH}</div> 
              </div>
            <div>
                <h1 className="title">{koCEvent}</h1>
            </div>
           
           <div>
                <div>
                    <h1 className='designTitle blue'>아래에서 당신의 카드를 디자인하십시오!</h1>
                    <div className="previewMessage">
                        <div className="in">
                            <p>에게 {nameChange} </p>
                            <p>{messageChange} </p>
                            <img src={currentImg} alt={`${koCEvent} card image`}></img>
                        </div>
                        {localStorage.setItem("nameKO", nameChange)}
                        {localStorage.setItem("msgKO", messageChange)}
                        {localStorage.setItem("imgKO", currentImg)}
                        {localStorage.setItem("eventKO", koCEvent)}
                    </div>
                </div>
                <div className="writeMessage">
                    <form>
                        <input 
                            type="text"
                            value={nameChange} 
                            onChange={e => setNameChange(e.target.value)} 
                            placeholder='에게:'>
                        </input>
                        <textarea
                            type="text" 
                            value={messageChange} 
                            onChange={e =>{
                                var msg = e.target.value;
                                setMessageChange(msg)
                            }} 
                            style={{height:"200px"}} 
                            placeholder='메세지:'>
                        </textarea>
                        <button type='submit' onClick={shareCard}>공유하다</button>
                    </form>
                </div>
           </div>

           <div className='imageList'>
                <h3>보낼 이미지를 선택하십시오!</h3>
                <div className='IL'>
                    {allImages}
                </div>
            </div>
           
            <div className="fun-facts">
                <h3 id="funTitle" style={{fontSize:"25px"}}>{facts} {koCEvent}!</h3>
                <div className="info">
                    <p dang dangerouslySetInnerHTML={{ __html:eInfo}} id="eventInfo"></p>
                </div>
            </div>

            <div className='sources'>
                <button  onClick={imgSources}>이미지 소스</button>
                <h3 className={srcToggleOn ? "red" : "hide"}>{allSources}</h3>
            </div>
            
        </div>
        </body>
    )
}