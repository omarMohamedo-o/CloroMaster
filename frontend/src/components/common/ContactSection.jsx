import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import ContactForm from './ContactForm';
import config from '../../config/config';

export default function ContactSection() {
    const hours = config.contact.workingHours || {};

    const InfoCard = ({ icon, title, children }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 text-white text-lg">
                {icon}
            </div>
            <div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">{children}</div>
            </div>
        </div>
    );

    return (
        <section className="w-full bg-white dark:bg-gray-900">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div>
                        <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Get In Touch</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Feel free to contact us and we will get back to you as soon as we can.</p>

                        <div className="space-y-6">
                            <InfoCard icon={<FaMapMarkerAlt />} title="Address">
                                <a href={config.contact.addressLink || '#'} className="text-gray-700 dark:text-gray-200 hover:underline">{config.contact.address}</a>
                            </InfoCard>

                            <InfoCard icon={<FaPhoneAlt />} title="Phone">
                                <a href={`tel:${config.contact.phone}`} className="text-gray-700 dark:text-gray-200">{config.contact.phone}</a>
                            </InfoCard>

                            <InfoCard icon={<FaEnvelope />} title="Email">
                                <a className="text-gray-700 dark:text-gray-200" href={`mailto:${config.contact.email}`}>{config.contact.email}</a>
                            </InfoCard>

                            <InfoCard icon={<FaClock />} title="Working Hours">
                                <div>{hours.weekdays}</div>
                                {hours.saturday && <div className="mt-1">{hours.saturday}</div>}
                            </InfoCard>
                        </div>
                    </div>

                    <div>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
