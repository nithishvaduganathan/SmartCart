import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const footerSections = [
        {
            title: 'ABOUT',
            links: [
                { label: 'Contact Us', to: '#' },
                { label: 'About Us', to: '#' },
                { label: 'Careers', to: '#' },
                { label: 'Press', to: '#' },
            ],
        },
        {
            title: 'HELP',
            links: [
                { label: 'Payments', to: '#' },
                { label: 'Shipping', to: '#' },
                { label: 'Cancellation & Returns', to: '#' },
                { label: 'FAQ', to: '#' },
            ],
        },
        {
            title: 'CONSUMER POLICY',
            links: [
                { label: 'Return Policy', to: '#' },
                { label: 'Terms of Use', to: '#' },
                { label: 'Security', to: '#' },
                { label: 'Privacy', to: '#' },
            ],
        },
        {
            title: 'SOCIAL',
            links: [
                { label: 'Facebook', to: '#' },
                { label: 'Twitter', to: '#' },
                { label: 'YouTube', to: '#' },
                { label: 'Instagram', to: '#' },
            ],
        },
    ];

    return (
        <footer style={{
            background: '#172337',
            color: '#fff',
            paddingTop: '40px',
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 16px',
            }}>
                {/* Main Footer */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '32px',
                    paddingBottom: '32px',
                    borderBottom: '1px solid #364152',
                }}>
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#878787',
                                marginBottom: '12px',
                                letterSpacing: '0.5px',
                            }}>
                                {section.title}
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {section.links.map((link) => (
                                    <li key={link.label} style={{ marginBottom: '8px' }}>
                                        <Link to={link.to} style={{
                                            color: '#fff',
                                            fontSize: '12px',
                                            fontWeight: 400,
                                            textDecoration: 'none',
                                            transition: 'text-decoration 0.15s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Info */}
                    <div>
                        <h4 style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#878787',
                            marginBottom: '12px',
                            letterSpacing: '0.5px',
                        }}>
                            MAIL US
                        </h4>
                        <p style={{ fontSize: '12px', lineHeight: '1.8', color: '#fff' }}>
                            SmartCart Internet Pvt Ltd<br />
                            Building Alyssa, Begonia &<br />
                            Clover, Cessna Business Park<br />
                            Bengaluru, 560103<br />
                            Karnataka, India
                        </p>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    padding: '16px 0',
                    gap: '12px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        {['Seller', 'Advertise', 'Gift Cards', 'Help Center'].map((item) => (
                            <Link key={item} to="#" style={{
                                color: '#fff',
                                fontSize: '12px',
                                fontWeight: 500,
                                textDecoration: 'none',
                            }}>{item}</Link>
                        ))}
                    </div>
                    <p style={{ fontSize: '12px', color: '#878787' }}>
                        © 2024 SmartCart. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Payment Strip */}
            <div style={{
                borderTop: '1px solid #364152',
                padding: '16px 0',
                textAlign: 'center',
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                }}>
                    {['Visa', 'Mastercard', 'Razorpay', 'UPI', 'COD'].map((method) => (
                        <span key={method} style={{
                            fontSize: '11px',
                            color: '#878787',
                            background: '#1c2b42',
                            padding: '4px 12px',
                            borderRadius: '3px',
                            fontWeight: 500,
                        }}>{method}</span>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
