const PUBLIC_SNIPCART_API_KEY = import.meta.env.SNIPCART_PUBLIC_API_KEY;
const encodedKey = btoa(`${SNIPCART_API_KEY}:`);
const apiHeaders = {
  Authorization: `Basic ${encodedKey}`,
  Accept: "application/json",
};

export function initSnipcart() {
  window.SnipcartSettings = {
    publicApiKey: PUBLIC_SNIPCART_API_KEY,
    loadStrategy: "on-user-interaction",
  };

  (function () {
    var c, d;
    (d = (c = window.SnipcartSettings).version) != null || (c.version = "3.0");
    var s, S;
    (S = (s = window.SnipcartSettings).timeoutDuration) != null ||
      (s.timeoutDuration = 2750);
    var l, p;
    (p = (l = window.SnipcartSettings).domain) != null ||
      (l.domain = "cdn.snipcart.com");
    var w, u;
    (u = (w = window.SnipcartSettings).protocol) != null ||
      (w.protocol = "https");
    var m, g;
    (g = (m = window.SnipcartSettings).loadCSS) != null || (m.loadCSS = !0);
    var y =
        window.SnipcartSettings.version.includes("v3.0.0-ci") ||
        (window.SnipcartSettings.version != "3.0" &&
          window.SnipcartSettings.version.localeCompare("3.4.0", void 0, {
            numeric: !0,
            sensitivity: "base",
          }) === -1),
      f = ["focus", "mouseover", "touchmove", "scroll", "keydown"];
    window.LoadSnipcart = o;
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", r)
      : r();
    function r() {
      window.SnipcartSettings.loadStrategy
        ? window.SnipcartSettings.loadStrategy === "on-user-interaction" &&
          (f.forEach(function (t) {
            return document.addEventListener(t, o);
          }),
          setTimeout(o, window.SnipcartSettings.timeoutDuration))
        : o();
    }
    var a = !1;
    function o() {
      if (a) return;
      a = !0;
      let t = document.getElementsByTagName("head")[0],
        n = document.querySelector("#snipcart"),
        i = document.querySelector(
          'src[src^="'
            .concat(window.SnipcartSettings.protocol, "://")
            .concat(window.SnipcartSettings.domain, '"][src$="snipcart.js"]')
        ),
        e = document.querySelector(
          'link[href^="'
            .concat(window.SnipcartSettings.protocol, "://")
            .concat(window.SnipcartSettings.domain, '"][href$="snipcart.css"]')
        );
      n ||
        ((n = document.createElement("div")),
        (n.id = "snipcart"),
        n.setAttribute("hidden", "true"),
        document.body.appendChild(n)),
        h(n),
        i ||
          ((i = document.createElement("script")),
          (i.src = ""
            .concat(window.SnipcartSettings.protocol, "://")
            .concat(window.SnipcartSettings.domain, "/themes/v")
            .concat(window.SnipcartSettings.version, "/default/snipcart.js")),
          (i.async = !0),
          t.appendChild(i)),
        !e &&
          window.SnipcartSettings.loadCSS &&
          ((e = document.createElement("link")),
          (e.rel = "stylesheet"),
          (e.type = "text/css"),
          (e.href = ""
            .concat(window.SnipcartSettings.protocol, "://")
            .concat(window.SnipcartSettings.domain, "/themes/v")
            .concat(window.SnipcartSettings.version, "/default/snipcart.css")),
          t.prepend(e)),
        f.forEach(function (v) {
          return document.removeEventListener(v, o);
        });
    }
    function h(t) {
      !y ||
        ((t.dataset.apiKey = window.SnipcartSettings.publicApiKey),
        window.SnipcartSettings.addProductBehavior &&
          (t.dataset.configAddProductBehavior =
            window.SnipcartSettings.addProductBehavior),
        window.SnipcartSettings.modalStyle &&
          (t.dataset.configModalStyle = window.SnipcartSettings.modalStyle),
        window.SnipcartSettings.currency &&
          (t.dataset.currency = window.SnipcartSettings.currency),
        window.SnipcartSettings.templatesUrl &&
          (t.dataset.templatesUrl = window.SnipcartSettings.templatesUrl));
    }
  })();
}

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
