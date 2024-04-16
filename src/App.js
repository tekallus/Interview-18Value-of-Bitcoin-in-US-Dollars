import React, { useEffect, useState } from "react"; // React ve gerekli hook'ları içe aktaralim
import axios from "axios"; // Axios kütüphanesini içe aktaralim(unutma!:npm install axios)

// Oncelikle Özel hook'u tanımlayalim
const useBitcoin = () => {
  const [bitcoinPrice, setBitcoinPrice] = useState(undefined); // Bitcoin fiyatını ve yüklenme durumunu saklayacak state'leri tanımlayalim
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // useEffect hook'u ile API'den veri çekme işlemini gerçekleştirmek icin async islemi tanimlayalim
    const fetchBitcoinPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.coindesk.com/v1/bpi/currentprice.json"
        ); // Axios ile API'den veri çekelim
        const { rate_float } = response.data.bpi.USD; // Gelen veriden Bitcoin'in fiyatını alalim
        setBitcoinPrice(rate_float); // Bitcoin fiyatını state'e kaydedelim
        setLoading(false); // Yükleme durumunu false olarak ayarlayın, çünkü veri alındı
      } catch (error) {
        console.error("Error fetching Bitcoin price:", error); // Hata durumunda konsola hata yazdırma
      }
    };
    const initialFetchTimeout = setTimeout(() => {
      fetchBitcoinPrice(); // İlk fiyatı 5 sn de allalim daha sonra 60 sn de bir guncellesin
    }, 5000);

    const interval = setInterval(fetchBitcoinPrice, 60000); // Her bir atmis saniyede bir fiyatı güncelleme

    //onmeli nokta: Temizleme fonksiyonunu döndürerek isteğin sonsuz bir döngüde gönderilmesini önleyelim
    return () => clearInterval(interval);
  }, []); // Boş bağımlılık dizisi, yalnızca bileşen ilk kez oluşturulduğunda çalışmasını sağlamak icin

  return { bitcoinPrice, loading }; // Bitcoin fiyatını ve yükleme durumunu döndürme
};

function App() {
  const { bitcoinPrice, loading } = useBitcoin(); // useBitcoin hook'unu kullanarak Bitcoin fiyatını ve yükleme durumunu alalim

  return (
    // JSX ile arayüzü oluşturun
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Value of Bitcoin in US Dollars:</h1> {/* Bitcoin'in Amerikan Doları cinsinden değerini gösteren başlık */}
        {loading ? (
          <p className="text-lg font-semibold text-center">Loading...</p> // Yüklenme durumunda gösterilecek metin
        ) : (
          <p className="text-lg font-semibold text-center">
            Bitcoin Price: ${bitcoinPrice} {/* Bitcoin fiyatını gösteren metin */}
          </p>
        )}
      </div>
    </div>
  );
}

export default App; // App bileşenini dışa aktarmayi unutma!
