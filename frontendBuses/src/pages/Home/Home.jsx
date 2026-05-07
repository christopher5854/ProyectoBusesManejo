"use client";
import './Home.css';
import Header from '../../Components/Header/Header';
import Hero from '../../Components/Hero/Hero';
import StatsBar from '../../Components/StatsBar/StatsBar';

const Home = () => {
  return (
    <div className='home'>
      <Header />
	    <Hero />
      <StatsBar />
      {/* resto del contenido */}
    </div>
  );
};

Home.propTypes = {};

export default Home;