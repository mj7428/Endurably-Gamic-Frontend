import React from 'react';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Parallax, EffectFade } from 'swiper/modules';

// Your assets
import banner1 from '../../assets/banner1.jpg';
import banner2 from '../../assets/banner2.jpg';
import banner3 from '../../assets/banner3.jpg';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; // ✨ NEW: Import fade effect styles

const slides = [
    // ... (Your slides array remains the same)
    {
        image: banner1,
        title: 'Level Up Your Battlestation',
        subtitle: 'Dominate the competition with our exclusive range of mechanical keyboards, RGB mice, and high-fidelity headsets.',
        buttonText: 'Shop Hardware',
        link: '#'
    },
    {
        image: banner2,
        title: 'Unlock Legendary Loot',
        subtitle: 'Fresh new season skins, battle passes, and exclusive in-game items have just dropped. Gear up and stand out.',
        buttonText: 'Explore In-Game Items',
        link: '#'
    },
    {
        image: banner3,
        title: 'Experience Next-Gen Audio',
        subtitle: 'Hear every footstep. Coordinate with crystal-clear comms. Our latest collection of gaming headsets is here.',
        buttonText: 'View Headsets',
        link: '#'
    }
];

// ✨ NEW: A dedicated component for slide content to handle animations
const SlideContent = ({ slide, isActive }) => {
    return (
        <div className="relative w-full h-full">
            {/* Background Image with Ken Burns Effect */}
            <div className="absolute inset-0 overflow-hidden">
                <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-linear ${isActive ? 'scale-110' : 'scale-100'}`}
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            
            {/* Text & Button Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start text-left p-6 sm:p-12 md:p-16 lg:p-24">
                <div className="max-w-md lg:max-w-lg space-y-4">
                    <h2 
                        className={`text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-wider transition-all duration-700 ease-out text-shadow ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ transitionDelay: '200ms' }}
                    >
                        {slide.title}
                    </h2>
                    <p 
                        className={`text-sm sm:text-base text-gray-200 text-shadow transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ transitionDelay: '400ms' }}
                    >
                        {slide.subtitle}
                    </p>
                    <a 
                        href={slide.link} 
                        className={`inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ transitionDelay: '600ms' }}
                    >
                        <span>{slide.buttonText}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="m12 16 4-4-4-4"/></svg>
                    </a>
                </div>
            </div>
        </div>
    );
};


const HeroSlider = () => {
    return (
        <div className="mb-8 rounded-lg overflow-hidden shadow-2xl bg-slate-900 h-[60vh] md:h-[50vh] max-h-[600px] w-full relative">
            <style>
                {`
                    .text-shadow { text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7); }
                    .swiper-button-next, .swiper-button-prev {
                        color: #FFF;
                        background-color: rgba(0, 0, 0, 0.2);
                        backdrop-filter: blur(4px);
                        width: 36px; height: 36px; border-radius: 50%;
                        transition: all 0.3s ease;
                    }
                    .swiper-button-next:hover, .swiper-button-prev:hover {
                        background-color: rgba(233, 69, 96, 0.7);
                        transform: scale(1.1);
                    }
                    .swiper-pagination-bullet {
                        background: rgba(255, 255, 255, 0.7);
                        width: 10px; height: 10px; opacity: 0.8;
                    }
                    .swiper-pagination-bullet-active {
                        background: #E94560;
                        width: 30px; border-radius: 5px;
                        transition: width 0.3s ease-in-out;
                    }

                    /* ✨ NEW: Hides arrows on mobile screens */
                    @media (max-width: 767px) {
                        .swiper-button-next,
                        .swiper-button-prev {
                            display: none;
                        }
                    }
                `}
            </style>
            
            <Swiper
                // ✨ NEW: Updated modules and configuration
                modules={[Navigation, Pagination, Autoplay, Parallax, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                parallax={true}
                speed={1200} // Slower, smoother transition speed
                loop={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                className="w-full h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        {({ isActive }) => (
                            <SlideContent slide={slide} isActive={isActive} />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSlider;