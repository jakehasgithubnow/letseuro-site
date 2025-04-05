'use client';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import imageUrlBuilder from '@sanity/image-url'
import { createClient } from 'next-sanity'

const config = {
  projectId: 'kabpbxao',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-01-01',
}

const builder = imageUrlBuilder(createClient(config))
const urlFor = (source: any) => builder.image(source)

interface LogoCarouselProps {
  logos: any[];
}

interface LogoCarouselProps {
  logos: any[];
}

const LogoCarousel: React.FC<LogoCarouselProps> = ({ logos }) => {
  console.log('logos:', logos);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <Slider {...settings} className="opacity-60">
      {logos.map((logo: any, i: number) => (
       <div key={i} className="px-2">
          {logo?.asset ? (
            <img
              src={urlFor(logo).width(160).url()}
              alt=""
              className="h-[50px] w-auto object-contain filter grayscale(100%)"
            />
          ) : (
            <div className="h-[50px] w-auto" />
          )}
        </div>
      ))}
    </Slider>
  );
};

export default LogoCarousel;
