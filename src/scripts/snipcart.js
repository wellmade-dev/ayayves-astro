const SNIPCART_API_KEY = import.meta.env.SNIPCART_PUBLIC_API_KEY;
const encodedKey = btoa(`${SNIPCART_API_KEY}:`);
const apiHeaders = {
  Authorization: `Basic ${encodedKey}`,
  Accept: "application/json",
};

export async function fetchFromSnipcart() {
  const request = await fetch("https://app.snipcart.com/api/orders", {
    method: "GET", // Explicitly specify the method for clarity
    headers: apiHeaders,
  });

  if (!request.ok) {
    // Handle HTTP errors (e.g., unauthorized, not found, etc.)
    throw new Error(`Error: ${request.status}`);
  }

  const result = await request.json();
  return result;
}

export async function postAddToCart() {
  document.getElementById("atc-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    const form = e.target;
    let customFields;
    const variantTypes = form.querySelectorAll(".variant-w");

    if (variantTypes) {
      variantTypes.forEach((variant) => {
        const activeOptions = Array.from(
          variant.querySelectorAll('input[type="radio"]:enabled')
        );

        let variantOptions = [];

        const variantGroupName = activeOptions[0].name;
        const selectedVariant = activeOptions.find((option) => option.checked);

        activeOptions.forEach((option) => {
          const variantName = option.value;
          const variantPrice = option.attributes[4].value | 0;
          variantOptions.push({
            name: variantName,
            priceModifier: variantPrice,
          });
        });

        console.log(variantOptions);

        customFields = [
          {
            name: variantGroupName,
            options: "Medium|Large",
            value: selectedVariant.value,
          },
        ];
      });
    }

    const product = {
      id: form.id.value,
      name: form.name.value,
      price: form.price.value,
      url: form.url.value,
      description: form.description.value,
      quantity: form.quantity.value,
      customFields: [
        {
          name: "Size",
          options: "Medium|Large",
          value: "Medium",
        },
      ],
    };

    console.log(product);

    // Add the product to the cart using Snipcart's API
    Snipcart.api.cart.items
      .add(product)
      .then(() => {
        console.log("Product added to cart");
      })
      .catch((error) => {
        console.error("Could not add product to cart", error);
      });
  });
}
