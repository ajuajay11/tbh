import Hero from './components/homeComponents/Hero'  
import StoriesThatMatters from "./components/homeComponents/storiesThatMatters/index"
export default async function HomePage() {
    return (
        <>
          <Hero/>
          <StoriesThatMatters/>
        </>
    );
}