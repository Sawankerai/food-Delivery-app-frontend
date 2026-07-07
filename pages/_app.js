import "../styles/globals.css";
import { CurrencyProvider } from "../context/CurrencyContext";
import { FavoriteProvider } from "../context/FavoriteContext";
import { OrderProvider } from "../context/OrderContext";
import { SearchProvider } from "../context/SearchContext";

export default function App({ Component, pageProps }) {
  return (
    <CurrencyProvider>
      <FavoriteProvider>
        <OrderProvider>
          <SearchProvider>
            <Component {...pageProps} />
          </SearchProvider>
        </OrderProvider>
      </FavoriteProvider>
    </CurrencyProvider>
  );
}
