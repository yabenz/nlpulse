
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react'


interface FavedPopupProps {
    setFavedPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentAnalysis: React.Dispatch<React.SetStateAction<number>>;
}

type FavedItem = {
    title: string;
    // Add other properties if necessary
};

export default function FavedPopup({ setFavedPopupVisible, setCurrentAnalysis }: FavedPopupProps) {
    // Close the popup when 'Esc' key is pressed

    const [favedAnalysis, setFavedAnalysis] = useState<FavedItem[]>([]);

    useEffect(() => {


        const storedFaved  = JSON.parse(localStorage.getItem('favedAnalysis') || '[]')
        setFavedAnalysis(JSON.parse(localStorage.getItem('favedAnalysis') || '[]'));

        // Close the popup when 'Esc' key is pressed
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setFavedPopupVisible(false)
            }
        };

        window.addEventListener('keydown', handleEsc);

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const deleteItem = (index: number) => {
        const updatedFavedAnalysis = favedAnalysis.filter((_, i) => i !== index);
        setFavedAnalysis(updatedFavedAnalysis);
        localStorage.setItem('favedAnalysis', JSON.stringify(updatedFavedAnalysis));
      };



    return (
        <div className='pop-up' style={{top: '11px',right: '-123px', padding: '11px', minWidth: '233px'}}>
            {/* Close icon */}
                <div className='transp-button' style={{ position: 'absolute', top: '0', right: '13px', backgroundColor: 'transparent' }}
                    onClick={() => setFavedPopupVisible(false)}> &#x2715;</div>
            <div className='infoBox' style={{  color: '#0a5483'}}>
                <b>Saved Analyses</b>
            </div>

            <div className='flexCol' style={{ gap: '5px' }}>
                {favedAnalysis.length > 0 && favedAnalysis.map((item, index) => {
                    return <div className='pill-button' onClick={()=>  setCurrentAnalysis(index)} style={{ justifyContent: 'space-between', padding: '3px 5px 3px 11px' }}>
                        <b>{item.title}</b><div className='circle-icon'  onClick={() => deleteItem(index)}>
                            <Trash size={15} color='#555' /></div>
                    </div>
                })}
            </div>

            {/* <button id='flex-grow' onClick={}>Save</button> */}
        </div>
    );
}