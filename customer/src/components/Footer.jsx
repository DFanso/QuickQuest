import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="bg-teal-500 text-white p-10" style={{ color: 'var(--custom-dark-green-color)' }}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div>
                    <h2 className="text-2xl font-bold mb-6">QuickQuest</h2>
                    <p className="mb-4">Our vision is to provide convenience and help increase your sales business.</p>
                    <div className="flex ">
                        <div className="flex">
                        <img src='https://task-trek.s3.ap-southeast-1.amazonaws.com/category/f898cd1f-b413-46a6-a5a6-eddb1d9658bc-Twitter.svg'></img>
                            <img src='https://task-trek.s3.ap-southeast-1.amazonaws.com/category/23219a4f-6b24-48d6-951f-96b3fda404fc-Instagram.svg'></img>
                            <img src='https://task-trek.s3.ap-southeast-1.amazonaws.com/category/f898cd1f-b413-46a6-a5a6-eddb1d9658bc-Twitter.svg'></img>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-8">About</h3>
                    <ul>
                        <li className='pb-4'><Link href="/how-it-works"><span>How it works</span></Link></li>
                        <li className='pb-4'><Link href="/featured"><span>Featured</span></Link></li>
                        <li className='pb-4'><Link href="/partnership"><span>Partnership</span></Link></li>
                        <li className='pb-4'><Link href="/business-relation"><span>Business Relation</span></Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg  mb-8">Community</h3>
                    <ul>
                        <li className='pb-4'><Link href="/events"><span>Events</span></Link></li>
                        <li className='pb-4'><Link href="/blog"><span>Blog</span></Link></li>
                        <li className='pb-4'><Link href="/podcast"><span>Podcast</span></Link></li>
                        <li className='pb-4'><Link href="/invite-friend"><span>Invite a friend</span></Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg  mb-8">Socials</h3>
                    <ul>
                        <li className='pb-4'><Link href="/discord"><span>Discord</span></Link></li>
                        <li className='pb-4'><Link href="/instagram"><span>Instagram</span></Link></li>
                        <li className='pb-4'><Link href="/twitter"><span>Twitter</span></Link></li>
                        <li className='pb-4'><Link href="/facebook"><span>Facebook</span></Link></li>
                        <li className='pb-4'><Link href="mailto:support@quick-quest.com"><span>Support@quick-quest.com</span></Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-6xl mx-auto flex justify-between items-center border-t border-white mt-8 pt-4">
                <p className='text-sm md:text-base'>©2024 QuickQuest. All rights reserved</p>
                <div className="flex space-x-4">
                    <Link href="/privacy-policy"><span className='text-sm md:text-base'>Privacy & Policy</span></Link>
                    <Link href="/terms-and-conditions"><span className='text-sm md:text-base'>Terms & Condition</span></Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
