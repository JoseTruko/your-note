import Hero from '../assets/components/Hero/Hero';
import VSCodeLayout from '../components/Layout/VSCodeLayout';

function Home() {
    return (
        <>
            <section className='sectionHero'>
                <Hero />
            </section>
            <section className='sectionNote'>
                <VSCodeLayout />
            </section>
        </>
    );
}

export default Home;