import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import banner1 from '../../assets/banner1.jpg'
import banner2 from '../../assets/banner2.jpeg'
import banner3 from '../../assets/banner3.jpeg'


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroSlider = () => {
    const slides = [
        {
            image: banner1,
            title: 'Massive Summer Sale',
            subtitle: 'Get up to 50% off on exclusive in-game items!',
            buttonText: 'Shop Now',
            link: '#'
        },
        {
            image: banner2,
            title: 'New Season Skins Arrived',
            subtitle: 'Upgrade your look with the latest collection.',
            buttonText: 'Explore Collection',
            link: '#'
        },
        {
            image: banner3,
            title: 'Featured Pro Accounts',
            subtitle: 'Get a competitive edge with a pro-level account.',
            buttonText: 'View Accounts',
            link: '#'
        }
    ];

    return (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <style>
                {`
                    .swiper-button-next,
                    .swiper-button-prev {
                        color: #DC2626; /* Tailwind's red-600 */
                    }

                    .swiper-pagination-bullet-active {
                        background-color: #DC2626; /* Tailwind's red-600 */
                    }
                `}
            </style>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                className="w-full h-48 md:h-54"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-full">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center p-4">
                                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">{slide.title}</h2>
                                <p className="text-md md:text-lg text-gray-300 mt-2 mb-4 max-w-lg">{slide.subtitle}</p>
                                <a href={slide.link} className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-transform hover:scale-105">
                                    {slide.buttonText}
                                </a>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSlider;