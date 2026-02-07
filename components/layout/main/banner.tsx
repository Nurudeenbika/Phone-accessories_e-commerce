import Image from "next/image";
import { Monoton } from "next/font/google";
import { MdShoppingBag, MdStar, MdLocalShipping } from "react-icons/md";

const exo = Monoton({ subsets: ["latin"], weight: ["400"] });

export default function Banner() {
  const parentClassname =
    "mt-4 sm:mt-0 relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 mb-12 rounded-xl overflow-hidden shadow-2xl";
  const childClassname =
    "flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12";
  const textContainerClassname = "text-center lg:text-left lg:flex-1 lg:pr-8";
  const imageContainerClassname =
    "w-full lg:w-1/2 mt-8 lg:mt-0 relative aspect-video lg:aspect-square";
  const imageClassname =
    "object-contain absolute drop-shadow-2xl scale-105 lg:scale-110";

  const headerClassname = `${exo.className} text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-lg`;
  const subtitleClassname =
    "text-xl md:text-2xl text-white mb-6 leading-relaxed drop-shadow-md";
  const bodyTextClassname =
    "text-3xl md:text-4xl bg-gradient-to-r text-transparent bg-clip-text from-yellow-300 to-orange-200 font-bold mb-8 drop-shadow-lg";
  const featuresClassname =
    "flex flex-wrap justify-center lg:justify-start gap-6 mb-8";
  const featureClassname =
    "flex items-center gap-2 text-white text-sm md:text-base";

  const src = "/Jespo_image_3.jpeg";
  const alternateText = "Jespo Gadgets hero";

  return (
    <div className={parentClassname}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
      <div className={childClassname}>
        <div className={textContainerClassname}>
          <h1 className={headerClassname}>
            Your reliable source for
            <br />
            <span className="text-primary-300">Premium Gadgets</span>
          </h1>
          <p className={subtitleClassname}>
            Discover the latest in technology with our curated collection of
            premium gadgets, electronics, and accessories. Quality guaranteed,
            delivered to your doorstep.
          </p>
          <p className={bodyTextClassname}>UP TO 30% OFF</p>

          {/* Features */}
          <div className={featuresClassname}>
            <div className={featureClassname}>
              <MdStar className="w-5 h-5 text-yellow-400" />
              <span>Premium Quality</span>
            </div>
            <div className={featureClassname}>
              <MdLocalShipping className="w-5 h-5 text-green-400" />
              <span>Free Shipping</span>
            </div>
            <div className={featureClassname}>
              <MdShoppingBag className="w-5 h-5 text-primary-400" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>

        <div className={imageContainerClassname}>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-400/30 via-transparent to-transparent blur-2xl scale-110" />

          <Image
            src={src}
            alt={alternateText}
            quality={95}
            fill
            className={imageClassname}
          />
        </div>
      </div>
    </div>
  );
}
