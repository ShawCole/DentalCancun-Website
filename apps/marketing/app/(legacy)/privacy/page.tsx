import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-zinc-50 font-sans selection:bg-gold selection:text-white">
            <Header forceSolid={true} />

            <main className="mx-auto max-w-4xl px-6 py-32 md:py-40">
                <div className="rounded-2xl bg-white p-8 shadow-sm md:p-12">
                    <h1 className="mb-2 text-4xl font-serif font-bold text-primary md:text-5xl">Privacy Policy</h1>
                    <p className="mb-8 text-sm text-charcoal/60 uppercase tracking-widest font-bold">(DentalSolutions / DentalCancun)</p>

                    <div className="space-y-8 text-charcoal/80 leading-relaxed">
                        <section>
                            <p className="font-bold text-primary">Effective Date: February 6, 2026</p>
                            <p className="mt-4">
                                DentalSolutions (“DentalCancun,” “we,” “us,” or “our”) operates the website dentalcancun.com and provides dental services in Puerto Cancún, México, including serving patients traveling from the United States for dental tourism. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit our website, contact us, or communicate with us by phone, email, or text message (SMS).
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-serif font-bold text-primary">1) Information We Collect</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-primary">A. Information you provide to us</h3>
                                    <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                                        <li>Name</li>
                                        <li>Email address</li>
                                        <li>Phone number (including mobile number)</li>
                                        <li>Contact preferences</li>
                                        <li>Information you submit through forms (e.g., appointment requests, consultation requests)</li>
                                        <li>Information related to your dental needs that you voluntarily share (including photos or notes you send us)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary">B. Information collected automatically</h3>
                                    <p className="mt-2">When you use our website, we may automatically collect:</p>
                                    <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                                        <li>IP address and device information</li>
                                        <li>Browser type and settings</li>
                                        <li>Pages viewed and time spent on the site</li>
                                        <li>Referring/exit pages and links clicked</li>
                                        <li>Approximate location (derived from IP)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary">C. Cookies and similar technologies</h3>
                                    <p className="mt-2">
                                        We may use cookies, pixels, and similar technologies to improve site functionality, understand usage, and measure marketing performance. You can control cookies through your browser settings.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-serif font-bold text-primary">2) How We Use Your Information</h2>
                            <p>We use your information to:</p>
                            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                                <li>Respond to inquiries and provide requested information</li>
                                <li>Schedule appointments and communicate about consultations or services</li>
                                <li>Provide customer support</li>
                                <li>Send administrative messages (confirmations, reminders, service updates)</li>
                                <li>Improve our website, services, and marketing performance</li>
                                <li>Comply with legal obligations and protect against fraud or misuse</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-serif font-bold text-primary">3) SMS/Text Messaging Privacy (A2P/10DLC)</h2>
                            <p>If you provide your mobile number and opt in to receive SMS messages, we may send texts related to your relationship with DentalCancun, such as:</p>
                            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                                <li>Appointment confirmations and reminders</li>
                                <li>Follow-ups related to your inquiry or consultation</li>
                                <li>Service-related notifications and support</li>
                            </ul>
                            <p className="mt-4">
                                Message frequency may vary. Message and data rates may apply.
                                You can opt out at any time by replying STOP. For help, reply HELP.
                            </p>
                            <p className="mt-4 font-bold text-primary">
                                Mobile information will not be sold or shared with third parties for marketing or promotional purposes.
                                We do not share SMS consent with third parties for marketing purposes.
                                <br />
                                Consumer data will not be sold or shared with third parties for marketing.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-serif font-bold text-primary">4) How We Share Information</h2>
                            <p>We may share your information only as necessary to operate our business and provide services, including:</p>
                            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                                <li>Service providers who help us run our website, communications, scheduling, analytics, and customer support (they are permitted to use your information only to perform services for us)</li>
                                <li>Legal and safety disclosures if required by law, subpoena, or to protect rights, safety, and security</li>
                                <li>Business transfers (if we undergo a merger, acquisition, or asset sale, your information may be transferred as part of that transaction)</li>
                            </ul>
                            <div className="mt-6 space-y-2 font-bold text-primary">
                                <p>We do not sell your personal information.</p>
                                <p>We do not share your personal information with third parties for their own marketing purposes.</p>
                                <p>This includes no sharing of mobile numbers or SMS opt-in data for marketing.</p>
                                <p>Consumer data will not be sold or shared with third parties for marketing.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-serif font-bold text-primary">5) Data Retention</h2>
                            <p>
                                We retain personal information for as long as needed to fulfill the purposes described in this policy, including providing services, maintaining records, resolving disputes, and complying with legal obligations.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-serif font-bold text-primary">6) Security</h2>
                            <p>
                                We use reasonable administrative, technical, and physical safeguards designed to protect your information. However, no method of transmission over the internet or method of electronic storage is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-serif font-bold text-primary">7) Your Choices and Rights</h2>
                            <p>Depending on your location, you may have rights to:</p>
                            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                                <li>Request access to the personal information we hold about you</li>
                                <li>Request correction or deletion of your personal information</li>
                                <li>Opt out of marketing communications at any time (email unsubscribe links and SMS “STOP”)</li>
                            </ul>
                            <p className="mt-4 text-sm italic">To make a request, contact us using the information below.</p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-serif font-bold text-primary">8) International Users (U.S. Visitors & Cross-Border Care)</h2>
                            <p>
                                DentalCancun is located in México, and information you provide may be processed and stored in México or other locations where we or our service providers operate. By using our website or providing information to us, you consent to this processing and transfer.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-serif font-bold text-primary">9) Children’s Privacy</h2>
                            <p>
                                Our services are not directed to children under 13, and we do not knowingly collect personal information from children under 13.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-serif font-bold text-primary">10) Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. The “Effective Date” above reflects the most recent version. Changes will be posted on this page.
                            </p>
                        </section>

                        <section className="border-t border-zinc-100 pt-8">
                            <h2 className="mb-4 text-2xl font-serif font-bold text-primary">11) Contact Us</h2>
                            <p>If you have questions about this Privacy Policy or our privacy practices, contact:</p>
                            <div className="mt-4 space-y-1">
                                <p className="font-bold text-primary">DentalSolutions / DentalCancun</p>
                                <p>Address: Edificio Diomeda Puerto Cancún, Zona Hotelera</p>
                                <p>Email: <a href="mailto:info@dentalcancun.com" className="text-gold hover:underline">info@dentalcancun.com</a></p>
                                <p>Phone: +52 984 114 5997</p>
                                <p>Website: <a href="https://dentalcancun.com" className="text-gold hover:underline">dentalcancun.com</a></p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
