"use client";
import Header from '../../Components/HomeComponents/Header/Header';
import Hero from '../../Components/HomeComponents/Hero/Hero';
import StatsBar from '../../Components/HomeComponents/StatsBar/StatsBar';
import RoutesSection from '../../Components/HomeComponents/RoutesSection/RoutesSection';
import HowItWorks from '../../Components/HomeComponents/HowItWorks/HowItWorks';
import Features from '../../Components/HomeComponents/Features/Features';
import CtaBanner from '../../Components/HomeComponents/CtaBanner/CtaBanner';
import Footer from '../../Components/HomeComponents/Footer/Footer';
import './Home.css';


const Home = () => {
  return (
    <div className='home'>
      <Header />
	    <Hero />
      <StatsBar />
      <RoutesSection />
      <HowItWorks />
      <Features />
      <CtaBanner />
      <Footer />
      {/* resto del contenido */}
    </div>
  );
};

Home.propTypes = {};

export default Home;