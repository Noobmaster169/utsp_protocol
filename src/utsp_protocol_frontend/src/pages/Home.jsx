import '../styles/home.css';
import img1 from '../assets/home1.png';
import img2 from '../assets/home2.svg';
import img3 from '../assets/home3.png';
import img4 from '../assets/home4.png';
import img5 from '../assets/home5.png';
import img6 from '../assets/home6.png';
import img7 from '../assets/home7.png';
import img8 from '../assets/home8.png';
import img9 from '../assets/home9.png';
import { useNavigate } from 'react-router-dom';

export default function Home(){
    const navigate = useNavigate();

    function explore(){
        navigate('/explore', {state: "hello"});
    };

    function createVote(){
        navigate('/create');
    }

    return (
        <div>
            <div id="landing-page-1">
                <div class="d-flex" id="landing-parent">
                    <div class="region-1">
                        <div class="region-3">
                            <img src={img1} />
                        </div>
                        <div class="region-4">
                            The Solution to A Secure Voting System
                        </div>
                        <div class="region-5">UTSP Protocol</div>
                        <div class="region-6">
                            <button onClick={explore}>Explore Now</button>
                        </div>
                    </div>
                    <div class="region-2">
                        <img src={img2}/>
                    </div>
                </div>
                <div id="landing-page-wave-1" class="landing-page-wave">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#f5f5f5" fill-opacity="1" d="M0,160L26.7,165.3C53.3,171,107,181,160,165.3C213.3,149,267,107,320,101.3C373.3,96,427,128,480,149.3C533.3,171,587,181,640,176C693.3,171,747,149,800,160C853.3,171,907,213,960,234.7C1013.3,256,1067,256,1120,229.3C1173.3,203,1227,149,1280,133.3C1333.3,117,1387,139,1413,149.3L1440,160L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"></path></svg>
                </div>
            </div>
            <div id="landing-page-2">
                <div class="landing-page-content-container">
                    <div class="title-2">
                        One Step Further Towards Visionary Voting System
                    </div>
                    <div id="landing-feature-container-parent">
                        <div class="landing-feature-container">
                            <img src={img3} class="feature-icon-image mx-auto"/>
                            <div class="landing-feature-title">
                                High integrity Voting
                            </div>
                            <div class="landing-feature-description-1">
                                Secure Third Party with an Open Source, Transparent, and Auditable System, ensuring a trustable & verifable serice
                            </div>
                        </div>
                        <div class="landing-feature-container">
                            <img src={img4} class="feature-icon-image mx-auto"/>
                            <div class="landing-feature-title">
                                Low Risk of Manipulation
                            </div>
                            <div class="landing-feature-description-2">
                                Empowers Proof of Activity and Internet ComputerToken Standard to tackle voting manipution risks
                            </div>
                        </div>
                        <div class="landing-feature-container">
                            <img src={img5} class="feature-icon-image mx-auto"/>
                            <div class="landing-feature-title">
                                Flexible Control
                            </div>
                            <div class="landing-feature-description-1">
                                High Adjustability and Flexibility for Voting Creators to manage voting to their preferences
                            </div>
                        </div>
                    </div>
                </div>
                <div class="landing-page-wave">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#B02D99" fill-opacity="1" d="M0,224L30,234.7C60,245,120,267,180,256C240,245,300,203,360,186.7C420,171,480,181,540,197.3C600,213,660,235,720,213.3C780,192,840,128,900,117.3C960,107,1020,149,1080,186.7C1140,224,1200,256,1260,261.3C1320,267,1380,245,1410,234.7L1440,224L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path></svg>
                </div>
            <div id="landing-page-3">
                <div class="landing-page-content-container">
                    <div class="landing-page-3-title">
                        Try Our Freemium Product!
                    </div>
                    <div id="landing-product-parent-container">
                        <div class="landing-product-container" onClick={createVote}>
                            <div class="product-title product-title-1">
                                Free Session
                            </div>
                            <div class="product-image-container mx-auto mb-2">
                                <img class="product-image mx-auto" src={img6}/>
                            </div>
                            <div class="product-description">Create 2 Voting for Free</div>
                        </div>
                        <div class="landing-product-container" onClick={createVote}>
                            <div class="product-title product-title-1">
                                Paid Session
                            </div>
                            <div class="product-image-container mx-auto mb-2">
                                <img class="product-image mx-auto" src={img1}/>
                            </div>
                            <div class="product-description">0.2 ICP per Voting Session</div>
                        </div>
                        <div class="landing-product-container" onClick={createVote}>
                            <div class="product-title product-title-2">
                                Contact Us For Verification Service
                            </div>
                            <div class="product-image-container mx-auto mb-2">
                                <img class="product-image mx-auto" src={img7}/>
                            </div>
                            <div class="product-description">We'll Audit Your Smart Contract Security</div>
                        </div>
                    </div>
                </div>
                <div class="landing-page-wave">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#F6F6F6" fill-opacity="1" d="M0,128L26.7,122.7C53.3,117,107,107,160,117.3C213.3,128,267,160,320,160C373.3,160,427,128,480,138.7C533.3,149,587,203,640,202.7C693.3,203,747,149,800,138.7C853.3,128,907,160,960,192C1013.3,224,1067,256,1120,240C1173.3,224,1227,160,1280,138.7C1333.3,117,1387,139,1413,149.3L1440,160L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"></path></svg>            
                </div>
            </div>
            <div id="landing-page-4">
                <div class="landing-page-content-container width-60vw margin-2vw">
                    <div class="region-1">
                        <div class="region-3">
                            <img src={img8}/>
                        </div>
                        <div class="region-4">
                            <div class="landing-faq-title">
                                What is UTSP Protocol?
                            </div>
                            <div class="landing-faq-description-1 mb-2">
                                Universal Token-Standardized Polling (UTSP) Protocol is A Secure Third Party that Provides High Integrity & High Security Voting System.
                            </div>
                            <div>
                                This Protocol is built on ICP that uses Internet Computer Token Standard to Identify and Verify the Voting Participants.
                            </div>
                        </div>
                    </div>
                    <div class="region-2">
                        <div class="region-6">
                            <div class="landing-faq-title">
                                Internet Computer Token Standard
                            </div>
                            <div class="landing-faq-description-1 mb-2">
                                UTSP Protocol use a Built Token on Internet Computer to Create Digital Blockchain-Based Voting.
                            </div>
                            <div>
                                By Integrating the Token Interface, Voting Creators could Create & Manage The Token & its Holders. Hence, the Token Could be Used to Create Voting Sessions.
                            </div>
                        </div>
                        <div class="region-5">
                            <img src={img9}/>
                        </div>
                    </div>
                </div>
            </div>
        </div></div>
    )
}