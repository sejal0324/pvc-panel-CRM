import "./InventoryPage.css";
import {
    Package,
    AlertTriangle,
    TrendingUp,
    Boxes
} from "lucide-react";

const inventory=[

{
id:1,
name:"PVC Wall Panel White",
sku:"PVC-101",
stock:420,
reorder:100,
status:"Healthy"
},

{
id:2,
name:"PVC Ceiling Panel",
sku:"PVC-102",
stock:48,
reorder:100,
status:"Low Stock"
},

{
id:3,
name:"UV Marble Sheet",
sku:"UV-220",
stock:620,
reorder:150,
status:"Healthy"
},

{
id:4,
name:"Corner Profile",
sku:"CP-021",
stock:22,
reorder:80,
status:"Critical"
},

{
id:5,
name:"PVC Adhesive",
sku:"AD-002",
stock:380,
reorder:120,
status:"Fast Moving"
},

{
id:6,
name:"Charcoal Panel",
sku:"CH-012",
stock:18,
reorder:70,
status:"Dead Stock"
}

];

export default function InventoryPage(){

return(

<div className="inventory-container">

<div className="inventory-header">

<h1>

Inventory Dashboard

</h1>

<p>

Real-time inventory overview

</p>

</div>

<div className="inventory-metrics">

<div className="metric">

<Boxes/>

<div>

<h2>1490</h2>

<span>Total Stock</span>

</div>

</div>

<div className="metric">

<TrendingUp/>

<div>

<h2>18</h2>

<span>Fast Moving</span>

</div>

</div>

<div className="metric">

<AlertTriangle/>

<div>

<h2>2</h2>

<span>Low Stock</span>

</div>

</div>

<div className="metric">

<Package/>

<div>

<h2>₹18.4L</h2>

<span>Inventory Value</span>

</div>

</div>

</div>

<table className="inventory-table">

<thead>

<tr>

<th>Product</th>

<th>SKU</th>

<th>Stock</th>

<th>Reorder Level</th>

<th>Status</th>

</tr>

</thead>

<tbody>

{

inventory.map(product=>(

<tr key={product.id}>

<td>{product.name}</td>

<td>{product.sku}</td>

<td>{product.stock}</td>

<td>{product.reorder}</td>

<td>

<span className={`status ${product.status.replace(" ","-").toLowerCase()}`}>

{product.status}

</span>

</td>

</tr>

))

}

</tbody>

</table>

</div>

);

}