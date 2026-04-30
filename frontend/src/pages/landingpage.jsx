import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
ChevronLeft,
ChevronRight,
Truck,
Shield,
RotateCcw,
Headphones
} from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';


/* ---------- HERO SLIDES WITH IMAGES ---------- */
/* Replace image URLs with your own later if needed */

const bannerSlides = [
{
title: 'Electronics Festival',
subtitle: 'Best Deals on Smartphones, Laptops & Gadgets',
image:
'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80',
cta: 'Buy Now'
},

{
title: 'Fashion Mega Sale',
subtitle: 'Flat 50-70% OFF on Top Brands',
image:
'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80',
cta: 'Shop Fashion'
},

{
title: 'Big Savings Days',
subtitle: 'Up to 80% OFF on Electronics, Home & More',
image:
'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80',
cta: 'Explore Offers'
}
];



const categoryItems = [
{ name: 'Electronics', slug: 'electronics', emoji: '📱' },
{ name: 'Fashion', slug: 'fashion', emoji: '👕' },
{ name: 'Home', slug: 'home', emoji: '🏠' },
{ name: 'Sports', slug: 'sports', emoji: '⚽' },
{ name: 'Books', slug: 'books', emoji: '📚' },
{ name: 'Toys', slug: 'toys', emoji: '🧸' }
];



function LandingPage() {

const { api } = useContext(AuthContext);
const navigate = useNavigate();

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

const [currentSlide, setCurrentSlide] = useState(0);


/* ---------- Fetch Products ---------- */

useEffect(() => {
const fetchProducts = async () => {
try {
const res = await api.get('products/');
const data = Array.isArray(res.data)
? res.data
: (res.data.results || []);

setProducts(data);

} catch (error) {
console.error('Failed fetching products', error);

} finally {
setLoading(false);
}
};

fetchProducts();

}, [api]);



/* ---------- Auto Slider ---------- */

useEffect(() => {

const timer = setInterval(() => {
setCurrentSlide((prev)=>
(prev + 1) % bannerSlides.length
);

},4000);

return ()=> clearInterval(timer);

},[]);



const featuredProducts = products.slice(0,8);

const dealsProducts = products.slice(0,4);



return (

<div style={styles.page}>


{/* HERO SECTION */}

<div style={styles.heroWrapper}>


{bannerSlides.map((slide,index)=>(
<div
key={index}
style={{
...styles.slide,
opacity: currentSlide===index ? 1 : 0,
transform:
currentSlide===index
? 'translateX(0)'
: 'translateX(60px)'
}}
>

{/* Background Image */}

<img
src={slide.image}
alt={slide.title}
style={styles.heroImage}
/>


{/* Floating Moving Product Shapes */}

<div style={styles.floatPhone}>📱</div>
<div style={styles.floatLaptop}>💻</div>
<div style={styles.floatBag}>🛍</div>


{/* Overlay Content */}

<div style={styles.heroContent}>

<h1 style={styles.heroTitle}>
{slide.title}
</h1>

<p style={styles.heroSubtitle}>
{slide.subtitle}
</p>

<button
style={styles.heroBtn}
onClick={()=>navigate('/products')}
>
{slide.cta}
</button>

</div>

</div>
))}


{/* Arrows */}

<button
style={styles.arrowLeft}
onClick={()=>setCurrentSlide(
(prev)=>
(prev-1+bannerSlides.length)%bannerSlides.length
)}
>
<ChevronLeft size={26}/>
</button>


<button
style={styles.arrowRight}
onClick={()=>setCurrentSlide(
(prev)=>
(prev+1)%bannerSlides.length
)}
>
<ChevronRight size={26}/>
</button>



{/* Dots */}

<div style={styles.dots}>
{bannerSlides.map((_,i)=>(
<div
key={i}
onClick={()=>setCurrentSlide(i)}
style={{
...styles.dot,
background:
i===currentSlide
? '#111'
: '#bbb'
}}
/>
))}
</div>

</div>




{/* Categories */}

<div style={styles.section}>

<h2 style={styles.heading}>
Shop by Category
</h2>

<div style={styles.grid}>

{categoryItems.map(cat=>(
<Link
key={cat.slug}
to={`/products?category=${cat.slug}`}
style={styles.categoryCard}
>
<div style={{fontSize:'42px'}}>
{cat.emoji}
</div>

<div>
{cat.name}
</div>

</Link>
))}

</div>

</div>





{/* Deal Products */}

<div style={styles.section}>

<h2 style={styles.heading}>
Today's Deals
</h2>

<div style={styles.productsWrap}>

{loading
? 'Loading...'
: dealsProducts.map(p=>(
<ProductCard
key={p.id}
product={p}
/>
))
}

</div>

</div>





{/* Trust Badges */}

<div style={styles.section}>

<h2 style={styles.heading}>
Why Shop With Us
</h2>

<div style={styles.grid}>

{[
{Icon:Truck,text:'Free Delivery'},
{Icon:RotateCcw,text:'Easy Returns'},
{Icon:Shield,text:'Secure Payment'},
{Icon:Headphones,text:'24/7 Support'}
].map(({Icon,text},i)=>(
<div
key={i}
style={styles.trustCard}
>
<Icon size={35}/>
<p>{text}</p>
</div>
))}

</div>

</div>





{/* Featured Products */}

<div style={styles.section}>

<h2 style={styles.heading}>
Featured Products
</h2>

<div style={styles.productsWrap}>

{loading
? 'Loading...'
: featuredProducts.map(p=>(
<ProductCard
key={p.id}
product={p}
/>
))
}

</div>

</div>



<Footer />





<style>{`

@keyframes float1{
0%{transform:translateY(0px);}
50%{transform:translateY(-25px);}
100%{transform:translateY(0px);}
}

@keyframes float2{
0%{transform:translateY(0px);}
50%{transform:translateY(20px);}
100%{transform:translateY(0px);}
}

@keyframes pulse{
0%{transform:scale(1);}
50%{transform:scale(1.08);}
100%{transform:scale(1);}
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  div[style*="arrowLeft"], div[style*="arrowRight"] {
    display: block !important;
  }
}

/* Tablet (768px - 1023px) */
@media (max-width: 1023px) {
  div {
    box-sizing: border-box;
  }
}

/* Mobile (up to 767px) */
@media (max-width: 767px) {
  div {
    box-sizing: border-box;
  }

  /* Adjust grid for small screens */
  [style*="gridTemplateColumns"] {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

/* Extra small (up to 480px) */
@media (max-width: 480px) {
  [style*="gridTemplateColumns"] {
    grid-template-columns: 1fr !important;
  }
}

`}</style>


</div>

);
}



