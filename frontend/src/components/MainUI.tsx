import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react';
import { title } from 'process';
import {capitalizeFirstLetter} from '../utils/textFormatting'

type APIResponse = {
    tokens: string[];

}

type SentimentResult = {
    neg: number;
    neu: number;
    pos: number;
    compound: number;
    sentiment: string;
}


interface MainUIProps {
    favedAnalysis: any[];
    currentAnalysis: number;
}

export default function MainUI({ currentAnalysis}: MainUIProps) {

    const [reqResult, setReqResult] = useState<APIResponse | null>(null);
    const [inputText, setInputText] = useState('');
    const [compSentiment, setCompSentiment] = useState<SentimentResult | null>(null);
    const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
    let [title, setTitle] = useState('New Analysis')



    useEffect(()=>{


        if (currentAnalysis !== null) {

            const storedFaved  = JSON.parse(localStorage.getItem('favedAnalysis') || '[]')
            setInputText(storedFaved[currentAnalysis]?.text || '')
            setCompSentiment(storedFaved[currentAnalysis]?.compSentiment || '')
            setTitle(`New Analysis ${storedFaved.length}`)
        }

    },[currentAnalysis])




    async function handleSubmit(text: string) {

        try {

            const response = await fetch(`http://127.0.0.1:8000/sentiment/?text=${text}`);
            const data = await response.json();
            console.log('dataaa', data.sentiment.sentiment)
            setCompSentiment(data.sentiment)

        } catch (error) {
            console.error("Error:", error);
        }
    };


    function handleFavorited() {

        const storedFaved  = JSON.parse(localStorage.getItem('favedAnalysis') || '[]')

        if (storedFaved.length > 10 ){

            alert("Thanks for using my app! However, your local storage is getting full, think of removing some of your saved Analyses")
        }else{

            const textAnalysis = {
                title: `${title} ${title === 'New Analysis' ? storedFaved.length : ''}`,
                text: inputText,
                compSentiment: compSentiment
            }
    
            storedFaved.push(textAnalysis)
            localStorage.setItem('favedAnalysis', JSON.stringify(storedFaved));
            setPopupVisible(false)
        }
        
    }


  
    return (

        <div className="fullWidth" style={{ padding: '25px 0' }}>
                <div className="container">
                    <textarea className="textInput" value={inputText} onChange={(e) => setInputText(e.target.value)} rows={4} />
                    <div className="flexCol" style={{ backgroundColor: '#efe', borderRadius: '23px', padding: '13px' }}>
                        <div className='flex' style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: '3px' }}>Analysis</h2>
                            {isPopupVisible && <SavePopup title={title} setTitle={setTitle} setPopupVisible={setPopupVisible} handleFavorited={handleFavorited} />}
                            <div className='circle-icon' onClick={() => setPopupVisible(!isPopupVisible)} >
                                <Heart fill='#fff' size={21} strokeWidth={1} stroke='#9c9c9c' style={{ transform: 'translateY(1px)' }} />
                            </div>
                        </div>
                        <div className="infoBox">
                            <p>You can choose the type of sentiment analysis you want to use.</p>
                            <p><b>Max character: </b>1000 words</p>
                        </div>
                        <div className="infoBox">
                            <div><b>Overall Sentiment: </b>{compSentiment?.sentiment}</div>
                            <div><b>Positive score:</b> {compSentiment?.pos}</div>
                            <div><b>Neutral score: </b>{compSentiment?.neu}</div>
                            <div><b>Negative score:</b> {compSentiment?.neg}</div>
                            <div><b>Overall score:</b> {compSentiment?.compound}</div>
                        </div>
                        <div className='flex'>
                            <button id='flex-grow' onClick={() => handleSubmit(inputText)}>Analyze</button>
                            <button className='outline-button' onClick={() => setInputText('')}>Clear</button>
                        </div>
                    </div>
                </div>
        </div>

    )

}



interface SavePopupProps {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleFavorited: () => void;
}

export function SavePopup({title, setTitle, setPopupVisible, handleFavorited }: SavePopupProps) {
    // Close the popup when 'Esc' key is pressed
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setPopupVisible(false)
            }
        };

        // Add the keydown event listener
        window.addEventListener('keydown', handleEsc);

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [setPopupVisible]);

    return (
        <div className='pop-up' style={{ transform: 'translate(-115px , 73px)' }}>
            {/* Close icon */}
            <div className='transp-button' style={{ position: 'absolute', top: '0', right: '13px', backgroundColor: 'transparent'}}
                onClick={() => setPopupVisible(false)}> &#x2715; </div>

            <b>Enter a Title:</b>
            <form className='form-wide'>
                <input
                    type="text"
                    name="title"
                    placeholder={title}
                    onChange={(e) => setTitle(capitalizeFirstLetter(e.target.value))} />
            </form>
                <button id='flex-grow' onClick={() => handleFavorited()}>Save</button>
        </div>
    );
}