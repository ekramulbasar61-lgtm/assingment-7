import Link from "next/link";

interface ProductChange {
  dir: 'up' | 'down' | 'flat';
  pct: number;
}

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  change: ProductChange;
  image: string;
}

interface ProductChange {
  dir: "up" | "down" | "flat";
  pct: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const isUp = product.change.dir === 'up';
  const isDown = product.change.dir === 'down';
  const isFlat = product.change.dir === 'flat';
  
  // Format to Bengali digits
  const formatBn = (num: number) => new Intl.NumberFormat('bn-BD').format(num);

  return (
    <Link href={`/product/${product.slug}`} className="block group">
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            {product.image}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{product.nameBn}</h3>
            <p className="text-xs text-gray-500">{product.categoryIcon} {product.categoryNameBn} · প্রতি {product.unit === 'kg' ? 'কেজি' : (product.unit === 'l' || product.unit === 'liter' ? 'লিটার' : product.unit)}</p>
          </div>
        </div>
        
        <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">আজকের দাম</p>
            <p className="font-bold text-gray-900">{formatBn(product.today)} টাকা</p>
          </div>
          
          <div className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
            isUp ? 'bg-red-50 text-red-600' : isDown ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
          }`}>
            {isUp && <span>▲</span>}
            {isDown && <span>▼</span>}
            {isFlat && <span>—</span>}
            <span>{isFlat ? '০.০' : formatBn(Math.abs(product.change.pct))}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
