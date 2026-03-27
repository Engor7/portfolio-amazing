import BusinessNews from "@/app/projects/sites/coin/components/BusinessNews/BusinessNews";
import CryptoPriceIndex from "@/app/projects/sites/coin/components/CryptoPriceIndex/CryptoPriceIndex";
import CryptoTicker from "@/app/projects/sites/coin/components/CryptoTicker/CryptoTicker";
import Footer from "@/app/projects/sites/coin/components/Footer/Footer";
import MarketsNews from "@/app/projects/sites/coin/components/MarketsNews/MarketsNews";
import NewsSection from "@/app/projects/sites/coin/components/NewsSection/NewsSection";

const CoinPage = () => {
   return (
      <>
         <CryptoTicker />
         <NewsSection />
         <BusinessNews />
         <CryptoPriceIndex />
         <MarketsNews />
         <Footer />
      </>
   );
};

export default CoinPage;
