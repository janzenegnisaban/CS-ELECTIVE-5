import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - QuiCake Ecommerce",
  description: "Learn more about QuiCake Ecommerce, your ultimate destination for delightful cakes and baked goods online.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">About QuiCake Ecommerce</h1>
      
      <div className="space-y-6 text-lg">
        <p className="leading-relaxed">
          Welcome to QuiCake Ecommerce, your ultimate destination for delightful cakes and baked goods online. 
          We believe that every celebration deserves the perfect cake, and we're here to make that happen effortlessly. 
          With a wide selection of handcrafted, high-quality treats, we ensure that every bite is a moment to savor.
        </p>

        <p className="leading-relaxed">
          Our platform is designed to provide a seamless shopping experience, from browsing and filtering your favorite 
          products to a hassle-free checkout and order management system. Whether you're looking for a classic chocolate 
          cake, a custom-designed masterpiece, or a selection of pastries, QuiCake Ecommerce brings the bakery to your fingertips.
        </p>

        <p className="leading-relaxed">
          Backed by cutting-edge technology, our platform offers secure authentication, intuitive cart functionality, 
          and efficient order processing. For businesses and baking enthusiasts, our Admin Dashboard empowers seamless 
          product and order management.
        </p>

        <p className="leading-relaxed font-semibold">
          Indulge in the joy of sweetness with QuiCake—where quality meets convenience.
        </p>
      </div>
    </div>
  )
} 