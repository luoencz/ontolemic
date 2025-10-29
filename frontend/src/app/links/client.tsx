"use client";

import { useState, ReactNode, ReactElement } from "react";
import Link from "next/link";
import { FaXTwitter, FaLinkedin, FaInstagram, FaGithub, FaEnvelope, FaCalendar, FaBook, FaChevronDown, FaChevronRight } from "react-icons/fa6";

interface CollapsibleSectionProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    bgColor: string;
    children: ReactNode;
}

type LinkData = {
    href: string;
    icon: ReactElement;
    text: string;
    isExternal?: boolean;
    useAnchor?: boolean;
};

interface LinkItemProps {
    links: LinkData | LinkData[];
    description?: string;
}

function LinkItem({ links, description }: LinkItemProps) {
    const linkClasses = "flex items-center gap-2";
    
    const renderLink = (link: LinkData, index?: number) => {
        const linkProps = link.isExternal !== false ? { target: "_blank", rel: "noopener noreferrer" } : {};
        
        if (link.useAnchor) {
            return (
                <a key={index} href={link.href} className={linkClasses} {...linkProps}>
                    {link.icon}
                    <span>{link.text}</span>
                </a>
            );
        }
        
        return (
            <Link key={index} href={link.href} className={linkClasses} {...linkProps}>
                {link.icon}
                <span>{link.text}</span>
            </Link>
        );
    };

    const linksArray = Array.isArray(links) ? links : [links];

    return (
        <li>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row flex-wrap gap-2">
                    {linksArray.map((link, index) => renderLink(link, index))}
                </div>
                {description && <span>{description}</span>}
            </div>
        </li>
    );
}

function CollapsibleSection({ title, isOpen, onToggle, bgColor, children }: CollapsibleSectionProps) {
    return (
        <div className={`flex flex-col gap-2 ${bgColor} p-4 rounded-lg`}>
            <h3 
                onClick={onToggle} 
                className="flex items-center gap-2 cursor-pointer select-none hover:opacity-80 transition-opacity"
            >
                {isOpen ? <FaChevronDown className="text-sm" /> : <FaChevronRight className="text-sm" />}
                {title}
            </h3>
            {isOpen && (
                <ul className="flex flex-col gap-4">
                    {children}
                </ul>
            )}
        </div>
    );
}

export default function LinksClient() {
    const [openSections, setOpenSections] = useState({
        contact: true,
        me: true,
        blogs: true,
        books: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <CollapsibleSection
                title="Contact"
                isOpen={openSections.contact}
                onToggle={() => toggleSection('contact')}
                bgColor="bg-saphire-special/50"
            >
                <LinkItem
                    links={{ href: "mailto:theo@the-o.space", icon: <FaEnvelope />, text: "theo[at]the-o.space", useAnchor: true, isExternal: false }}
                    description="My personal email! I'm very happy to talk for whatever reason — usually people who reach out by email have something interesting to introduce me to."
                />
                <LinkItem
                    links={{ href: "https://fantastical.app/the-o", icon: <FaCalendar />, text: "Schedule a call" }}
                    description="... Alternatively, schedule a call. I promise, I'm fun and pleasant to talk to. You can also bait me into some irrationally long commitment to a fun project."
                />
            </CollapsibleSection>

            <CollapsibleSection
                title="Me"
                isOpen={openSections.me}
                onToggle={() => toggleSection('me')}
                bgColor="bg-emerald-special/50"
            >
                <LinkItem
                    links={{ href: "https://x.com/Luoencz", icon: <FaXTwitter />, text: "Twitter / X" }}
                    description={'I have once had a private channel called "ventilation la(ye/i)r". My twitter acc is sort of a follow up. So I will not be hurt if you hate it.'}
                />
                <LinkItem
                    links={{ href: "https://substack.com/@luoencz", icon: <FaBook />, text: "Substack" }}
                    description="My Substack has been empty for more than a year since I have decided to start writing. I guess it tells you something about how I approach the process."
                />
                <LinkItem
                    links={{ href: "https://www.linkedin.com/in/theo-ryzhenkov", icon: <FaLinkedin />, text: "LinkedIn" }}
                    description="Worst place on earth. Unfortunately, grant applications ask for this one. *Sigh*. Let's connect .. ?"
                />
                <LinkItem
                    links={{ href: "https://www.instagram.com/luoencz/", icon: <FaInstagram />, text: "Instagram" }}
                    description="I always had strange relationships with the camera. Don't expect pictures of humans. Expect graffiti and dead animals."
                />
                <LinkItem
                    links={{ href: "https://www.lesswrong.com/users/luoencz", icon: <FaBook />, text: "LessWrong" }}
                    description="I try to be the sort of rationalist who doesn't annoy people, is kind to emotions and in general is true to virtues."
                />
                <LinkItem
                    links={{ href: "https://github.com/luoencz", icon: <FaGithub />, text: "GitHub" }}
                    description="A huge graveyard of all sorts of messy code. The projects worth your attention are mostly featured on the projects page."
                />
            </CollapsibleSection>

            <CollapsibleSection
                title="Blogs"
                isOpen={openSections.blogs}
                onToggle={() => toggleSection('blogs')}
                bgColor="bg-amber-special/50"
            >
                <LinkItem
                    links={[
                        { href: "https://www.astralcodexten.com/", icon: <FaBook />, text: "Astral Codex Ten" },
                        { href: "https://www.overcomingbias.com/", icon: <FaBook />, text: "Overcoming Bias" }
                    ]}
                    description="Two of the foundational rationalist blogs, with practically endless archives of information of varying usefulness."
                />
            </CollapsibleSection>

            <CollapsibleSection
                title="Books"
                isOpen={openSections.books}
                onToggle={() => toggleSection('books')}
                bgColor="bg-amber-special/50"
            >
                <LinkItem
                    links={[
                        { href: "https://www.goodreads.com/book/show/44767458-dune", icon: <FaBook />, text: "Dune" },
                        { href: "https://www.goodreads.com/book/show/29579.Foundation", icon: <FaBook />, text: "Foundation" },
                        { href: "https://www.goodreads.com/book/show/2845024-anathem", icon: <FaBook />, text: "Anathem" },
                        { href: "https://www.goodreads.com/book/show/48484.Blindsight", icon: <FaBook />, text: "Blindsight" },
                        { href: "https://www.goodreads.com/book/show/8935689-consider-phlebas", icon: <FaBook />, text: "Consider Phlebas" },
                    ]}
                    description="These are some sci-fi books that I enjoyed reading."
                />
            </CollapsibleSection>
        </div>
    )
}
