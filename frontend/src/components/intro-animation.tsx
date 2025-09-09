'use client';

import * as React from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import './intro-animation.css';

const IntroAnimation: React.FC = () => {
    const circleRef = React.useRef<HTMLAnchorElement>(null);
    const textRef = React.useRef<HTMLSpanElement>(null);
    const crescentRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        const crescent = crescentRef.current;

        gsap.set(crescent, {
            xPercent: 75,
            yPercent: 25,
            rotation: -15,
        });

        const tl = gsap.timeline({ delay: 1 });

        tl.to(crescent, {
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            duration: 2,
            ease: 'linear',
        })
    }, []);

    return (
        <div className="intro-overlay">
            <Link href="/" className="intro-circle" ref={circleRef}>
                <span className="intro-crescent" ref={crescentRef} />
                <span className="home-text" ref={textRef}>
                    Home
                </span>
            </Link>
        </div>
    );
};

export default IntroAnimation;
