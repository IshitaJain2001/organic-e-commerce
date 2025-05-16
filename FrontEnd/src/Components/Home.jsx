import HerosSection from './HeroSection';
import Marquee from './Marquee';
import Products from './Products';

export default function Home(){
    return(
    <>
       {/* Hero Section */}
         <HerosSection/>
    
          {/* Scrolling Marquee */}
         <Marquee/>
         <Products/>
    </>
    )
}