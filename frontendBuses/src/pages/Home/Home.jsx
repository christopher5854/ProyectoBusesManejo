"use client";
import './Home.css';
import Header from '../../Components/Header/Header';
import Hero from '../../Components/Hero/Hero';

const Home = () => {
  return (
    <div className='home'>
      <Header />
	    <Hero />
      {/* resto del contenido */}
    </div>
  );
};

Home.propTypes = {};

export default Home;