import {getListProductService,
        deleteProductService,
        addProductService,
        getProductById,
        updateProductById,
        callApi,
} from "./utils/callapi.js";
import Product from "./models/product.js";


const renderHTML = () => {
    const contentHTML = `
    <div class="card text-white bg-dark">
    <div class="card-body">
        <h4 class="card-title">Danh sách sản phẩm</h4>
        <div class='container'>
            <div class="row">
                <div class="col-md-3">
                    <input id="maSP" class="form-control" placeholder="Mã SP" disabled />
                </div>
                <div class="col-md-3">
                    <input id="tenSP" class="form-control" placeholder="Tên SP" />
                </div>
                <div class="col-md-3">
                    <input id="gia" class="form-control" placeholder="Giá" />
                </div>
                <div class="col-md-3">
                    <input id="hinhAnh" class="form-control" placeholder="Link hình" />
                </div>
            </div>
            <br />
            <button id="btnThem" class="btn btn-success">Thêm sản phẩm</button>
            <button id="btnCapNhat" class="btn btn-success">Cap nhat</button>
        </div>
    </div>
</div>
<div class="container">
    <table class="table">
        <thead>
            <tr>
                <th>Mã SP</th>
                <th>Tên SP</th>
                <th>Giá </th>
                <th>Hình ảnh</th>
                <th></th>
            </tr>
        </thead>
        <tbody id="tblDanhSachSanPham">

        </tbody>
    </table>
</div>
    `;
    document.getElementById("root").innerHTML = contentHTML;
}

const renderTable = (listProduct) => {
    if(listProduct && listProduct.length > 0){
        let contentHTML = "";
        listProduct.map((product)=>{
            contentHTML +=`
                <tr>
                    <td>${product.id}</td>
                    <td>${product.tenSP}</td>
                    <td>${product.gia}</td>
                    <td>
                        <img src="${product.hinhAnh}" width="50px">
                    </td>
                    <td>
                        <button class="btn btn-info" onclick="editProduct(${product.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
        return contentHTML;
    }
}

const renderListProduct = () => {
    callApi("SanPham", "GET", null)
    .then((result)=>{
        console.log(result.data);
        const contentTbody = renderTable(result.data)
        document.getElementById("tblDanhSachSanPham").innerHTML = contentTbody;
    })
    .catch((err)=>{
        console.log(err);
    });
};

renderHTML();
renderListProduct();

/**
 * Delete Product
 */

window.deleteProduct = deleteProduct;
function deleteProduct(id){
    callApi(`SanPham/${id}`,"DELETE",null)
    .then(()=>{
        alert("Delete Success");
        renderListProduct();
    })
    .catch((err)=>{
        console.log(err);
    });
}

/**
 * Edit product
 */
window.editProduct = editProduct;
function editProduct(id){
    callApi(`SanPham/${id}`, "PUT", null)
    .then((result)=>{
        console.log(result.data);
        document.getElementById("maSP").value = result.data.id;
        document.getElementById("tenSP").value = result.data.tenSP;
        document.getElementById("gia").value = result.data.gia;
        document.getElementById("hinhAnh").value = result.data.hinhAnh;
    })
    .catch((err)=>{
        console.log(err);
    });
}

/**
 * Them SP
 */

document.getElementById("btnThem").addEventListener("click", function(){
    /**
     * DOM tới 3 ô input ten, gia, hinh
     */
    const ten = document.getElementById("tenSP").value;
    const gia = document.getElementById("gia").value;
    const hinhAnh = document.getElementById("hinhAnh").value;

    const product = new Product("", ten, gia, hinhAnh);
    
    callApi("SanPham", "POST", product)
    .then((result)=>{
        alert("Add product success");
        renderListProduct();
    })
    .catch((err)=>{
        console.log(err);
    });
});

document.getElementById("btnCapNhat").addEventListener("click", function(){
    const id = document.getElementById("maSP").value;
    const ten = document.getElementById("tenSP").value;
    const gia = document.getElementById("gia").value;
    const hinhAnh = document.getElementById("hinhAnh").value;

    const product = new Product(id, ten, gia, hinhAnh);

    updateProductById(product)
    .then((result)=>{
        alert("Update success");
        renderListProduct();
    })
    .catch((err)=>{
        console.log(err);
    });
});