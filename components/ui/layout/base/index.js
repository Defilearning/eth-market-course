import { Navbar, Footer } from "@components/ui/common";
import { Web3Provider } from "@components/providers";

export default function BaseLayout(props) {
  return (
    <Web3Provider>
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />
        <div className="fit">{props.children}</div>
      </div>
      <Footer />
    </Web3Provider>
  );
}
