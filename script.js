const cardContainer = document.querySelector(".tree-card-container");
const categoriesList = document.querySelector(".treeCategories");
const spinner = document.getElementById("spinner");
const totalAmountEl = document.querySelector(".total-amount");
const cartContainer = document.querySelector(".cart-items-container");
const modal = document.getElementById("treeModal");
const modalCloseBtn = document.querySelector(".modal-btn-close");
const treeDetails = document.querySelector(".treeDetails");

let total = 0;

// Spinner control
const showSpinner = () => spinner.classList.remove("hidden");
const hideSpinner = () => spinner.classList.add("hidden");

// Create Tree Card
const createCard = (tree) => {
  const card = document.createElement("div");
  card.className = "card bg-base-100 shadow-md border border-green-100 hover:shadow-lg transition-all duration-300";

  card.innerHTML = `
    <figure>
      <img src="${tree.image}" alt="${tree.name}" class="h-48 w-full object-cover rounded-t-lg" />
    </figure>
    <div class="card-body">
      <h2 class="card-title text-green-700">${tree.name}</h2>
      <p class="text-sm text-gray-600">${tree.description?.slice(0, 70) ?? ""}...</p>
      <p class="text-xs text-gray-500">${tree.category}</p>
      <p class="font-semibold text-green-800">৳${tree.price}</p>
      <div class="card-actions justify-end mt-2">
        <button class="btn btn-sm bg-yellow-400 text-green-800 hover:bg-yellow-500 view-btn">View</button>
        <button class="btn btn-sm bg-green-700 text-white hover:bg-green-800 add-btn">Add</button>
      </div>
    </div>
  `;

  card.querySelector(".view-btn").addEventListener("click", () => showDetails(tree));
  card.querySelector(".add-btn").addEventListener("click", () => addToCart(tree));

  return card;
};

// Show Modal Details
const showDetails = (tree) => {
  treeDetails.innerHTML = `
    <h3 class="text-2xl font-bold text-green-700 mb-3">${tree.name}</h3>
    <img src="${tree.image}" alt="${tree.name}" class="w-full max-h-72 object-cover rounded-lg mb-3">
    <p class="text-gray-700 mb-2">${tree.description}</p>
    <p class="font-semibold text-green-800">Category: ${tree.category}</p>
    <p class="font-semibold text-green-800">Price: ৳${tree.price}</p>
  `;
  modal.showModal();
};

modalCloseBtn.addEventListener("click", () => modal.close());

// Add Tree to Cart
const addToCart = (tree) => {
  const cartItem = document.createElement("div");
  cartItem.className = "flex justify-between items-center bg-green-50 p-2 rounded-lg shadow-sm";
  cartItem.innerHTML = `<span>${tree.name}</span><span>৳${tree.price}</span>`;
  cartContainer.appendChild(cartItem);
  total += tree.price;
  totalAmountEl.textContent = `৳${total}`;
};

// Load Trees
const loadTrees = async (url) => {
  showSpinner();
  cardContainer.innerHTML = "";
  try {
    const res = await fetch(url);
    const data = await res.json();
    const trees = data.plants || [];
    if (trees.length) {
      trees.forEach((tree) => cardContainer.appendChild(createCard(tree)));
    } else {
      cardContainer.innerHTML = "<p class='text-center text-gray-600'>No trees available.</p>";
    }
  } catch (err) {
    cardContainer.innerHTML = "<p class='text-center text-red-500'>Failed to load trees.</p>";
    console.error(err);
  } finally {
    hideSpinner();
  }
};

// Load All Trees
const loadAllTrees = () => loadTrees("https://openapi.programming-hero.com/api/plants");

// Load Trees by Category
const loadCategoryTrees = (id, clickedBtn) => {
  loadTrees(`https://openapi.programming-hero.com/api/category/${id}`);
  document.querySelectorAll(".category-item").forEach(btn => btn.classList.remove("bg-green-300","font-bold"));
  clickedBtn.classList.add("bg-green-300","font-bold");
};

// Load Categories
const loadCategories = async () => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
    if (data.status && data.data) {
      // "All Trees" button
      const allBtn = document.createElement("li");
      allBtn.className = "category-item btn w-full text-left border-none shadow-none bg-green-200 hover:bg-green-300";
      allBtn.textContent = "All Trees";
      allBtn.addEventListener("click", () => loadAllTrees());
      categoriesList.appendChild(allBtn);

      // Other categories
      data.data.forEach(cat => {
        const li = document.createElement("li");
        li.className = "category-item btn w-full text-left border-none shadow-none bg-green-100 hover:bg-green-200";
        li.textContent = cat.category;
        li.addEventListener("click", () => loadCategoryTrees(cat.id, li));
        categoriesList.appendChild(li);
      });
    }
  } catch (err) {
    console.error("Error loading categories:", err);
  }
};

// Initial Load
loadCategories();
loadAllTrees();
