"use client";

import { useState, ReactNode, ReactElement } from "react";
import Link from "next/link";
import { FaXTwitter, FaLinkedin, FaInstagram, FaGithub, FaEnvelope, FaCalendar, FaBook, FaChevronDown, FaChevronRight, FaMusic, FaCode } from "react-icons/fa6";

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
        contact: false,
        me: false,
        blogs: false,
        books: false,
        software: false,
        websites: false,
        music: false,
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
                title="Websites"
                isOpen={openSections.websites}
                onToggle={() => toggleSection('websites')}
                bgColor="bg-amber-special/50"
            >
                <LinkItem
                    links={{ href: "https://fmhy.net/", icon: <FaBook />, text: "FMHY" }}
                    description="You need to be cautious recommending pirate sites — but corporations suck, streaming services more so, and sometimes you simply can't buy an ebook without DRM."
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
                        { href: "https://www.goodreads.com/book/show/89187.Revelation_Space", icon: <FaBook />, text: "Revelation Space" },
                    ]}
                    description="These are some of my favourite science-fiction books. They are not in any particular order. Many titles are missing, too."
                />

                <LinkItem
                    links={{ href: "https://www.readthesequences.com/HomePage", icon: <FaBook />, text: "The Sequences" }}
                    description="The Sequences, known as a book as 'Rationality: From AI to Zombies' is a great introduction to rational thought."
                />

                <LinkItem
                    links={{ href: "https://www.goodreads.com/book/show/228646231-if-anyone-builds-it-everyone-dies", icon: <FaBook />, text: "If Anyone Builds It, Everyone Dies" }}
                    description="Yudkowsky and Soares have done a great job of explaing the risks of AI developement in a rather striking manner. Their strong claims have a good justification, though."
                />
            </CollapsibleSection>

            <CollapsibleSection
                title="Music"
                isOpen={openSections.music}
                onToggle={() => toggleSection('music')}
                bgColor="bg-amber-special/50"
            >
                <LinkItem
                    links={[
                        { href: "https://tidal.com/album/58990497/u", icon: <FaMusic />, text: "The Bends" },
                        { href: "https://tidal.com/album/75144326/u", icon: <FaMusic />, text: "OK Computer" }
                    ]}
                    description="Radiohead is one of the most influential bands for me. To this day, Fade Out is one of the only compositions that can bring me to tears."
                />
            </CollapsibleSection>

            <CollapsibleSection
                title="Software"
                isOpen={openSections.software}
                onToggle={() => toggleSection('software')}
                bgColor="bg-ruby-special/50"
            >
                <LinkItem
                    links={{ href: "https://obsidian.md/", icon: <FaCode />, text: "Obsidian" }}
                    description="Obsidian is great — it's offline, powerful, exists as a collection of directories on your machine. You need to be cautious with community plugins, since they have a full access to your fs, but otherwise its a power tool."
                />

                <LinkItem
                    links={[
                        { href: "https://calibre-ebook.com/about", icon: <FaCode />, text: "Calibre" },
                        { href: "https://www.yomu-reader.com/", icon: <FaCode />, text: "Yomu" }
                    ]}
                    description="Calibre is the best ebook library manager. It's free, open-source, and has a lot of features. When paired with Yomu or Kindle, its the best way to read ebooks."
                />
            </CollapsibleSection>
        </div>
    )
}