const styles={

page:{
background:'#ffffff',
minHeight:'100vh'
},

heroWrapper:{
position:'relative',
height:'clamp(300px, 80vh, 500px)',
overflow:'hidden',
marginBottom:'clamp(30px, 5vh, 50px)'
},

slide:{
position:'absolute',
inset:0,
transition:'all .8s ease'
},

heroImage:{
width:'100%',
height:'100%',
objectFit:'cover'
},

heroContent:{
position:'absolute',
top:'50%',
left:'50%',
transform:'translate(-50%, -50%)',
background:'rgba(255,255,255,0.9)',
padding:'clamp(20px, 5vw, 35px)',
borderRadius:'12px',
maxWidth:'clamp(280px, 90vw, 520px)',
boxShadow:'0 10px 30px rgba(0,0,0,.15)',
textAlign:'center'
},

heroTitle:{
fontSize:'clamp(28px, 6vw, 52px)',
marginBottom:'clamp(10px, 2vh, 15px)',
lineHeight:'1.2'
},

heroSubtitle:{
fontSize:'clamp(14px, 3vw, 20px)',
marginBottom:'clamp(15px, 2vh, 25px)',
lineHeight:'1.4'
},

heroBtn:{
padding:'clamp(10px 20px, 2vw 3vw, 15px 32px)',
border:'none',
borderRadius:'8px',
background:'#111',
color:'#fff',
cursor:'pointer',
fontSize:'clamp(14px, 2vw, 18px)',
fontWeight:'600',
transition:'all 0.3s ease'
},

arrowLeft:{
position:'absolute',
top:'50%',
left:'clamp(10px, 3vw, 20px)',
transform:'translateY(-50%)',
background:'#fff',
border:'none',
padding:'clamp(8px, 2vw, 12px)',
borderRadius:'50%',
cursor:'pointer',
zIndex:10,
display:'none'
},

arrowRight:{
position:'absolute',
top:'50%',
right:'clamp(10px, 3vw, 20px)',
transform:'translateY(-50%)',
background:'#fff',
border:'none',
padding:'clamp(8px, 2vw, 12px)',
borderRadius:'50%',
cursor:'pointer',
zIndex:10,
display:'none'
},

dots:{
position:'absolute',
bottom:'clamp(15px, 3vh, 25px)',
width:'100%',
display:'flex',
justifyContent:'center',
gap:'8px'
},

dot:{
width:'10px',
height:'10px',
borderRadius:'50%',
cursor:'pointer'
},

floatPhone:{
position:'absolute',
bottom:'80px',
right:'10%',
fontSize:'60px',
animation:'float1 3s ease-in-out infinite',
opacity:0.7
},

floatLaptop:{
position:'absolute',
top:'30px',
right:'5%',
fontSize:'70px',
animation:'float2 4s ease-in-out infinite',
opacity:0.6
},

floatBag:{
position:'absolute',
bottom:'30px',
left:'5%',
fontSize:'65px',
animation:'float1 3.5s ease-in-out infinite',
opacity:0.6
},


/* Floating moving offer images */







section:{
padding:'clamp(25px, 5vw, 40px) clamp(15px, 5%, 7%)'
},

heading:{
fontSize:'clamp(24px, 5vw, 34px)',
marginBottom:'clamp(15px, 3vh, 25px)',
fontWeight:'700'
},

grid:{
display:'grid',
gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))',
gap:'clamp(15px, 4vw, 25px)',
alignItems:'center'
},

productsWrap:{
display:'grid',
gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',
gap:'clamp(15px, 4vw, 25px)',
width:'100%'
},

categoryCard:{
background:'#fff',
padding:'clamp(20px, 5vw, 30px)',
borderRadius:'12px',
boxShadow:'0 4px 12px rgba(0,0,0,.08)',
textDecoration:'none',
color:'#111',
fontWeight:'600',
textAlign:'center',
transition:'transform 0.3s ease, box-shadow 0.3s ease'
},

trustCard:{
background:'#fff',
padding:'clamp(25px, 5vw, 35px)',
borderRadius:'12px',
boxShadow:'0 4px 12px rgba(0,0,0,.08)',
textAlign:'center',
transition:'transform 0.3s ease, box-shadow 0.3s ease'
}

};


export default LandingPage;