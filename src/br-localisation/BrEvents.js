import React, { useEffect, useState } from 'react';
import '../css/br.css';
import { useTranslation } from 'react-i18next';
import '../i18n';
import { useParams } from 'react-router-dom';
import app from '../firebase';
import { getDoc, getFirestore, doc } from "firebase/firestore";
import ShareBR from './ShareBr';

export default function BREvent () {
   
    const { i18n } = useTranslation();
    const {brCEvent} = useParams(); //carried from br homepage

    //event infor and images variables
    const [eInfo, setEInfo]=useState("");
    const [eImages, setEImages]=useState("");

    //event page titles
    const [facts, setFacts]=useState("");

    //localisation titles
    const [GH,setGH]=useState("")
    const [CT, setCT]=useState("")
    const [SK,setSK]=useState("");

    useEffect(() => {
        //changing the html language tag
        var lang = "pt";
        document.documentElement.lang = lang;
        i18n.changeLanguage("pt"); //changing the i18next languae to portuguese
        const now = new Date();
        const db = getFirestore(app); //accessing firestore database
      
        const fetchEvent = async () => {
            const eventRef = doc(db, "br-pt", brCEvent);
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
            const pageRef = doc (db,"br-pt","event_pages");
            const pageSnap = await getDoc(pageRef);
            if (pageSnap.exists()){ //setting page title variables using database information
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
            const homeRef = doc(db, "br-pt", "homepage");
            const homeSnap = await getDoc(homeRef);
            if (homeSnap.exists()){ //setting page variables using homepage collection
                const homeData = homeSnap.data();
                setGH(homeData.ghanaian);
                setCT(homeData.culture_title);
                setSK(homeData.south_korean);
            }
        };

        fetchEvent().catch(console.error);
        fetchPage().catch(console.error);
        fetchHomepage().catch(console.error);
        
    }, []);

    const ghPage = () => { //link to ghanaian localisation
        window.location.href = "/ghana";
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

    const imgSources = (e) => { //toggle to show image sources
        e.preventDefault();
        if (srcToggleOn){
            setSrcToggleOn(false);
        } else {
            setSrcToggleOn(true);
        }
    }
  
    return(
        <body className="br">
            {previewShown && <ShareBR name={nameChange} msg={messageChange} img={currentImg} event={brCEvent}/> }
        <div className={ previewShown ? "hide" : ""}>    
            <a href="/brasil">Pagina Inicial</a>
            <div className="links" style={{display:"inline"}}>
            <div className="CT">{CT}</div>
                <div id="SK" className="link" onClick={koPage} style={{display:"inline"}}>{SK}</div>, 
                <div id="GH" className="link" onClick={ghPage} style={{display:"inline"}}> {GH}</div> 
              </div>
            <div>
                <h1 className="title">{brCEvent}</h1>
            </div>
           
           <div>
                <div>
                    <h1 className='designTitle'>Projete seu cartão abaixo!</h1>
                    <div className="previewMessage">
                        <div className="in">
                            <p>Para {nameChange} </p>
                            <p className='msg'>{messageChange} </p>
                            <img src={currentImg} alt={`${brCEvent} card image`}></img>
                        </div>
                        {localStorage.setItem("nameBR", nameChange)}
                        {localStorage.setItem("msgBR", messageChange)}
                        {localStorage.setItem("imgBR", currentImg)}
                        {localStorage.setItem("eventBR", brCEvent)}
                    </div>
                </div>                
                <div className="writeMessage">
                    <form>
                        <input 
                            value={nameChange} 
                            onChange={e => setNameChange(e.target.value)} 
                            placeholder='Para:'>
                        </input>
                        <textarea 
                            value={messageChange} 
                            onChange={e =>{
                                var msg = e.target.value;
                                setMessageChange(msg)
                            }} 
                            style={{height:"200px"}} 
                            placeholder='Mensagem:'>
                        </textarea>
                        <button type='submit' onClick={shareCard}>Participação</button>
                    </form>
                </div>
           </div>

           <div className='imageList'>
                <h3>Escolha qual imagem você deseja enviar!</h3>
                <div className='IL'>
                    {allImages}
                </div>
            </div>

            <div className="fun-facts">
                <h3 id="funTitle" style={{fontSize:"25px"}}>{facts} {brCEvent}!</h3>
                <div className="info">
                    <p dang dangerouslySetInnerHTML={{ __html:eInfo}} id="eventInfo"></p>
                </div>
            </div>

            <div className='sources'>
                <button  onClick={imgSources}>Fontes de imagem</button>
                <h3 className={srcToggleOn ? "" : "hide"}>{allSources}</h3>
            </div>
            
        </div>
        </body>
    )
}